#!/usr/bin/env bash
set -euo pipefail

# Deploy wedding invitation AWS backend via CloudFormation
# Usage:
#   ./deploy.sh              # create or update stack
#   ./deploy.sh --delete     # delete stack
#   AWS_REGION=us-east-1 ./deploy.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE_FILE="${SCRIPT_DIR}/template.yaml"
LAMBDA_DIR="${SCRIPT_DIR}/lambda"
LAMBDA_ZIP="${LAMBDA_DIR}/function.zip"
LAMBDA_FUNCTION_NAME="${LAMBDA_FUNCTION_NAME:-handle-guest-form-submission}"

AWS_PROFILE="${AWS_PROFILE:-wedding}"
STACK_NAME="${STACK_NAME:-wedding}"
AWS_REGION="${AWS_REGION:-ca-central-1}"

aws_cmd() {
  aws --profile "${AWS_PROFILE}" --region "${AWS_REGION}" "$@"
}

log() {
  printf '[deploy] %s\n' "$*"
}

die() {
  printf '[deploy] ERROR: %s\n' "$*" >&2
  exit 1
}

require_aws_cli() {
  command -v aws >/dev/null 2>&1 || die "AWS CLI not found. Install with: brew install awscli"
}

require_template() {
  [[ -f "${TEMPLATE_FILE}" ]] || die "Template not found: ${TEMPLATE_FILE}"
}

verify_profile() {
  log "Using AWS profile: ${AWS_PROFILE}"
  log "Using AWS region:  ${AWS_REGION}"
  aws_cmd sts get-caller-identity >/dev/null || die "Cannot use profile '${AWS_PROFILE}'. Run: aws configure --profile ${AWS_PROFILE}"
}

stack_exists() {
  aws_cmd cloudformation describe-stacks --stack-name "${STACK_NAME}" >/dev/null 2>&1
}

stack_status() {
  aws_cmd cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --query 'Stacks[0].StackStatus' \
    --output text 2>/dev/null || echo "NOT_FOUND"
}

wait_for_stack() {
  local action="$1"
  log "Waiting for stack ${action} to complete..."
  aws_cmd cloudformation wait "stack-${action}-complete" --stack-name "${STACK_NAME}"
}

print_outputs() {
  log "Stack outputs:"
  aws_cmd cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --query 'Stacks[0].Outputs[*].[OutputKey,OutputValue,Description]' \
    --output table

  local api_endpoint
  api_endpoint="$(aws_cmd cloudformation describe-stacks \
    --stack-name "${STACK_NAME}" \
    --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue | [0]" \
    --output text)"

  if [[ -n "${api_endpoint}" && "${api_endpoint}" != "None" ]]; then
    printf '\n'
    log "Next step: update src/constants/config.ts"
    printf "export const API_ENDPOINT = '%s'\n" "${api_endpoint}"
  fi
}

create_stack() {
  log "Creating stack '${STACK_NAME}'..."
  aws_cmd cloudformation create-stack \
    --stack-name "${STACK_NAME}" \
    --template-body "file://${TEMPLATE_FILE}" \
    --capabilities CAPABILITY_NAMED_IAM \
    --tags Key=Project,Value=WeddingInvitation
  wait_for_stack create
  log "Stack created successfully."
}

update_stack() {
  local update_log
  update_log="$(mktemp)"
  trap "rm -f '${update_log}'" RETURN

  log "Updating stack '${STACK_NAME}'..."
  if ! aws_cmd cloudformation update-stack \
    --stack-name "${STACK_NAME}" \
    --template-body "file://${TEMPLATE_FILE}" \
    --capabilities CAPABILITY_NAMED_IAM \
    --tags Key=Project,Value=WeddingInvitation >"${update_log}" 2>&1; then
    if grep -q "No updates are to be performed" "${update_log}"; then
      log "No template changes detected. Stack is already up to date."
      return 0
    fi
    cat "${update_log}" >&2
    die "Stack update failed."
  fi
  wait_for_stack update
  log "Stack updated successfully."
}

deploy_stack() {
  if stack_exists; then
    local status
    status="$(stack_status)"
    case "${status}" in
      CREATE_COMPLETE|UPDATE_COMPLETE|UPDATE_ROLLBACK_COMPLETE)
        update_stack
        ;;
      ROLLBACK_COMPLETE|ROLLBACK_FAILED)
        log "Stack is in ${status} after a failed deploy. Deleting before retry..."
        delete_stack
        create_stack
        ;;
      *_IN_PROGRESS)
        die "Stack '${STACK_NAME}' is currently ${status}. Wait and retry."
        ;;
      *)
        die "Stack '${STACK_NAME}' is in state ${status}. Resolve in AWS Console before redeploying."
        ;;
    esac
  else
    create_stack
  fi
}

delete_stack() {
  if ! stack_exists; then
    log "Stack '${STACK_NAME}' does not exist. Nothing to delete."
    return 0
  fi

  log "Deleting stack '${STACK_NAME}'..."
  aws_cmd cloudformation delete-stack --stack-name "${STACK_NAME}"
  wait_for_stack delete
  log "Stack deleted successfully."
}

build_lambda_package() {
  log "Building Lambda deployment package..."
  command -v npm >/dev/null 2>&1 || die "npm not found. Install Node.js to deploy Lambda code."
  (
    cd "${LAMBDA_DIR}"
    if [[ -f package-lock.json ]]; then
      npm ci --omit=dev --silent
    else
      npm install --omit=dev --silent
    fi
    rm -f function.zip
    zip -rq function.zip index.js package.json node_modules
  )
}

deploy_lambda_code() {
  [[ -f "${LAMBDA_DIR}/index.js" ]] || die "Lambda handler not found: ${LAMBDA_DIR}/index.js"
  build_lambda_package
  log "Updating Lambda function code (${LAMBDA_FUNCTION_NAME})..."
  aws_cmd lambda update-function-code \
    --function-name "${LAMBDA_FUNCTION_NAME}" \
    --zip-file "fileb://${LAMBDA_ZIP}" \
    --no-cli-pager >/dev/null
  aws_cmd lambda wait function-updated --function-name "${LAMBDA_FUNCTION_NAME}"
  log "Lambda code updated successfully."
}

main() {
  require_aws_cli
  require_template
  verify_profile

  case "${1:-deploy}" in
    deploy)
      deploy_stack
      deploy_lambda_code
      print_outputs
      ;;
    --delete|delete)
      delete_stack
      ;;
    --status|status)
      local status
      status="$(stack_status)"
      log "Stack status: ${status}"
      if [[ "${status}" != "NOT_FOUND" ]]; then
        print_outputs
      fi
      ;;
    --help|-h|help)
      cat <<EOF
Usage: $(basename "$0") [command]

Commands:
  deploy        Create or update CloudFormation stack (default)
  delete        Delete CloudFormation stack
  status        Show stack status and outputs

Environment variables:
  AWS_PROFILE   AWS CLI profile (default: wedding)
  AWS_REGION    AWS region (default: ca-central-1)
  STACK_NAME    CloudFormation stack name (default: wedding)
EOF
      ;;
    *)
      die "Unknown command: $1. Use --help for usage."
      ;;
  esac
}

main "$@"

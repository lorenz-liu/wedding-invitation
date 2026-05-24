#!/usr/bin/env bash
set -euo pipefail

# Deploy wedding invitation CloudBase backend (cloud function + database)
#
# Prerequisites:
#   npm i -g @cloudbase/cli
#   tcb login
#
# Usage:
#   ./deploy.sh              # deploy cloud function
#   ./deploy.sh --status     # show env info
#   ./deploy.sh --help

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_ID="${CLOUD_ENV_ID:-wedding-d8gbgwafs7b3e5340}"
FUNCTION_NAME="${CLOUD_FUNCTION_NAME:-submitGuestForm}"
COLLECTION_NAME="${DB_COLLECTION:-wedding-guests}"

log() {
  printf '[deploy] %s\n' "$*"
}

die() {
  printf '[deploy] ERROR: %s\n' "$*" >&2
  exit 1
}

require_tcb() {
  command -v tcb >/dev/null 2>&1 || die "CloudBase CLI not found. Install with: npm i -g @cloudbase/cli"
}

deploy_function() {
  log "Deploying cloud function '${FUNCTION_NAME}' to env ${ENV_ID}..."
  (
    cd "${SCRIPT_DIR}"
    tcb fn deploy "${FUNCTION_NAME}" --dir "cloudfunctions/${FUNCTION_NAME}" -e "${ENV_ID}" --force
  )
  log "Cloud function deployed."
}

ensure_collection() {
  log "Database collection '${COLLECTION_NAME}':"
  log "  CloudBase CLI 3.x no longer supports 'tcb db collection create'."
  log "  The collection is auto-created when the cloud function first writes data."
  log "  Or create manually: DevTools → 云开发 → 数据库 → 添加集合 → ${COLLECTION_NAME}"
}

print_next_steps() {
  printf '\n'
  log "Deployment complete."
  log "Next steps:"
  printf '  1. WeChat DevTools → 云开发 → 云函数 → 确认 %s 已上线\n' "${FUNCTION_NAME}"
  printf '  2. 云开发 → 数据库 → 确认集合 %s 存在（首次提交表单时会自动创建，也可手动添加）\n' "${COLLECTION_NAME}"
  printf '  3. 如需短信通知，在云函数环境变量中配置 SMS_*（见 infra/README.md）\n'
  printf '  4. H5 如需提交表单，在云开发控制台为云函数开启 HTTP 访问，并填入 src/constants/config.ts\n'
  printf '  5. pnpm build:weapp 后在开发者工具中测试回函提交\n'
}

main() {
  require_tcb

  case "${1:-deploy}" in
    deploy)
      deploy_function
      ensure_collection
      print_next_steps
      ;;
    --status|status)
      log "Env ID: ${ENV_ID}"
      log "Function: ${FUNCTION_NAME}"
      log "Collection: ${COLLECTION_NAME}"
      tcb env list 2>/dev/null || true
      ;;
    --help|-h|help)
      cat <<EOF
Usage: $(basename "$0") [command]

Commands:
  deploy        Deploy cloud function (default)
  status        Show env and resource names

Environment variables:
  CLOUD_ENV_ID         CloudBase env ID (default: wedding-d8gbgwafs7b3e5340)
  CLOUD_FUNCTION_NAME  Cloud function name (default: submitGuestForm)
  DB_COLLECTION        Database collection (default: wedding-guests)
EOF
      ;;
    *)
      die "Unknown command: $1. Use --help for usage."
      ;;
  esac
}

main "$@"

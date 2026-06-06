import {
  aliyunAssetUrl,
  guestFormApiUrl,
  isAliyunConfigured,
} from "./aliyun";

export const FORM_SUBMITTED_KEY = "wedding-form-submitted";

/** Persist last visited page across reloads (dev + production). */
export const RESUME_LAST_PAGE_KEY = "wedding-last-page-index";
export const RESUME_LAST_PAGE_ENABLED = true;

export function isFormBackendConfigured(): boolean {
  return isAliyunConfigured();
}

export function getGuestFormApiUrl(): string {
  return guestFormApiUrl();
}

export function getCdnAssetUrl(relativePath: string): string {
  return aliyunAssetUrl(relativePath);
}

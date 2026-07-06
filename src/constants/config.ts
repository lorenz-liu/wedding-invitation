import Taro from "@tarojs/taro";
import {
  aliyunAssetUrl,
  guestDrawingApiUrl,
  guestFormApiUrl,
  isAliyunConfigured,
} from "./aliyun";

export const FORM_SUBMITTED_KEY = "wedding-form-submitted";
export const GUEST_ID_KEY = "wedding-guest-id";
export const DOODLE_DRAFT_KEY = "wedding-doodle-draft";

export const FORM_PAGE_INDEX = 14;
export const DOODLE_PAGE_INDEX = 15;

export function isFormSubmitted(): boolean {
  try {
    return Boolean(Taro.getStorageSync(FORM_SUBMITTED_KEY));
  } catch {
    return false;
  }
}

export function getMaxPageIndex(formSubmitted: boolean): number {
  return formSubmitted ? DOODLE_PAGE_INDEX : FORM_PAGE_INDEX;
}

export function getTotalInvitationPages(formSubmitted: boolean): number {
  return getMaxPageIndex(formSubmitted) + 1;
}

/** Persist last visited page across reloads (dev + production). */
export const RESUME_LAST_PAGE_KEY = "wedding-last-page-index";
export const RESUME_LAST_PAGE_ENABLED = true;

export function isFormBackendConfigured(): boolean {
  return isAliyunConfigured();
}

export function getGuestFormApiUrl(): string {
  return guestFormApiUrl();
}

export function getGuestDrawingApiUrl(): string {
  return guestDrawingApiUrl();
}

export function getCdnAssetUrl(relativePath: string): string {
  return aliyunAssetUrl(relativePath);
}

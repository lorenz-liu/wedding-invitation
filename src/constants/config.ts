import Taro from "@tarojs/taro";
import {
  aliyunAssetUrl,
  guestDrawingApiUrl,
  guestFormApiUrl,
  isAliyunConfigured,
} from "./aliyun";

export const FORM_SUBMITTED_KEY = "wedding-form-submitted";
export const GUEST_ID_KEY = "wedding-guest-id";
export const FORM_DATA_KEY = "wedding-form-data";
export const DOODLE_DRAFT_KEY = "wedding-doodle-draft";

export const HOME_PAGE_INDEX = 0;
export const SCHEDULE_PAGE_INDEX = 12;
export const LOCATION_PAGE_INDEX = 13;
export const FORM_PAGE_INDEX = 14;
export const DOODLE_PAGE_INDEX = 15;
export const FINAL_PAGE_INDEX = 16;

export function isFormSubmitted(): boolean {
  try {
    return Boolean(Taro.getStorageSync(FORM_SUBMITTED_KEY));
  } catch {
    return false;
  }
}

export function getMaxPageIndex(formThanksVisible: boolean): number {
  return formThanksVisible ? FINAL_PAGE_INDEX : FORM_PAGE_INDEX;
}

export function getTotalInvitationPages(formThanksVisible: boolean): number {
  return getMaxPageIndex(formThanksVisible) + 1;
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

/** WeChat mini program share — image must be HTTPS. */
export const SHARE_TITLE = "刘兆薰 & 高文珩 婚礼请柬";
export const SHARE_PATH = "/pages/index/index";
export const SHARE_IMAGE_URL = aliyunAssetUrl("images/logo-no-bg.webp");

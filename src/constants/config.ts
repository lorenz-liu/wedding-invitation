import {
  cloudflareAssetUrl,
  guestFormApiUrl,
  isCloudflareConfigured,
} from "./cloudflare";

export const FORM_SUBMITTED_KEY = "wedding-form-submitted";

export function isFormBackendConfigured(): boolean {
  return isCloudflareConfigured();
}

export function getGuestFormApiUrl(): string {
  return guestFormApiUrl();
}

export function getCdnAssetUrl(relativePath: string): string {
  return cloudflareAssetUrl(relativePath);
}

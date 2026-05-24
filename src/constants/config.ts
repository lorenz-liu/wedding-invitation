import { isCloudEnvConfigured } from "./cloud";

/** Cloud function that handles guest RSVP submissions. */
export const CLOUD_FUNCTION_NAME = "submitGuestForm";

/**
 * Optional HTTP endpoint for H5 form submission.
 * Enable HTTP access for the cloud function in CloudBase console, then paste the URL here.
 */
export const CLOUD_HTTP_ENDPOINT =
  "wedding-d8gbgwafs7b3e5340-1306230692.ap-shanghai.app.tcloudbase.com";

export const FORM_SUBMITTED_KEY = "wedding-form-submitted";

export function isFormBackendConfigured(): boolean {
  if (process.env.TARO_ENV === "weapp") {
    return isCloudEnvConfigured();
  }
  return Boolean(CLOUD_HTTP_ENDPOINT);
}

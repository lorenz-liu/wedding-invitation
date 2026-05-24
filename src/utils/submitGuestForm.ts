import Taro from "@tarojs/taro";
import {
  CLOUD_FUNCTION_NAME,
  CLOUD_HTTP_ENDPOINT,
  isFormBackendConfigured,
} from "../constants/config";

export interface GuestFormPayload {
  mainContact: string;
  phone: string;
  wechatId: string;
  guests: Array<{ name: string; relation: string }>;
  dietaryRestrictions: string;
  isDriving: boolean;
  needsShuttle: boolean;
  shuttleLocation: string;
  notes: string;
}

export interface GuestFormResult {
  success: boolean;
  id?: string;
  smsSent?: boolean;
  message?: string;
  error?: string;
}

export async function submitGuestForm(
  formData: GuestFormPayload,
): Promise<GuestFormResult> {
  if (!isFormBackendConfigured()) {
    throw new Error("请先部署 CloudBase 云函数 submitGuestForm");
  }

  if (process.env.TARO_ENV === "weapp") {
    const response = await Taro.cloud.callFunction({
      name: CLOUD_FUNCTION_NAME,
      data: formData,
    });

    return (response.result || {}) as GuestFormResult;
  }

  if (!CLOUD_HTTP_ENDPOINT) {
    throw new Error("H5 尚未配置 CLOUD_HTTP_ENDPOINT");
  }

  const response = await Taro.request({
    url: CLOUD_HTTP_ENDPOINT,
    method: "POST",
    data: formData,
    header: {
      "Content-Type": "application/json",
    },
  });

  return response.data as GuestFormResult;
}

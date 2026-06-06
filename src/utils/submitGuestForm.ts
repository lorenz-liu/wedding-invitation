import Taro from "@tarojs/taro";
import { getGuestFormApiUrl, isFormBackendConfigured } from "../constants/config";

export interface GuestFormPayload {
  mainContact: string;
  phone: string;
  wechatId: string;
  guests: Array<{ name: string; relation: string }>;
  isDriving: boolean;
  needsShuttle: boolean;
  shuttleLocation: string;
  notes: string;
}

export interface GuestFormResult {
  success: boolean;
  id?: string;
  message?: string;
  error?: string;
}

export async function submitGuestForm(
  formData: GuestFormPayload,
): Promise<GuestFormResult> {
  if (!isFormBackendConfigured()) {
    throw new Error("请先部署阿里云函数计算并配置 ALIYUN_FC_BASE_URL");
  }

  const response = await Taro.request({
    url: getGuestFormApiUrl(),
    method: "POST",
    data: formData,
    header: {
      "Content-Type": "application/json",
    },
  });

  if (response.statusCode >= 400) {
    const data = response.data as GuestFormResult;
    return {
      success: false,
      error: data?.error || `HTTP ${response.statusCode}`,
      message: data?.message,
    };
  }

  return response.data as GuestFormResult;
}

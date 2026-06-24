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

function parseGuestFormResult(
  data: unknown,
  statusCode: number,
): GuestFormResult {
  let payload = data;

  if (typeof payload === "string") {
    const trimmed = payload.trim();
    if (trimmed === "ok") {
      return {
        success: false,
        error:
          "后端 API 未正确部署，请重新执行 pnpm deploy:aliyun 更新函数计算",
      };
    }
    try {
      payload = JSON.parse(trimmed);
    } catch {
      return {
        success: false,
        error: `服务器返回异常（HTTP ${statusCode}）`,
      };
    }
  }

  if (!payload || typeof payload !== "object") {
    return {
      success: false,
      error: `服务器返回异常（HTTP ${statusCode}）`,
    };
  }

  return payload as GuestFormResult;
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

  const result = parseGuestFormResult(response.data, response.statusCode);

  if (response.statusCode >= 400) {
    return {
      success: false,
      error: result.error || `HTTP ${response.statusCode}`,
      message: result.message,
    };
  }

  return result;
}

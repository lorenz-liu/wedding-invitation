import Taro from "@tarojs/taro";
import { getGuestDrawingApiUrl, isFormBackendConfigured } from "../constants/config";

export interface GuestDrawingPayload {
  guestId: string;
  imageBase64: string;
}

export interface GuestDrawingResult {
  success: boolean;
  drawingId?: string;
  message?: string;
  error?: string;
}

function parseResult(data: unknown, statusCode: number): GuestDrawingResult {
  let payload = data;

  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload.trim());
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

  return payload as GuestDrawingResult;
}

export async function submitGuestDrawing(
  payload: GuestDrawingPayload,
): Promise<GuestDrawingResult> {
  if (!isFormBackendConfigured()) {
    throw new Error("请先部署阿里云函数计算并配置 ALIYUN_FC_BASE_URL");
  }

  const response = await Taro.request({
    url: getGuestDrawingApiUrl(),
    method: "POST",
    data: payload,
    header: {
      "Content-Type": "application/json",
    },
  });

  const result = parseResult(response.data, response.statusCode);

  if (response.statusCode >= 400) {
    return {
      success: false,
      error: result.error || `HTTP ${response.statusCode}`,
      message: result.message,
    };
  }

  return result;
}

import Taro from "@tarojs/taro";

export type DoodleCanvas = HTMLCanvasElement | WechatMiniprogram.Canvas;

export async function exportCanvasToBase64(canvas: DoodleCanvas): Promise<string> {
  if (process.env.TARO_ENV === "h5") {
    const dataUrl = (canvas as HTMLCanvasElement).toDataURL("image/png");
    return dataUrl.split(",")[1] ?? "";
  }

  return new Promise((resolve, reject) => {
    Taro.canvasToTempFilePath({
      canvas: canvas as WechatMiniprogram.Canvas,
      fileType: "png",
      quality: 1,
      success: (res) => {
        Taro.getFileSystemManager().readFile({
          filePath: res.tempFilePath,
          encoding: "base64",
          success: (readRes) => resolve(String(readRes.data)),
          fail: reject,
        });
      },
      fail: reject,
    });
  });
}

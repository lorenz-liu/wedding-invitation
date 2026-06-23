/** True when TARO_APP_DEV=true (see .env.development). */
export function isDev(): boolean {
  return process.env.TARO_APP_DEV === "true";
}

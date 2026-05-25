export function toWeappLocalPath(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return path.startsWith("/") ? path : `/${path}`;
}

export function toWeappFontSource(path: string): string {
  return `url("${toWeappLocalPath(path)}")`;
}

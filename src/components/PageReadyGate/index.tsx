import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Image } from "@tarojs/components";
import "./index.scss";

const DEFAULT_TIMEOUT_MS = 1200;

/** Default true when used outside PageReadyGate (e.g. tests). */
const PageAnimationsReadyContext = createContext(true);

export function usePageAnimationsReady(): boolean {
  return useContext(PageAnimationsReadyContext);
}

export function uniqueImageUrls(urls: readonly string[]): string[] {
  return [...new Set(urls.filter(Boolean))];
}

interface PageReadyGateProps {
  imageUrls: readonly string[];
  isActive: boolean;
  timeoutMs?: number;
  children: React.ReactNode;
}

/**
 * Waits for page images to finish loading (hidden preload) before enabling animations.
 * Falls back after `timeoutMs` so the page never stays blank.
 */
export const PageReadyGate: React.FC<PageReadyGateProps> = ({
  imageUrls,
  isActive,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  children,
}) => {
  const uniqueUrls = useMemo(() => uniqueImageUrls(imageUrls), [imageUrls]);
  const loadedUrlsRef = useRef(new Set<string>());
  const [loadedVersion, setLoadedVersion] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    loadedUrlsRef.current = new Set();
    setLoadedVersion(0);
    setTimedOut(false);
  }, [uniqueUrls]);

  useEffect(() => {
    if (!isActive || uniqueUrls.length === 0) return;
    const timer = setTimeout(() => setTimedOut(true), timeoutMs);
    return () => clearTimeout(timer);
  }, [isActive, uniqueUrls, timeoutMs]);

  const markLoaded = useCallback((url: string) => {
    if (loadedUrlsRef.current.has(url)) return;
    loadedUrlsRef.current.add(url);
    setLoadedVersion(loadedUrlsRef.current.size);
  }, []);

  const allLoaded =
    uniqueUrls.length === 0 || loadedVersion >= uniqueUrls.length;
  const animationsReady = isActive && (allLoaded || timedOut);

  return (
    <PageAnimationsReadyContext.Provider value={animationsReady}>
      {isActive && uniqueUrls.length > 0 && (
        <View className="page-ready-gate-preload" aria-hidden>
          {uniqueUrls.map((url) => (
            <Image
              key={url}
              className="page-ready-gate-preload-img"
              src={url}
              mode="aspectFill"
              lazyLoad={false}
              onLoad={() => markLoaded(url)}
              onError={() => markLoaded(url)}
            />
          ))}
        </View>
      )}
      {children}
    </PageAnimationsReadyContext.Provider>
  );
};

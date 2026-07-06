import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  forwardRef,
} from "react";
import { Canvas, View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { DOODLE_DRAFT_KEY } from "../../constants/config";
import { exportCanvasToBase64, type DoodleCanvas } from "../../utils/exportDoodleCanvas";
import "./index.scss";

export const DOODLE_COLORS = [
  "#2c2c2c",
  "#c9a87c",
  "#d4574a",
  "#4a7fd4",
  "#3a9e68",
  "#8b5cf6",
] as const;

export const DOODLE_STROKES = [2, 4, 8, 12] as const;

export interface DoodleBoardHandle {
  exportBase64: () => Promise<string>;
  clear: () => void;
}

interface DoodleBoardProps {
  className?: string;
}

interface TouchPoint {
  x: number;
  y: number;
}

function getTouchPoint(e: Record<string, unknown>): TouchPoint | null {
  const detail = e.detail as { x?: number; y?: number } | undefined;
  if (typeof detail?.x === "number" && typeof detail?.y === "number") {
    return { x: detail.x, y: detail.y };
  }

  const touches = (e.touches || e.changedTouches) as
    | Array<{ x?: number; y?: number; clientX?: number; clientY?: number }>
    | undefined;

  const touch = touches?.[0];
  if (!touch) return null;

  if (typeof touch.x === "number" && typeof touch.y === "number") {
    return { x: touch.x, y: touch.y };
  }

  if (typeof touch.clientX === "number" && typeof touch.clientY === "number") {
    return { x: touch.clientX, y: touch.clientY };
  }

  return null;
}

export const DoodleBoard = forwardRef<DoodleBoardHandle, DoodleBoardProps>(
  function DoodleBoard({ className = "" }, ref) {
    const canvasRef = useRef<DoodleCanvas | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const sizeRef = useRef({ width: 0, height: 0 });
    const drawingRef = useRef(false);
    const lastPointRef = useRef<TouchPoint | null>(null);

    const [color, setColor] = useState<string>(DOODLE_COLORS[0]);
    const [strokeWidth, setStrokeWidth] = useState<number>(DOODLE_STROKES[1]);
    const [ready, setReady] = useState(false);

    const applyStrokeStyle = useCallback(() => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }, [color, strokeWidth]);

    const fillBackground = useCallback(() => {
      const ctx = ctxRef.current;
      const { width, height } = sizeRef.current;
      if (!ctx || !width || !height) return;
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
      applyStrokeStyle();
    }, [applyStrokeStyle]);

    const restoreDraft = useCallback(() => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      const { width, height } = sizeRef.current;
      if (!ctx || !canvas || !width || !height) return;

      let draft = "";
      try {
        draft = Taro.getStorageSync(DOODLE_DRAFT_KEY);
      } catch {
        return;
      }
      if (!draft) return;

      const src = `data:image/png;base64,${draft}`;

      if (process.env.TARO_ENV === "h5") {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
        };
        img.src = src;
        return;
      }

      const img = (canvas as WechatMiniprogram.Canvas).createImage();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = src;
    }, []);

    const persistDraft = useCallback(async () => {
      if (!canvasRef.current) return;
      try {
        const base64 = await exportCanvasToBase64(canvasRef.current);
        Taro.setStorageSync(DOODLE_DRAFT_KEY, base64);
      } catch {
        // ignore persistence errors
      }
    }, []);

    useEffect(() => {
      applyStrokeStyle();
    }, [applyStrokeStyle]);

    useEffect(() => {
      Taro.nextTick(() => {
        Taro.createSelectorQuery()
          .select("#doodle-canvas")
          .fields({ node: true, size: true })
          .exec((res) => {
            const nodeInfo = res?.[0];
            if (!nodeInfo?.node) return;

            const canvas = nodeInfo.node as DoodleCanvas;
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            const dpr = Taro.getSystemInfoSync().pixelRatio || 2;
            const width = nodeInfo.width;
            const height = nodeInfo.height;

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);

            canvasRef.current = canvas;
            ctxRef.current = ctx;
            sizeRef.current = { width, height };
            fillBackground();
            restoreDraft();
            setReady(true);
          });
      });
    }, [fillBackground, restoreDraft]);

    const drawLine = useCallback(
      (from: TouchPoint, to: TouchPoint) => {
        const ctx = ctxRef.current;
        if (!ctx) return;
        applyStrokeStyle();
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      },
      [applyStrokeStyle],
    );

    const handleTouchStart = useCallback(
      (e: { stopPropagation?: () => void; detail?: unknown; touches?: unknown }) => {
        e.stopPropagation?.();
        const point = getTouchPoint(e as Record<string, unknown>);
        if (!point || !ready) return;
        drawingRef.current = true;
        lastPointRef.current = point;
      },
      [ready],
    );

    const handleTouchMove = useCallback(
      (e: { stopPropagation?: () => void; preventDefault?: () => void; detail?: unknown; touches?: unknown }) => {
        e.stopPropagation?.();
        e.preventDefault?.();
        if (!drawingRef.current) return;
        const point = getTouchPoint(e as Record<string, unknown>);
        const last = lastPointRef.current;
        if (!point || !last) return;
        drawLine(last, point);
        lastPointRef.current = point;
      },
      [drawLine],
    );

    const handleTouchEnd = useCallback(
      (e: { stopPropagation?: () => void; detail?: unknown; changedTouches?: unknown }) => {
        e.stopPropagation?.();
        drawingRef.current = false;
        lastPointRef.current = null;
        void persistDraft();
      },
      [persistDraft],
    );

    useImperativeHandle(
      ref,
      () => ({
        exportBase64: async () => {
          if (!canvasRef.current) {
            throw new Error("Canvas not ready");
          }
          return exportCanvasToBase64(canvasRef.current);
        },
        clear: () => {
          fillBackground();
          Taro.removeStorageSync(DOODLE_DRAFT_KEY);
        },
      }),
      [fillBackground],
    );

    return (
      <View className={`doodle-board ${className}`.trim()}>
        <View className="doodle-toolbar">
          <View className="toolbar-group">
            <Text className="toolbar-label">颜色</Text>
            <View className="color-options">
              {DOODLE_COLORS.map((option) => (
                <View
                  key={option}
                  className={`color-swatch ${color === option ? "active" : ""}`}
                  style={{ backgroundColor: option }}
                  onClick={() => setColor(option)}
                />
              ))}
            </View>
          </View>
          <View className="toolbar-group">
            <Text className="toolbar-label">粗细</Text>
            <View className="stroke-options">
              {DOODLE_STROKES.map((option) => (
                <View
                  key={option}
                  className={`stroke-option ${strokeWidth === option ? "active" : ""}`}
                  onClick={() => setStrokeWidth(option)}
                >
                  <View
                    className="stroke-preview"
                    style={{ height: `${option}px` }}
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className="doodle-canvas-wrap">
          <Canvas
            type="2d"
            id="doodle-canvas"
            className="doodle-canvas"
            disableScroll
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          />
        </View>
      </View>
    );
  },
);

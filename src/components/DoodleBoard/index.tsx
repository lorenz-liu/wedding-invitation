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

export const DOODLE_ERASER_COLOR = "#ffffff";

export const DOODLE_COLORS = [
  { value: "#2c2c2c", className: "color-swatch--primary" },
  { value: "#c9a87c", className: "color-swatch--accent" },
  { value: "#6b6b6b", className: "color-swatch--secondary" },
  { value: DOODLE_ERASER_COLOR, className: "color-swatch--eraser" },
] as const;

export const DOODLE_STROKES = [2, 4, 8, 12] as const;
const MAX_UNDO_STEPS = 40;

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
    const strokeStartedRef = useRef(false);
    const undoStackRef = useRef<string[]>([]);
    const redoStackRef = useRef<string[]>([]);
    const lastSnapshotRef = useRef<string | null>(null);

    const [color, setColor] = useState<string>(DOODLE_COLORS[0].value);
    const [strokeWidth, setStrokeWidth] = useState<number>(DOODLE_STROKES[1]);
    const [ready, setReady] = useState(false);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const syncHistoryState = useCallback(() => {
      setCanUndo(undoStackRef.current.length > 0);
      setCanRedo(redoStackRef.current.length > 0);
    }, []);

    const resetHistory = useCallback(() => {
      undoStackRef.current = [];
      redoStackRef.current = [];
      lastSnapshotRef.current = null;
      syncHistoryState();
    }, [syncHistoryState]);

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

    const restoreSnapshot = useCallback(
      (base64: string, onRestored?: () => void) => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        const { width, height } = sizeRef.current;
        if (!ctx || !canvas || !width || !height || !base64) return;

        const src = `data:image/png;base64,${base64}`;

        const finishRestore = () => {
          applyStrokeStyle();
          onRestored?.();
        };

        if (process.env.TARO_ENV === "h5") {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            finishRestore();
          };
          img.src = src;
          return;
        }

        const img = (canvas as WechatMiniprogram.Canvas).createImage();
        img.onload = () => {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          finishRestore();
        };
        img.src = src;
      },
      [applyStrokeStyle],
    );

    const restoreDraft = useCallback(
      (onRestored?: () => void) => {
        const ctx = ctxRef.current;
        const canvas = canvasRef.current;
        const { width, height } = sizeRef.current;
        if (!ctx || !canvas || !width || !height) {
          onRestored?.();
          return;
        }

        let draft = "";
        try {
          draft = Taro.getStorageSync(DOODLE_DRAFT_KEY);
        } catch {
          onRestored?.();
          return;
        }
        if (!draft) {
          onRestored?.();
          return;
        }

        restoreSnapshot(draft, onRestored);
      },
      [restoreSnapshot],
    );

    const captureSnapshot = useCallback(async (): Promise<string | null> => {
      if (!canvasRef.current) return null;
      try {
        return await exportCanvasToBase64(canvasRef.current);
      } catch {
        return null;
      }
    }, []);

    const refreshLastSnapshot = useCallback(async () => {
      const snapshot = await captureSnapshot();
      if (snapshot) {
        lastSnapshotRef.current = snapshot;
      }
      return snapshot;
    }, [captureSnapshot]);

    const commitStrokeHistory = useCallback(() => {
      const snapshot = lastSnapshotRef.current;
      if (!snapshot) return;

      undoStackRef.current.push(snapshot);
      if (undoStackRef.current.length > MAX_UNDO_STEPS) {
        undoStackRef.current.shift();
      }
      redoStackRef.current = [];
      syncHistoryState();
    }, [syncHistoryState]);

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
        const query = Taro.createSelectorQuery();
        query.select(".doodle-canvas-wrap").boundingClientRect();
        query.select("#doodle-canvas").fields({ node: true, size: true });
        query.exec((res) => {
          const wrapRect = res?.[0] as { width?: number } | undefined;
          const nodeInfo = res?.[1] as
            | { node?: DoodleCanvas; width?: number }
            | undefined;
          if (!nodeInfo?.node) return;

          const canvas = nodeInfo.node;
          const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
          const dpr = Taro.getSystemInfoSync().pixelRatio || 2;
          const width = wrapRect?.width || nodeInfo.width || 0;
          const height = width;

          if (!width) return;

          canvas.width = width * dpr;
          canvas.height = height * dpr;
          ctx.scale(dpr, dpr);

          canvasRef.current = canvas;
          ctxRef.current = ctx;
          sizeRef.current = { width, height };
          fillBackground();
          restoreDraft(() => {
            void refreshLastSnapshot().then(() => setReady(true));
          });
        });
      });
    }, [fillBackground, refreshLastSnapshot, restoreDraft]);

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

        if (!strokeStartedRef.current) {
          strokeStartedRef.current = true;
          commitStrokeHistory();
        }

        drawingRef.current = true;
        lastPointRef.current = point;
      },
      [ready, commitStrokeHistory],
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
        strokeStartedRef.current = false;
        void refreshLastSnapshot().then(() => persistDraft());
      },
      [persistDraft, refreshLastSnapshot],
    );

    const handleUndo = useCallback(async () => {
      if (!undoStackRef.current.length) return;

      const current = await captureSnapshot();
      const previous = undoStackRef.current.pop();
      if (!previous) {
        syncHistoryState();
        return;
      }

      if (current) {
        redoStackRef.current.push(current);
      }
      restoreSnapshot(previous);
      lastSnapshotRef.current = previous;
      syncHistoryState();
      void refreshLastSnapshot().then(() => persistDraft());
    }, [captureSnapshot, persistDraft, refreshLastSnapshot, restoreSnapshot, syncHistoryState]);

    const handleRedo = useCallback(async () => {
      if (!redoStackRef.current.length) return;

      const current = await captureSnapshot();
      const next = redoStackRef.current.pop();
      if (!next) {
        syncHistoryState();
        return;
      }

      if (current) {
        undoStackRef.current.push(current);
      }
      restoreSnapshot(next);
      lastSnapshotRef.current = next;
      syncHistoryState();
      void refreshLastSnapshot().then(() => persistDraft());
    }, [captureSnapshot, persistDraft, refreshLastSnapshot, restoreSnapshot, syncHistoryState]);

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
          resetHistory();
          Taro.removeStorageSync(DOODLE_DRAFT_KEY);
          void refreshLastSnapshot();
        },
      }),
      [fillBackground, refreshLastSnapshot, resetHistory],
    );

    const strokePreviewColor =
      color === DOODLE_ERASER_COLOR ? "#2c2c2c" : color;

    return (
      <View className={`doodle-board ${className}`.trim()}>
        <View className="doodle-toolbar">
          <View className="toolbar-row">
            <View className="toolbar-group toolbar-group--start">
              <Text className="toolbar-label">颜色</Text>
              <View className="color-options">
                {DOODLE_COLORS.map((option) => (
                  <View
                    key={option.value}
                    className={`color-swatch ${option.className} ${color === option.value ? "active" : ""}`}
                    onClick={() => setColor(option.value)}
                  />
                ))}
              </View>
            </View>
            <View
              className={`history-btn ${canRedo ? "" : "disabled"}`}
              onClick={() => {
                if (canRedo) void handleRedo();
              }}
            >
              <Text className="history-label">恢复</Text>
              <Text className="history-icon">↪</Text>
            </View>
          </View>

          <View className="toolbar-row">
            <View className="toolbar-group toolbar-group--start">
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
                      style={{
                        height: `${option}px`,
                        backgroundColor: strokePreviewColor,
                      }}
                    />
                  </View>
                ))}
              </View>
            </View>
            <View
              className={`history-btn ${canUndo ? "" : "disabled"}`}
              onClick={() => {
                if (canUndo) void handleUndo();
              }}
            >
              <Text className="history-label">撤销</Text>
              <Text className="history-icon">↩</Text>
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

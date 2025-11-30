"use client";

import { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { renderCustomQR } from "@/lib/customRenderer";

let QRCodeStyling;
if (typeof window !== "undefined") {
  // eslint-disable-next-line global-require
  QRCodeStyling = require("qr-code-styling");
}

// Renders the QR either with qr-code-styling or custom canvas renderer.
// Exposes imperative methods via ref: getPngBlob(), downloadSvg(), resetView().
const QRViewer = forwardRef(function QRViewer(
  { options, displaySize, cornerSquareType, circularBorder },
  ref
) {
  const hostRef = useRef(null);
  const qrRef = useRef(null); // {kind: 'styling'|'custom', inst|canvas}

  // Pan/zoom state
  const viewerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [panning, setPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const applyViewerTransform = () => {
    const canvas = hostRef.current?.querySelector?.("canvas");
    if (!canvas) return;
    canvas.style.transformOrigin = "center center";
    canvas.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    canvas.style.willChange = "transform";
  };

  const zoomInBtn = () => setScale((s) => Math.min(8, s * 1.2));
  const zoomOutBtn = () => setScale((s) => Math.max(0.5, s / 1.2));
  const resetView = () => {
    setScale(1);
    setTx(0);
    setTy(0);
  };

  // Render on options change
  useEffect(() => {
    if (!hostRef.current) return;
    const wantCustom = cornerSquareType === "circle" || circularBorder;
    const ensureCanvasSize = () => {
      const canvas = hostRef.current?.querySelector?.("canvas");
      if (canvas) {
        canvas.style.width = `${displaySize}px`;
        canvas.style.height = `${displaySize}px`;
        applyViewerTransform();
      }
    };
    if (wantCustom) {
      if (!qrRef.current || qrRef.current.kind !== "custom") {
        hostRef.current.innerHTML = "";
        const canvas = document.createElement("canvas");
        hostRef.current.appendChild(canvas);
        qrRef.current = { kind: "custom", canvas };
      }
      const canvas = qrRef.current.canvas;
      renderCustomQR(canvas, options);
      ensureCanvasSize();
      return;
    }
    if (!QRCodeStyling) return;
    const libOptions = {
      ...options,
      cornersSquareOptions: {
        ...options.cornersSquareOptions,
        type:
          options.cornersSquareOptions?.type === "circle"
            ? "extra-rounded"
            : options.cornersSquareOptions?.type,
      },
    };
    if (!qrRef.current || qrRef.current.kind !== "styling") {
      hostRef.current.innerHTML = "";
      const inst = new QRCodeStyling(libOptions);
      inst.append(hostRef.current);
      qrRef.current = { kind: "styling", inst };
    } else {
      qrRef.current.inst.update(libOptions);
    }
    ensureCanvasSize();
  }, [options, displaySize, cornerSquareType, circularBorder]);

  // Wheel + pan listeners
  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const delta = -e.deltaY;
      const factor = Math.exp(delta * 0.001);
      const next = Math.min(8, Math.max(0.5, scale * factor));
      setScale(next);
    };
    const onPointerDown = (e) => {
      if (e.target && typeof e.target.closest === "function" && e.target.closest('[data-role="viewer-controls"]')) {
        return;
      }
      setPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY, tx, ty };
      el.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e) => {
      if (!panning) return;
      const dx = e.clientX - panStart.current.x;
      const dy = e.clientY - panStart.current.y;
      setTx(panStart.current.tx + dx);
      setTy(panStart.current.ty + dy);
    };
    const onPointerUp = (e) => {
      setPanning(false);
      el.releasePointerCapture?.(e.pointerId);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointerleave", onPointerUp);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointerleave", onPointerUp);
    };
  }, [scale, tx, ty, panning]);

  useEffect(() => {
    applyViewerTransform();
  }, [scale, tx, ty]);

  const getPngBlob = async () => {
    if (qrRef.current?.getRawData) {
      try {
        const blob = await qrRef.current.getRawData("png");
        if (blob) return blob;
      } catch (_) {}
    }
    const canvas = hostRef.current?.querySelector?.("canvas");
    if (!canvas) return null;
    const blob = await new Promise((res) => canvas.toBlob(res));
    return blob;
  };

  const downloadSvg = async () => {
    if (qrRef.current?.kind === "styling" && qrRef.current.inst?.download) {
      try {
        await qrRef.current.inst.download({ extension: "svg" });
        return true;
      } catch (_) {}
    }
    return false;
  };

  useImperativeHandle(ref, () => ({ getPngBlob, downloadSvg, resetView, zoomIn: zoomInBtn, zoomOut: zoomOutBtn }));

  return (
    <div
      ref={viewerRef}
      className="relative overflow-hidden flex items-center justify-center w-full h-full cursor-grab"
    >
      <div ref={hostRef} className="flex items-center justify-center" />
      <div className="absolute top-8 right-2 z-10 flex items-center gap-2" data-role="viewer-controls">
        <Button className="hover:bg-orange-400" size="icon" onClick={zoomOutBtn} title="Zoom out">
          <ZoomOut className="size-4" />
        </Button>
        <Button className="hover:bg-orange-400" size="icon" onClick={zoomInBtn} title="Zoom in">
          <ZoomIn className="size-4" />
        </Button>
        <Button className="hover:bg-orange-400" size="icon" onClick={resetView} title="Reset view">
          <RotateCcw className="size-4" />
        </Button>
      </div>
    </div>
  );
});

export default QRViewer;


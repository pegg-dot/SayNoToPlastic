"use client";

import { useEffect, useRef } from "react";

type MatterFieldProps = {
  className?: string;
  density?: number;
};

type Fragment = {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  rotation: number;
  spin: number;
  sides: number;
  color: string;
};

const palette = ["#c68a45", "#e3c79e", "#5d7e89", "#9d5f43", "#f1e8d8"];

function seeded(index: number, offset: number) {
  const value = Math.sin(index * 9283.17 + offset * 73.11) * 43758.5453;
  return value - Math.floor(value);
}

export function MatterField({ className = "", density = 58 }: MatterFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;
    let width = 0;
    let height = 0;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let running = true;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fragments: Fragment[] = Array.from({ length: density }, (_, index) => ({
      x: seeded(index, 1),
      y: seeded(index, 2),
      z: 0.25 + seeded(index, 3) * 0.75,
      size: 1.5 + seeded(index, 4) * 7,
      speed: 0.000035 + seeded(index, 5) * 0.00009,
      rotation: seeded(index, 6) * Math.PI * 2,
      spin: (seeded(index, 7) - 0.5) * 0.002,
      sides: 3 + Math.floor(seeded(index, 8) * 4),
      color: palette[index % palette.length],
    }));

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(0);
    }

    function draw(time: number) {
      context.clearRect(0, 0, width, height);
      const gradient = context.createRadialGradient(width * 0.66, height * 0.46, 0, width * 0.66, height * 0.46, Math.max(width, height) * 0.58);
      gradient.addColorStop(0, "rgba(42, 66, 75, .22)");
      gradient.addColorStop(0.48, "rgba(16, 29, 36, .08)");
      gradient.addColorStop(1, "rgba(2, 7, 11, 0)");
      context.fillStyle = gradient;
      context.fillRect(0, 0, width, height);

      fragments.forEach((fragment, index) => {
        const drift = reducedMotion ? 0 : time * fragment.speed;
        const x = ((fragment.x + drift) % 1) * width + pointerX * fragment.z * 18;
        const y = ((fragment.y - drift * 0.55 + 1) % 1) * height + pointerY * fragment.z * 12;
        const size = fragment.size * (0.55 + fragment.z);
        const rotation = fragment.rotation + (reducedMotion ? 0 : time * fragment.spin);
        context.save();
        context.translate(x, y);
        context.rotate(rotation);
        context.globalAlpha = 0.12 + fragment.z * 0.4;
        context.fillStyle = fragment.color;
        context.beginPath();
        for (let point = 0; point < fragment.sides; point += 1) {
          const angle = (point / fragment.sides) * Math.PI * 2;
          const radius = size * (0.65 + seeded(index, point + 20) * 0.5);
          const px = Math.cos(angle) * radius;
          const py = Math.sin(angle) * radius;
          if (point === 0) context.moveTo(px, py); else context.lineTo(px, py);
        }
        context.closePath();
        context.fill();
        context.restore();
      });

      if (!reducedMotion && running) frame = requestAnimationFrame(draw);
    }

    function onPointer(event: PointerEvent) {
      pointerX = event.clientX / Math.max(window.innerWidth, 1) - 0.5;
      pointerY = event.clientY / Math.max(window.innerHeight, 1) - 0.5;
    }

    function onVisibility() {
      running = !document.hidden;
      if (running && !reducedMotion) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(draw);
      }
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    if (!reducedMotion) frame = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={`matter-field ${className}`.trim()} aria-hidden="true" />;
}

'use client';
import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.style.cursor = 'none';

    let ringX = 0, ringY = 0;
    let mouseX = 0, mouseY = 0;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top  = `${mouseY}px`;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;
      animId = requestAnimationFrame(animate);
    };

    const onEnterLink = () => ring.classList.add('hovered');
    const onLeaveLink = () => ring.classList.remove('hovered');

    window.addEventListener('mousemove', onMove);
    animId = requestAnimationFrame(animate);

    const interactive = document.querySelectorAll('a, button, [data-cursor]');
    interactive.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink);
      el.addEventListener('mouseleave', onLeaveLink);
    });

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
      interactive.forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink);
        el.removeEventListener('mouseleave', onLeaveLink);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

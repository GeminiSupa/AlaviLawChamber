'use client';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 1200, suffix: '+', label: 'Cases Handled' },
  { value: 25,   suffix: '+', label: 'Years of Excellence' },
  { value: 98,   suffix: '%', label: 'Client Satisfaction' },
  { value: 3,    suffix: '',  label: 'Courts of Practice' },
];

function useCountUp(target: number, started: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return count;
}

function StatItem({ value, suffix, label, started }: { value: number; suffix: string; label: string; started: boolean }) {
  const count = useCountUp(value, started);
  return (
    <div className="stat-item">
      <div className="stat-number">{count}{suffix}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Stats() {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-bar" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((s, i) => (
            <StatItem key={i} {...s} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}

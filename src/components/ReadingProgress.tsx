import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.max(0, Math.min(100, scrollPercent)));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50 backdrop-blur-sm">
      <div 
        className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
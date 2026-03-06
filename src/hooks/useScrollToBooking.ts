import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Easing function: cubic-bezier(0.76, 0, 0.24, 1)
const easeInOutQuint = (t: number) => {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
};

export const useScrollToBooking = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const scrollToBooking = useCallback(() => {
        const triggerScroll = () => {
            const targetElement = document.getElementById('santuario-del-tiempo');
            if (!targetElement) return;

            const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            const duration = 1200; // 1.2s cinematic duration
            let startTime: number | null = null;

            const animation = (currentTime: number) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);

                const easeProgress = easeInOutQuint(progress);

                window.scrollTo(0, startPosition + distance * easeProgress);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            };

            requestAnimationFrame(animation);
        };

        if (location.pathname !== '/') {
            navigate('/');
            // Wait for React to render the new route and lazy component
            setTimeout(triggerScroll, 300);
        } else {
            triggerScroll();
        }
    }, [location, navigate]);

    return scrollToBooking;
};

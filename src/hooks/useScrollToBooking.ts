import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export const useScrollToBooking = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const scrollToBooking = useCallback(() => {
        const triggerScroll = () => {
            const targetElement = document.getElementById('santuario-del-tiempo');
            if (!targetElement) return;

            gsap.to(window, {
                scrollTo: { y: targetElement, offsetY: 0 },
                duration: 1.2,
                ease: 'power4.inOut',
            });
        };

        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(triggerScroll, 300);
        } else {
            triggerScroll();
        }
    }, [location, navigate]);

    return scrollToBooking;
};

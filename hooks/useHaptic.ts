import { useCallback } from 'react';

export const useHaptic = () => {
    const trigger = useCallback(() => {
        // Simple short vibration for UI feedback
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(10); // 10ms is very subtle/light
        }
    }, []);

    const triggerSuccess = useCallback(() => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([10, 30, 10]); // double pulse
        }
    }, []);

    const triggerError = useCallback(() => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([50, 30, 50, 30, 50]); // longer pattern
        }
    }, []);

    return { trigger, triggerSuccess, triggerError };
};

import { useCallback } from 'react';

export const useTextToSpeech = () => {
    const speak = useCallback((text) => {
        if (!window.speechSynthesis) {
            console.error("Browser does not support text-to-speech.");
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    }, []);

    return { speak };
};
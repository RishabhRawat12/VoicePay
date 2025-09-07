import { useState, useEffect, useCallback } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

export const useVoiceRecognition = () => {
    const [text, setText] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [error, setError] = useState('');

    const handleResult = (event) => {
        const spokenText = event.results[0][0].transcript;
        setText(spokenText);
    };

    const handleError = (event) => {
        setError(event.error);
    };

    const startListening = useCallback(() => {
        setText('');
        setError('');
        setIsListening(true);
        recognition.start();
    }, []);

    const stopListening = useCallback(() => {
        setIsListening(false);
        recognition.stop();
    }, []);

    useEffect(() => {
        recognition.addEventListener('result', handleResult);
        recognition.addEventListener('error', handleError);
        recognition.addEventListener('end', () => setIsListening(false));

        return () => {
            recognition.removeEventListener('result', handleResult);
            recognition.removeEventListener('error', handleError);
            recognition.removeEventListener('end', () => setIsListening(false));
        };
    }, []);

    return {
        text,
        setText, 
        isListening,
        error,
        startListening,
        stopListening,
    };
};
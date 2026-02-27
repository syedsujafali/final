import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
    className?: string;
    delay?: number;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 50, onComplete, className = '', delay = 0 }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            setHasStarted(true);
        }, delay);
        return () => clearTimeout(startTimeout);
    }, [delay]);

    useEffect(() => {
        if (!hasStarted) return;

        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        } else {
            if (onComplete) onComplete();
        }
    }, [currentIndex, text, speed, onComplete, hasStarted]);

    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={className}
            style={{ whiteSpace: 'pre-wrap' }}
        >
            {displayedText}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
            >
                |
            </motion.span>
        </motion.span>
    );
};

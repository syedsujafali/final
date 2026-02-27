import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface JumpingButtonProps {
    text: string;
}

export const JumpingButton: React.FC<JumpingButtonProps> = ({ text }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isJumping, setIsJumping] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const jump = () => {
        setIsJumping(true);
        // Random position within a reasonable range from original position
        // Since it's inside a flex/modal, absolute random might break layout,
        // so we translate by random X and Y
        const randomX = (Math.random() - 0.5) * 200; // -100px to 100px
        const randomY = (Math.random() - 0.5) * 150; // -75px to 75px

        setPosition({ x: randomX, y: randomY });
    };

    useEffect(() => {
        if (isJumping) {
            const timer = setTimeout(() => setIsJumping(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isJumping]);

    return (
        <motion.button
            ref={buttonRef}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            onMouseEnter={jump}
            onClick={jump}
            className={`px-6 py-3 rounded-full font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 shadow-lg backdrop-blur-md transition-colors ${isJumping ? 'animate-[shake_0.2s_ease-in-out]' : ''
                }`}
        >
            {text}
        </motion.button>
    );
};

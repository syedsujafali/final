import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const HeartBackground: React.FC = () => {
    const [hearts, setHearts] = useState<{ id: number; x: number; size: number; duration: number; delay: number; colorClass: string; filterColor: string }[]>([]);
    const [dust, setDust] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number; colorClass: string; shadowColor: string }[]>([]);

    useEffect(() => {
        const heartColors = [
            { text: 'text-rose-400/80', filter: 'rgba(251,113,133,0.8)' },
            { text: 'text-pink-400/80', filter: 'rgba(244,114,182,0.8)' },
            { text: 'text-red-500/70', filter: 'rgba(239,68,68,0.8)' },
            { text: 'text-white/60', filter: 'rgba(255,255,255,0.6)' }
        ];

        const dustColors = [
            { bg: 'bg-yellow-200', shadow: 'rgba(254,240,138,0.6)' },
            { bg: 'bg-rose-300', shadow: 'rgba(253,164,175,0.6)' },
            { bg: 'bg-pink-300', shadow: 'rgba(249,168,212,0.6)' },
            { bg: 'bg-white', shadow: 'rgba(255,255,255,0.8)' }
        ];

        // Generate hearts
        setHearts(Array.from({ length: 35 }).map((_, i) => {
            const colorOption = heartColors[Math.floor(Math.random() * heartColors.length)];
            return {
                id: i,
                x: Math.random() * 100,
                size: Math.random() * 25 + 15, // 15px to 40px
                duration: Math.random() * 12 + 10, // 10-22s duration
                delay: Math.random() * 10,
                colorClass: colorOption.text,
                filterColor: colorOption.filter
            };
        }));

        // Generate magic dust/fireflies
        setDust(Array.from({ length: 60 }).map((_, i) => {
            const dustOption = dustColors[Math.floor(Math.random() * dustColors.length)];
            return {
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 4 + 1.5, // 1.5px to 5.5px
                duration: Math.random() * 6 + 4,
                delay: Math.random() * 5,
                colorClass: dustOption.bg,
                shadowColor: dustOption.shadow
            };
        }));
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Dark gradient overlay for extra depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] mix-blend-multiply" />

            {/* Heart particles */}
            {hearts.map((el) => (
                <motion.div
                    key={`heart-${el.id}`}
                    initial={{ y: '100vh', x: `${el.x}vw`, opacity: 0 }}
                    animate={{
                        y: '-10vh',
                        opacity: [0, 0.4, 0.6, 0.4, 0],
                        rotate: [0, 20, -20, 0], // Swaying motion
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        delay: el.delay,
                        ease: "linear"
                    }}
                    className={`absolute bottom-0 ${el.colorClass}`}
                    style={{ width: `${el.size}px`, height: `${el.size}px`, filter: `drop-shadow(0 0 10px ${el.filterColor})` }}
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-full h-full">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </motion.div>
            ))}

            {/* Firefly / magic dust particles */}
            {dust.map((el) => (
                <motion.div
                    key={`dust-${el.id}`}
                    className={`absolute rounded-full ${el.colorClass}`}
                    style={{
                        left: `${el.x}vw`,
                        top: `${el.y}vh`,
                        width: el.size,
                        height: el.size,
                        boxShadow: `0 0 10px 3px ${el.shadowColor}`
                    }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [1, 1.5, 1],
                        x: [0, Math.random() * 40 - 20, Math.random() * -40 + 20, 0],
                        y: [0, Math.random() * -40, Math.random() * 20, 0]
                    }}
                    transition={{
                        duration: el.duration,
                        repeat: Infinity,
                        delay: el.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

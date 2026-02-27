import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../Modal';
import { Heart, Sparkles, Fingerprint } from 'lucide-react';

interface Props {
    onComplete: () => void;
}

export const Scene1Compatibility: React.FC<Props> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<'scan' | 'loading' | 'perfect' | 'warning'>('scan');
    const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
    const btnRef = useRef<HTMLButtonElement>(null);
    const animationRef = useRef<number | null>(null);

    /* ------------------ Floating Love Background ------------------ */

    const floatingHearts = useMemo(
        () =>
            Array.from({ length: 25 }).map(() => ({
                left: Math.random() * 100,
                size: 20 + Math.random() * 30,
                duration: 12 + Math.random() * 10,
                delay: Math.random() * 5,
            })),
        []
    );

    /* ------------------ Smooth Scan ------------------ */

    const handleScanStart = () => {
        setPhase('loading');
        const start = performance.now();

        const animate = (time: number) => {
            const value = Math.min(((time - start) / 1800) * 100, 100);
            setProgress(value);

            if (value < 100) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setTimeout(() => setPhase('perfect'), 500);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    };

    const handleScanEnd = () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (progress < 100) {
            setPhase('scan');
            setProgress(0);
        }
    };

    /* ------------------ Auto Perfect → Warning ------------------ */

    useEffect(() => {
        if (phase === 'perfect') {
            const timer = setTimeout(() => setPhase('warning'), 3500);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    /* ------------------ Move No Button ------------------ */

    const moveButton = () => {
        const btnWidth = btnRef.current?.offsetWidth || 200;
        const btnHeight = btnRef.current?.offsetHeight || 60;

        // Ensure it stays within the visible viewport with some margin
        const maxX = (window.innerWidth / 2) - (btnWidth / 2) - 20;
        const maxY = (window.innerHeight / 3) - (btnHeight / 2) - 20;

        setNoBtnPosition({
            x: (Math.random() * maxX * 2) - maxX,
            y: (Math.random() * maxY * 2) - maxY,
        });
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen p-4 text-center overflow-hidden">

            {/* Romantic Love Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-rose-950 via-pink-900 to-red-950">
                {floatingHearts.map((heart, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: "110vh" }}
                        animate={{ y: "-10vh" }}
                        transition={{
                            duration: heart.duration,
                            repeat: Infinity,
                            ease: "linear",
                            delay: heart.delay,
                        }}
                        style={{
                            left: `${heart.left}%`,
                            position: "absolute",
                            willChange: "transform",
                        }}
                        className="text-rose-400 opacity-20"
                    >
                        <Heart size={heart.size} fill="currentColor" />
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {(phase === 'scan' || phase === 'loading') && (
                    <motion.div
                        key="scanner"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-md flex flex-col items-center"
                    >
                        <h2 className="text-2xl md:text-3xl font-light mb-8 md:mb-12 text-rosegold-300 tracking-wide flex items-center justify-center gap-2 text-glow flex-wrap px-4">
                            <Sparkles className="text-yellow-200 animate-pulse w-5 h-5 md:w-6 md:h-6" />
                            Scan your finger to know your perfection
                            <Sparkles className="text-yellow-200 animate-pulse w-5 h-5 md:w-6 md:h-6" />
                        </h2>

                        <motion.div
                            className="relative w-36 h-36 md:w-44 md:h-44 mb-8 rounded-full flex items-center justify-center border-[3px] border-rose-500/40 bg-black/60 cursor-pointer overflow-hidden backdrop-blur-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseDown={handleScanStart}
                            onMouseUp={handleScanEnd}
                            onMouseLeave={handleScanEnd}
                            onTouchStart={handleScanStart}
                            onTouchEnd={handleScanEnd}
                        >
                            {phase === 'loading' && (
                                <motion.div
                                    className="absolute inset-0 rounded-full border-2 border-rose-400"
                                    animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                                    transition={{ duration: 1.2, repeat: Infinity }}
                                />
                            )}

                            <Fingerprint
                                size={80}
                                className={`transition-all duration-300 ${phase === 'loading'
                                    ? 'text-rose-500 scale-110'
                                    : 'text-rosegold-400 opacity-60'
                                    }`}
                            />
                        </motion.div>

                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <motion.div
                                className="h-full bg-gradient-to-r from-crimson-900 via-rose-500 to-rose-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <p className="mt-4 text-rose-300 font-mono font-bold text-xl">
                            {Math.round(progress)}%
                        </p>

                        {phase === 'scan' && (
                            <p className="mt-6 text-rosegold-400/50 text-sm italic animate-pulse">
                                Press and hold...
                            </p>
                        )}
                    </motion.div>
                )}

                {phase === 'perfect' && (
                    <motion.div
                        key="perfect"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass-card p-12 rounded-[3rem] w-full max-w-lg border border-rose-400/40 flex flex-col items-center"
                    >
                        <motion.div
                            animate={{ scale: 1 }}
                        >
                            <Heart
                                className="text-white fill-rose-500 mb-8"
                                size={120}
                            />
                        </motion.div>

                        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-rose-200 to-pink-400 leading-tight">
                            You are made for me ❤️
                        </h1>

                        <p className="text-xl mt-2 text-rosegold-300 font-light italic">
                            Our souls match perfectly.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <Modal isOpen={phase === 'warning'} className="!max-w-4xl min-h-[500px] flex flex-col justify-center">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-crimson-900 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart size={48} className="text-white fill-white" />
                    </div>

                    <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-white mb-4 font-serif">
                        A Permanent Bond 💍
                    </h2>

                    <p className="text-rosegold-300 mb-8 md:mb-10 text-lg md:text-xl font-medium leading-relaxed px-4">
                        Warning: Proceeding to the next phase will result in infinite love, unstoppable cuddles, and a lifelong commitment.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12 w-full min-h-[160px] relative">
                        <button
                            onClick={onComplete}
                            className="w-full sm:w-64 h-16 bg-gradient-to-r from-white to-rose-100 text-crimson-950 font-bold rounded-full transition transform hover:scale-105 text-lg"
                        >
                            Yes, I'm ready 🥰
                        </button>

                        <motion.button
                            ref={btnRef}
                            onClick={moveButton}
                            onMouseEnter={moveButton}
                            animate={noBtnPosition}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="w-full sm:w-64 h-16 bg-black/60 border border-crimson-900/50 text-crimson-400 font-bold rounded-full text-lg cursor-not-allowed"
                        >
                            No, I'm not ready 🏃‍♀️
                        </motion.button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
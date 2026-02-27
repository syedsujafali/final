import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    children: React.ReactNode;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, children, className = '' }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 30, opacity: 0, filter: "blur(10px)" }}
                        animate={{ scale: 1, y: 0, opacity: 1, filter: "blur(0px)" }}
                        exit={{ scale: 0.9, y: 30, opacity: 0, filter: "blur(10px)" }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`glass-card rounded-[2rem] p-6 md:p-10 max-w-lg w-full relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-rose-500/30 ${className}`}
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

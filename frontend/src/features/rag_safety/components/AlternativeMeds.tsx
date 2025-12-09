import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Check, ArrowRight } from 'lucide-react';

interface Alternative {
    name: string;
    reason: string;
    confidence: number;
}

interface AlternativeMedsProps {
    alternatives: Alternative[];
}

const AlternativeMeds: React.FC<AlternativeMedsProps> = ({ alternatives }) => {
    if (alternatives.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8"
        >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Pill className="text-purple-400" />
                Recommended Alternatives
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {alternatives.map((alt, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + idx * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl bg-white/5 border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                                {alt.name}
                            </h4>
                            <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-mono">
                                {alt.confidence}% Conf.
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                            {alt.reason}
                        </p>

                        <button className="w-full py-2 bg-white/10 hover:bg-purple-500/20 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                            Select Option <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default AlternativeMeds;

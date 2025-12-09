import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface Warning {
    severity: string;
    message: string;
}

interface SafetyScoreCardProps {
    score: number;
    warnings: Warning[];
    explanation: string;
}

const SafetyScoreCard: React.FC<SafetyScoreCardProps> = ({ score, warnings, explanation }) => {
    const getScoreColor = (s: number) => {
        if (s >= 70) return 'text-green-400 border-green-400/50 bg-green-500/10';
        if (s >= 40) return 'text-yellow-400 border-yellow-400/50 bg-yellow-500/10';
        return 'text-red-400 border-red-400/50 bg-red-500/10';
    };

    const getScoreLabel = (s: number) => {
        if (s >= 70) return 'Safe to Dispense';
        if (s >= 40) return 'Caution Required';
        return 'High Risk - Contraindicated';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
            <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Score Circle */}
                <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                            className="text-gray-700 stroke-current"
                            strokeWidth="8"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                        ></circle>
                        <g transform="rotate(-90 50 50)">
                            <motion.circle
                                className={`${score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500'} progress-ring__circle stroke-current`}
                                strokeWidth="8"
                                strokeLinecap="round"
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                strokeDasharray="251.2"
                                initial={{ strokeDashoffset: 251.2 }}
                                animate={{ strokeDashoffset: 251.2 - (251.2 * score) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            ></motion.circle>
                        </g>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-white">{score}</span>
                        <span className="text-xs text-gray-400 uppercase tracking-widest">Safety Score</span>
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-4">
                    <div>
                        <h3 className={`text-2xl font-bold ${score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {getScoreLabel(score)}
                        </h3>
                    </div>

                    <p className="text-gray-300 leading-relaxed text-sm">
                        {explanation}
                    </p>

                    {warnings.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <h4 className="text-sm font-semibold text-gray-400 uppercase">Risk Analysis</h4>
                            <ul className="space-y-2">
                                {warnings.map((w, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + idx * 0.1 }}
                                        className={`flex items-start gap-3 p-3 rounded-lg border text-sm ${w.severity === 'high' ? 'bg-red-500/10 border-red-500/30 text-red-200' :
                                            w.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-200' :
                                                'bg-blue-500/10 border-blue-500/30 text-blue-200'
                                            }`}
                                    >
                                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <span>{w.message}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SafetyScoreCard;

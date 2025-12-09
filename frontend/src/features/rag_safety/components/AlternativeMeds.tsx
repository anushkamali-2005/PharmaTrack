import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Check, ArrowRight, Package, DollarSign } from 'lucide-react';

interface Alternative {
    name: string;
    reason: string;
    confidence: number;
    inventory_status?: string;
    price?: number;
}

interface AlternativeMedsProps {
    alternatives: Alternative[];
    onSelect?: (alternative: Alternative) => void;
}

const AlternativeMeds: React.FC<AlternativeMedsProps> = ({ alternatives, onSelect }) => {
    if (alternatives.length === 0) return null;

    const getInventoryBadge = (status?: string) => {
        if (!status) return null;
        const statusMap: Record<string, { text: string; color: string }> = {
            'in_stock': { text: 'In Stock', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
            'low_stock': { text: 'Low Stock', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
            'out_of_stock': { text: 'Out of Stock', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
        };
        const badge = statusMap[status] || statusMap['in_stock'];
        return (
            <span className={`px-2 py-1 rounded-full text-xs border ${badge.color} flex items-center gap-1`}>
                <Package className="w-3 h-3" />
                {badge.text}
            </span>
        );
    };

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
                        className="p-4 rounded-xl bg-white/5 border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                                {alt.name}
                            </h4>
                            <div className="px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-mono">
                                {alt.confidence}% Conf.
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                            {alt.reason}
                        </p>

                        {/* Inventory Status & Price */}
                        <div className="flex items-center justify-between mb-3 gap-2">
                            {getInventoryBadge(alt.inventory_status)}
                            {alt.price && (
                                <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                                    <DollarSign className="w-4 h-4" />
                                    {alt.price.toFixed(2)}
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => onSelect && onSelect(alt)}
                            className="w-full py-2 bg-white/10 hover:bg-purple-500/20 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                        >
                            Select Option <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default AlternativeMeds;

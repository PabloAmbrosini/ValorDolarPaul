import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    iconColor?: string;
    // We are keeping Lucide for now as the Monthly screen mock specifically used Lucide-like icons 
    // for Open/Close door metaphors which might not have direct simple Material equivalents without looking them up.
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, iconColor = "text-slate-400" }) => {
    return (
        <div className="flex flex-col gap-1 rounded-xl p-4 bg-white dark:bg-surface-dark shadow-sm border border-slate-200 dark:border-transparent">
            <div className="flex items-center gap-2 mb-1">
                <Icon size={18} className={iconColor} />
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">
                    {title}
                </p>
            </div>
            <p className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">
                ${value.toFixed(2)}
            </p>
        </div>
    );
};

export default StatsCard;
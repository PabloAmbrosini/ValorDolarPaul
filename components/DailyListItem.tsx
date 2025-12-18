import React from 'react';
import { DailyRate } from '../types';

interface DailyListItemProps {
    item: DailyRate;
}

const DailyListItem: React.FC<DailyListItemProps> = ({ item }) => {
    const isPositive = item.changePercentage > 0;
    const isNeutral = item.changePercentage === 0;
    
    // Determine color based on change
    let percentColor = "text-slate-500";
    let percentSign = "";
    
    if (isPositive) {
        percentColor = "text-green-500";
        percentSign = "+";
    } else if (!isNeutral) {
        percentColor = "text-red-500";
    }

    const formattedPercent = isNeutral 
        ? "0.0%" 
        : `${percentSign}${item.changePercentage.toFixed(1)}%`;

    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors cursor-pointer border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="flex items-center gap-3">
                <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg size-10 flex items-center justify-center font-bold text-sm">
                    {item.day}
                </div>
                <div className="flex flex-col">
                    <p className="text-slate-900 dark:text-white text-sm font-bold">{item.dayName}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">{item.month}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-slate-900 dark:text-white text-sm font-bold">${item.value.toFixed(2)}</p>
                <p className={`${percentColor} text-xs font-medium`}>{formattedPercent}</p>
            </div>
        </div>
    );
};

export default DailyListItem;
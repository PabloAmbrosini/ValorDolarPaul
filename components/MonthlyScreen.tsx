import React, { useState, useEffect, useMemo } from 'react';
import { 
    DoorOpen, 
    DoorClosed, 
    ArrowUp, 
    ArrowDown 
} from 'lucide-react';

import PriceChart from './PriceChart.tsx';
import StatsCard from './StatsCard.tsx';
import DailyListItem from './DailyListItem.tsx';
import { getMonthlyData } from '../services/dollarService.ts';
import { ChartDataPoint, DailyRate, MonthlyStats } from '../types.ts';

interface MonthlyScreenProps {
    onNavigate: (screen: string) => void;
}

const MonthlyScreen: React.FC<MonthlyScreenProps> = ({ onNavigate }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [data, setData] = useState<{stats: MonthlyStats, chart: ChartDataPoint[], history: DailyRate[]} | null>(null);

    useEffect(() => {
        const result = getMonthlyData(viewDate.getMonth(), viewDate.getFullYear());
        setData(result);
    }, [viewDate]);

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() - 1);
        setViewDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(viewDate.getMonth() + 1);
        setViewDate(newDate);
    };

    const formattedMonth = useMemo(() => {
        const m = viewDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        return m.charAt(0).toUpperCase() + m.slice(1);
    }, [viewDate]);

    if (!data) return null;

    const { stats, chart, history } = data;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col w-full pb-8">
            <header className="flex items-center justify-between p-4 pb-2 bg-background-light dark:bg-background-dark sticky top-0 z-10">
                <button 
                    onClick={() => onNavigate('HOME')}
                    className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Go back"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                    Historial Mensual
                </h2>
                <div className="size-12" aria-hidden="true" />
            </header>

            <main className="flex-1 flex flex-col w-full">
                <div className="flex items-center justify-center gap-4 py-2">
                    <button onClick={handlePrevMonth} className="text-slate-500 dark:text-slate-400 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="text-slate-900 dark:text-white text-base font-bold select-none w-32 text-center">
                        {formattedMonth}
                    </span>
                    <button onClick={handleNextMonth} className="text-slate-500 dark:text-slate-400 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Valor Dólar Oficial</p>
                    <h1 className="text-slate-900 dark:text-white text-[40px] font-bold leading-tight">${stats.current.toFixed(2)}</h1>
                    <div className="flex items-center gap-1 mt-1 bg-green-500/10 px-2 py-0.5 rounded-full">
                        <span className="material-symbols-outlined text-green-500" style={{ fontSize: '16px' }}>trending_up</span>
                        <p className="text-green-500 text-sm font-bold">{stats.currentChange >= 0 ? '+' : ''}{stats.currentChange.toFixed(1)}%</p>
                    </div>
                </div>

                <div className="w-full py-2">
                    <PriceChart data={chart} />
                </div>

                <div className="grid grid-cols-2 gap-3 px-4 mb-6">
                    <StatsCard title="Apertura" value={stats.open} icon={DoorOpen} />
                    <StatsCard title="Cierre" value={stats.close} icon={DoorClosed} />
                    <StatsCard title="Máximo" value={stats.max} icon={ArrowUp} iconColor="text-green-500" />
                    <StatsCard title="Mínimo" value={stats.min} icon={ArrowDown} iconColor="text-red-500" />
                </div>

                <div className="flex flex-col px-4 pb-8 flex-1">
                    <h3 className="text-slate-900 dark:text-white text-base font-bold mb-3 px-1">Actividad Diaria</h3>
                    <div className="flex flex-col gap-3">
                        {history.map((item) => (
                            <DailyListItem key={item.day} item={item} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MonthlyScreen;
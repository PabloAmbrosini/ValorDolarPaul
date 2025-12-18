import React, { useState, useEffect, useMemo } from 'react';
import {
    DoorOpen,
    DoorClosed,
    ArrowUp,
    ArrowDown
} from 'lucide-react';


import StatsCard from './StatsCard.tsx';
import DailyListItem from './DailyListItem.tsx';
import { getMonthlyData } from '../services/dollarService.ts';
import { ChartDataPoint, DailyRate, MonthlyStats } from '../types.ts';

interface MonthlyScreenProps {
    onNavigate: (screen: string) => void;
}

const MonthlyScreen: React.FC<MonthlyScreenProps> = ({ onNavigate }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [data, setData] = useState<{ stats: MonthlyStats, chart: ChartDataPoint[], history: DailyRate[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const result = await getMonthlyData(viewDate.getMonth(), viewDate.getFullYear());
            setData(result);
            setLoading(false);
        };
        load();
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

    if (loading) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
            </div>
        );
    }

    if (!data || data.history.length === 0) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark text-center flex flex-col items-center justify-center p-8 animate-in fade-in">
                <button onClick={() => onNavigate('HOME')} className="mb-6 flex items-center gap-2 text-primary font-bold bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Volver al Inicio
                </button>
                <p className="text-slate-900 dark:text-white text-lg font-medium">No hay datos disponibles para este período.</p>
                <p className="text-slate-500 mt-2">Intenta navegar a otro mes.</p>
                <div className="flex gap-4 mt-6">
                    <button onClick={handlePrevMonth} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">Anterior</button>
                    <button onClick={handleNextMonth} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">Siguiente</button>
                </div>
            </div>
        );
    }

    const { stats, chart, history } = data;

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white flex flex-col w-full pb-8 animate-in slide-in-from-right-4 duration-300">
            {/* Header with glassmorphism */}
            <header className="flex items-center justify-between p-4 pb-2 sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-transparent dark:border-white/5">
                <button
                    onClick={() => onNavigate('HOME')}
                    className="flex cursor-pointer items-center justify-center rounded-full h-10 w-10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors active:scale-95"
                >
                    <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>arrow_back</span>
                </button>
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                    Historial Mensual
                </h2>
                <div className="w-10" aria-hidden="true" /> {/* Spacer */}
            </header>

            <main className="flex-1 flex flex-col w-full pt-2">
                {/* Month Selector */}
                <div className="flex items-center justify-center gap-6 py-4">
                    <button onClick={handlePrevMonth} className="text-slate-500 dark:text-slate-400 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors active:scale-90">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="text-slate-900 dark:text-white text-lg font-bold select-none min-w-[140px] text-center capitalize">
                        {formattedMonth}
                    </span>
                    <button onClick={handleNextMonth} className="text-slate-500 dark:text-slate-400 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors active:scale-90">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>

                {/* Main Stat */}
                <div className="flex flex-col items-center justify-center pb-6">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Promedio Mensual</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-slate-400 dark:text-slate-500 text-2xl font-medium">$</span>
                        <h1 className="text-slate-900 dark:text-white text-[48px] font-black leading-none tracking-tighter">{Math.floor(stats.current)}</h1>
                        <span className="text-slate-500 dark:text-slate-400 text-2xl font-bold">,{stats.current.toFixed(2).split('.')[1]}</span>
                    </div>

                    <div className={`flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full ${stats.currentChange >= 0 ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'} border`}>
                        <span className="material-symbols-outlined text-[18px]">
                            {stats.currentChange >= 0 ? 'trending_up' : 'trending_down'}
                        </span>
                        <p className="text-sm font-bold">{stats.currentChange >= 0 ? '+' : ''}{stats.currentChange.toFixed(1)}%</p>
                    </div>
                </div>



                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 px-4 mb-8">
                    <StatsCard title="Apertura" value={stats.open} icon={DoorOpen} />
                    <StatsCard title="Cierre" value={stats.close} icon={DoorClosed} />
                    <StatsCard title="Máximo" value={stats.max} icon={ArrowUp} iconColor="text-green-500" />
                    <StatsCard title="Mínimo" value={stats.min} icon={ArrowDown} iconColor="text-red-500" />
                </div>

                {/* History List */}
                <div className="flex flex-col px-4 pb-8 flex-1 bg-white dark:bg-[#1C252E] rounded-t-3xl pt-6 shadow-[0_-4px_20px_rgb(0,0,0,0.02)] dark:shadow-none border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-slate-900 dark:text-white text-base font-bold">Actividad Diaria</h3>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">{history.length} registros</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {history.map((item) => (
                            <DailyListItem key={item.day} item={item} />
                        ))}
                    </div>
                </div>

                <div className="pb-6 text-center bg-white dark:bg-[#1C252E]">
                    <p className="text-slate-500 dark:text-slate-700 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">Diseñado por Paul</p>
                </div>
            </main>
        </div>
    );
};

export default MonthlyScreen;
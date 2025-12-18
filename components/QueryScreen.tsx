import React, { useState, useRef, useEffect } from 'react';
import { getRateForDate } from '../services/dollarService';
import { DailyRate } from '../types';

interface QueryScreenProps {
    onNavigate: (screen: string) => void;
}

const QueryScreen: React.FC<QueryScreenProps> = ({ onNavigate }) => {
    // Generate ranges
    const today = new Date();
    const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - 2 + i); // Current year +/- 2
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    // State
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth()); // 0-indexed
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());
    
    const [result, setResult] = useState<DailyRate | null>(null);

    // Scroll refs
    const dayRef = useRef<HTMLDivElement>(null);
    const monthRef = useRef<HTMLDivElement>(null);
    const yearRef = useRef<HTMLDivElement>(null);

    // Initial scroll position
    useEffect(() => {
        // Simple centering logic: each item is roughly 52px tall (padding + text)
        const itemHeight = 52; 
        if (dayRef.current) dayRef.current.scrollTop = (selectedDay - 1) * itemHeight;
        if (monthRef.current) monthRef.current.scrollTop = selectedMonth * itemHeight;
        if (yearRef.current) {
            const yearIndex = years.indexOf(selectedYear);
            if (yearIndex >= 0) yearRef.current.scrollTop = yearIndex * itemHeight;
        }
    }, []);

    // Helper to calculate selected index from scroll
    const handleScroll = (e: React.UIEvent<HTMLDivElement>, setter: (val: number) => void, values: any[]) => {
        const itemHeight = 52;
        const index = Math.round(e.currentTarget.scrollTop / itemHeight);
        if (index >= 0 && index < values.length) {
            setter(values[index]);
        }
    };
    
    // Specifically for month index
    const handleMonthScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const itemHeight = 52;
        const index = Math.round(e.currentTarget.scrollTop / itemHeight);
        if (index >= 0 && index < months.length) {
            setSelectedMonth(index);
        }
    };

    const handleQuery = () => {
        const rate = getRateForDate(selectedDay, selectedMonth, selectedYear);
        setResult(rate);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-8">
            {/* Top App Bar */}
            <div className="flex items-center px-4 py-4 justify-between sticky top-0 z-50 bg-background-light dark:bg-background-dark/95 backdrop-blur-sm">
                <button 
                    onClick={() => onNavigate('HOME')}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-[#111418] dark:text-white" style={{ fontSize: '24px' }}>arrow_back</span>
                </button>
                <h1 className="text-[#111418] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                    Historial Dólar
                </h1>
                <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                    <span className="material-symbols-outlined text-[#111418] dark:text-white" style={{ fontSize: '24px' }}>help</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col w-full pb-8">
                {/* Headline & Context */}
                <div className="px-6 pt-2 pb-6 text-center">
                    <h2 className="text-[#111418] dark:text-white text-[28px] font-bold leading-tight tracking-tight mb-2">
                        Consulta Histórica
                    </h2>
                    <p className="text-[#637588] dark:text-[#9dabb9] text-base font-normal leading-normal">
                        Selecciona una fecha pasada para consultar la cotización oficial del dólar en ese momento.
                    </p>
                </div>

                {/* Date Picker Card */}
                <div className="px-4 mb-8">
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                        {/* Visual indicator for selection area */}
                        <div className="absolute top-1/2 left-0 right-0 h-12 -translate-y-1/2 bg-primary/5 dark:bg-primary/10 border-y border-primary/20 pointer-events-none z-0"></div>
                        
                        <div className="flex justify-between items-center relative z-10">
                            {/* Day Column */}
                            <div 
                                ref={dayRef}
                                onScroll={(e) => handleScroll(e, setSelectedDay, days)}
                                className="group flex-1 flex flex-col items-center h-48 overflow-y-auto snap-y snap-mandatory no-scrollbar mask-gradient"
                            >
                                <div className="h-16 shrink-0 w-full"></div>
                                {days.map(day => (
                                    <p key={day} className={`snap-center py-3 text-lg font-medium transition-all ${day === selectedDay ? 'text-primary dark:text-white text-xl font-bold scale-110' : 'text-[#637588] dark:text-[#556677] opacity-40'}`}>
                                        {day}
                                    </p>
                                ))}
                                <div className="h-16 shrink-0 w-full"></div>
                            </div>
                            
                            {/* Month Column */}
                            <div 
                                ref={monthRef}
                                onScroll={handleMonthScroll}
                                className="group flex-[1.5] flex flex-col items-center h-48 overflow-y-auto snap-y snap-mandatory no-scrollbar mask-gradient"
                            >
                                <div className="h-16 shrink-0 w-full"></div>
                                {months.map((month, idx) => (
                                    <p key={month} className={`snap-center py-3 text-lg font-medium transition-all ${idx === selectedMonth ? 'text-primary dark:text-white text-xl font-bold scale-110' : 'text-[#637588] dark:text-[#556677] opacity-40'}`}>
                                        {month}
                                    </p>
                                ))}
                                <div className="h-16 shrink-0 w-full"></div>
                            </div>

                            {/* Year Column */}
                            <div 
                                ref={yearRef}
                                onScroll={(e) => handleScroll(e, setSelectedYear, years)}
                                className="group flex-1 flex flex-col items-center h-48 overflow-y-auto snap-y snap-mandatory no-scrollbar mask-gradient"
                            >
                                <div className="h-16 shrink-0 w-full"></div>
                                {years.map(year => (
                                    <p key={year} className={`snap-center py-3 text-lg font-medium transition-all ${year === selectedYear ? 'text-primary dark:text-white text-xl font-bold scale-110' : 'text-[#637588] dark:text-[#556677] opacity-40'}`}>
                                        {year}
                                    </p>
                                ))}
                                <div className="h-16 shrink-0 w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="px-4 mb-8">
                    <button 
                        onClick={handleQuery}
                        className="relative w-full overflow-hidden rounded-xl h-14 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-primary/25 cursor-pointer"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">search</span>
                            Consultar Valor
                        </span>
                    </button>
                </div>

                {/* Result Preview Section */}
                {result && (
                    <div className="px-4 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-[#111418] dark:text-white text-lg font-bold">Resultado</h3>
                            <span className="text-xs font-medium px-2 py-1 rounded bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">Datos Oficiales</span>
                        </div>
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="flex flex-col gap-1 mb-6">
                                <p className="text-[#637588] dark:text-[#9dabb9] text-sm font-medium">Cotización Venta — {result.day} {result.month} {selectedYear}</p>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-[#111418] dark:text-white tracking-tight">
                                        $ {result.value.toFixed(2).replace('.', ',')}
                                    </span>
                                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-bold bg-green-500/10 px-2 py-0.5 rounded-full">
                                        <span className="material-symbols-outlined text-[16px] mr-0.5">trending_up</span>
                                        {Math.abs(result.changePercentage).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                            
                            {/* Mini Chart Visualization - Simplified static svg for the query result visual */}
                            <div className="relative h-24 w-full">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                    <div className="border-t border-dashed border-gray-200 dark:border-gray-700 w-full"></div>
                                    <div className="border-t border-dashed border-gray-200 dark:border-gray-700 w-full"></div>
                                    <div className="border-t border-dashed border-gray-200 dark:border-gray-700 w-full"></div>
                                </div>
                                {/* Sparkline SVG */}
                                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                                    <defs>
                                        <linearGradient id="gradient-query" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#137fec" stopOpacity="0.2"></stop>
                                            <stop offset="100%" stopColor="#137fec" stopOpacity="0"></stop>
                                        </linearGradient>
                                    </defs>
                                    <path d="M0 35 L10 32 L20 34 L30 25 L40 28 L50 20 L60 22 L70 15 L80 10 L90 12 L100 5 L100 40 L0 40 Z" fill="url(#gradient-query)"></path>
                                    <path d="M0 35 L10 32 L20 34 L30 25 L40 28 L50 20 L60 22 L70 15 L80 10 L90 12 L100 5" fill="none" stroke="#137fec" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                    <circle className="fill-primary stroke-white dark:stroke-surface-dark stroke-2" cx="100" cy="5" r="3"></circle>
                                </svg>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Semana Anterior</span>
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Fecha Seleccionada</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QueryScreen;
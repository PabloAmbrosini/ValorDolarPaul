import React, { useState, useRef, useEffect } from 'react';
import { getRateForDate } from '../services/dollarService.ts';
import { DailyRate } from '../types.ts';

interface QueryScreenProps {
    onNavigate: (screen: string) => void;
}

const QueryScreen: React.FC<QueryScreenProps> = ({ onNavigate }) => {
    const today = new Date();
    // Ampliamos el rango de años para permitir consultas históricas reales
    const startYear = 2015;
    const currentYear = today.getFullYear();
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    // El número de días depende del mes y año seleccionados
    const [selectedDay, setSelectedDay] = useState(today.getDate());
    const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
    const [selectedYear, setSelectedYear] = useState(today.getFullYear());

    const [result, setResult] = useState<DailyRate | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const dayRef = useRef<HTMLDivElement>(null);
    const monthRef = useRef<HTMLDivElement>(null);
    const yearRef = useRef<HTMLDivElement>(null);

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Sincronizar scroll al montar
    useEffect(() => {
        const itemHeight = 52;
        if (dayRef.current) dayRef.current.scrollTop = (selectedDay - 1) * itemHeight;
        if (monthRef.current) monthRef.current.scrollTop = selectedMonth * itemHeight;
        if (yearRef.current) {
            const yearIndex = years.indexOf(selectedYear);
            if (yearIndex >= 0) yearRef.current.scrollTop = yearIndex * itemHeight;
        }
    }, []);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>, setter: (val: number) => void, values: any[]) => {
        const itemHeight = 52;
        const index = Math.round(e.currentTarget.scrollTop / itemHeight);
        if (index >= 0 && index < values.length) {
            setter(values[index]);
        }
    };

    const selectItem = (val: number, type: 'day' | 'month' | 'year') => {
        const itemHeight = 52;
        if (type === 'day') {
            setSelectedDay(val);
            if (dayRef.current) dayRef.current.scrollTo({ top: (val - 1) * itemHeight, behavior: 'smooth' });
        } else if (type === 'month') {
            setSelectedMonth(val);
            if (monthRef.current) monthRef.current.scrollTo({ top: val * itemHeight, behavior: 'smooth' });
        } else if (type === 'year') {
            setSelectedYear(val);
            const yearIdx = years.indexOf(val);
            if (yearRef.current) yearRef.current.scrollTo({ top: yearIdx * itemHeight, behavior: 'smooth' });
        }
    };

    const handleQuery = async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        // Validación básica de fecha futura
        const pickDate = new Date(selectedYear, selectedMonth, selectedDay);
        if (pickDate > today) {
            setError("No se puede consultar una fecha futura.");
            setLoading(false);
            return;
        }

        try {
            await new Promise(r => setTimeout(r, 800)); // Artificial delay for effect
            const rate = await getRateForDate(selectedDay, selectedMonth, selectedYear);
            if (rate) {
                setResult(rate);
            } else {
                setError("No se encontraron registros para esta fecha (puede ser feriado o fin de semana).");
            }
        } catch (e) {
            setError("Error al conectar con el servicio de datos.");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-8 animate-in slide-in-from-bottom-8 duration-500">
            {/* Top App Bar with glassmorphism */}
            <div className="flex items-center px-4 py-4 justify-between sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-transparent dark:border-white/5">
                <button
                    onClick={() => onNavigate('HOME')}
                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors active:scale-95"
                >
                    <span className="material-symbols-outlined text-slate-900 dark:text-white" style={{ fontSize: '24px' }}>arrow_back</span>
                </button>
                <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Historial Dólar</h1>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 flex flex-col w-full">
                <div className="px-6 pt-6 pb-6 text-center">
                    <h2 className="text-slate-900 dark:text-white text-[28px] font-black leading-tight tracking-tight mb-2">Consulta Histórica</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Elige una fecha para ver la cotización.</p>
                </div>

                {/* Date Picker Section */}
                <div className="px-4 mb-8">
                    <div className="bg-white dark:bg-[#1C252E] rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-white/5 relative overflow-hidden">
                        {/* Highlights the selection center */}
                        <div className="absolute top-1/2 left-0 right-0 h-12 -translate-y-1/2 bg-primary/10 dark:bg-primary/20 pointer-events-none z-0"></div>

                        <div className="flex justify-between items-center relative z-10">
                            {/* Day Column */}
                            <div
                                ref={dayRef}
                                onScroll={(e) => handleScroll(e, setSelectedDay, days)}
                                className="flex-1 flex flex-col items-center h-48 overflow-y-auto snap-y snap-mandatory no-scrollbar mask-gradient"
                            >
                                <div className="h-16 shrink-0 w-full"></div>
                                {days.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => selectItem(day, 'day')}
                                        className={`snap-center w-full py-3 text-lg font-medium transition-all ${day === selectedDay ? 'text-primary dark:text-white text-2xl font-bold' : 'text-slate-300 dark:text-slate-600 opacity-40 scale-90'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                                <div className="h-16 shrink-0 w-full"></div>
                            </div>

                            {/* Month Column */}
                            <div
                                ref={monthRef}
                                onScroll={(e) => {
                                    const itemHeight = 52;
                                    const index = Math.round(e.currentTarget.scrollTop / itemHeight);
                                    if (index >= 0 && index < months.length) setSelectedMonth(index);
                                }}
                                className="flex-[2] flex flex-col items-center h-48 overflow-y-auto snap-y snap-mandatory no-scrollbar mask-gradient border-x border-slate-100 dark:border-white/5"
                            >
                                <div className="h-16 shrink-0 w-full"></div>
                                {months.map((month, idx) => (
                                    <button
                                        key={month}
                                        onClick={() => selectItem(idx, 'month')}
                                        className={`snap-center w-full py-3 text-lg font-medium transition-all ${idx === selectedMonth ? 'text-primary dark:text-white text-2xl font-bold' : 'text-slate-300 dark:text-slate-600 opacity-40 scale-90'}`}
                                    >
                                        {month}
                                    </button>
                                ))}
                                <div className="h-16 shrink-0 w-full"></div>
                            </div>

                            {/* Year Column */}
                            <div
                                ref={yearRef}
                                onScroll={(e) => handleScroll(e, setSelectedYear, years)}
                                className="flex-1 flex flex-col items-center h-48 overflow-y-auto snap-y snap-mandatory no-scrollbar mask-gradient"
                            >
                                <div className="h-16 shrink-0 w-full"></div>
                                {years.map(year => (
                                    <button
                                        key={year}
                                        onClick={() => selectItem(year, 'year')}
                                        className={`snap-center w-full py-3 text-lg font-medium transition-all ${year === selectedYear ? 'text-primary dark:text-white text-2xl font-bold' : 'text-slate-300 dark:text-slate-600 opacity-40 scale-90'}`}
                                    >
                                        {year}
                                    </button>
                                ))}
                                <div className="h-16 shrink-0 w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-4 mb-6">
                    <button
                        onClick={handleQuery}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 rounded-2xl h-14 bg-primary hover:bg-primary/90 active:scale-[0.98] transition-all text-white text-base font-bold shadow-[0_8px_20px_rgb(19,127,236,0.3)] disabled:opacity-50 disabled:shadow-none"
                    >
                        {loading ? <span className="material-symbols-outlined animate-spin text-[24px]">sync</span> : <span className="material-symbols-outlined text-[24px]">search</span>}
                        {loading ? 'Consultando...' : 'Consultar Cotización'}
                    </button>
                </div>

                {error && (
                    <div className="px-6 mb-4 animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium text-center flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">error</span>
                            {error}
                        </div>
                    </div>
                )}

                {result && (
                    <div className="px-4 animate-in fade-in slide-in-from-bottom-8 duration-500 z-10">
                        <div className="bg-white dark:bg-[#1C252E] rounded-3xl p-6 border border-slate-100 dark:border-white/5 shadow-xl shadow-black/5 dark:shadow-black/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none"></div>
                            <div className="flex flex-col gap-1 relative z-10">
                                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Resultado</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-slate-900 dark:text-white text-sm font-semibold">
                                        {result.day} de {result.month}, {selectedYear}
                                    </p>
                                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 uppercase">Venta Oficial</span>
                                </div>
                                <div className="flex items-baseline mt-4 gap-1">
                                    <span className="text-3xl text-slate-400 dark:text-slate-500 font-medium">$</span>
                                    <span className="text-6xl font-black text-primary tracking-tighter">
                                        {Math.floor(result.value).toLocaleString('es-AR')}
                                    </span>
                                    <span className="text-3xl text-primary/70 font-bold">
                                        ,{result.value.toFixed(2).split('.')[1]}
                                    </span>
                                </div>
                                <div className="h-px w-full bg-slate-100 dark:bg-white/5 my-4"></div>
                                <p className="text-slate-400 dark:text-slate-500 text-[10px] italic flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[14px]">info</span>
                                    Cotización oficial de cierre del Banco Nación.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-auto py-8 text-center opacity-40 hover:opacity-100 transition-opacity">
                    <p className="text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">Diseñado por Paul</p>
                </div>
            </div>
        </div>
    );
};

export default QueryScreen;
import React, { useEffect, useState, useCallback } from 'react';
import { getOfficialRate, getWeeklyTrend } from '../services/dollarService.ts';
import { ChartDataPoint } from '../types.ts';
// import Sparkline from './Sparkline.tsx'; // Keeping it if needed later
import WeeklyBarChart from './WeeklyBarChart.tsx';

interface HomeScreenProps {
    onNavigate: (screen: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
    const [rateData, setRateData] = useState<{ compra: number, venta: number, timestamp: Date } | null>(null);
    const [trendData, setTrendData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        // Artificial delay for better UX (to show skeleton/loading state cleanly)
        if (!isSilent) await new Promise(r => setTimeout(r, 600));

        try {
            const [rate, trend] = await Promise.all([
                getOfficialRate(),
                getWeeklyTrend()
            ]);
            setRateData(rate);
            setTrendData(trend);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const handleFocus = () => fetchData(true);
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [fetchData]);

    const formattedDate = rateData
        ? new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(rateData.timestamp)
        : '--:--';

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-transparent dark:border-white/5">
                <div className="w-10"></div> {/* Spacer for center alignment */}
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
                    Dólar BNA
                </h2>
                <div className="flex w-10 items-center justify-end">
                    <button
                        onClick={() => onNavigate('QUERY')}
                        className="flex cursor-pointer items-center justify-center rounded-full h-10 w-10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[24px]">settings</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col items-center pt-8 pb-4">
                <h3 className="text-slate-900 dark:text-white tracking-tight text-3xl font-extrabold leading-tight px-4 text-center">
                    Cotización Oficial
                </h3>

                {/* Status Badge */}
                <div className={`mt-3 px-3 py-1 rounded-full flex items-center gap-2 transition-colors duration-300 ${loading ? 'bg-slate-200 dark:bg-slate-800' : 'bg-green-500/10 dark:bg-green-500/20'}`}>
                    <span className={`material-symbols-outlined text-[14px] ${loading ? 'animate-spin text-slate-500' : 'text-green-600 dark:text-green-400'}`}>
                        {loading ? 'sync' : 'check_circle'}
                    </span>
                    <p className={`text-xs font-bold uppercase tracking-wide ${loading ? 'text-slate-600 dark:text-slate-400' : 'text-green-700 dark:text-green-400'}`}>
                        {loading ? 'Actualizando...' : `Actualizado ${formattedDate}hs`}
                    </p>
                </div>
            </div>

            {/* Main Card */}
            <div className="px-4 py-4">
                <div className="group relative flex flex-col gap-6 rounded-3xl p-6 bg-white dark:bg-[#1C252E] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-white/5 overflow-hidden transition-all hover:scale-[1.01] duration-500">

                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/10 transition-all duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-400/10 transition-all duration-700"></div>

                    {/* Compra Section */}
                    <div className="relative z-10 flex flex-col">
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Compra</p>
                        {loading ? (
                            <div className="h-12 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                        ) : (
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl text-slate-400 dark:text-slate-500 font-medium">$</span>
                                <span className="text-6xl text-slate-900 dark:text-white font-black tracking-tighter">
                                    {Math.floor(rateData?.compra ?? 0).toLocaleString('es-AR')}
                                </span>
                                <span className="text-3xl text-slate-500 dark:text-slate-400 font-bold bg-slate-100 dark:bg-white/5 px-2 rounded-md">
                                    ,{((rateData?.compra ?? 0) % 1).toFixed(2).split('.')[1]}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>

                    {/* Venta Section */}
                    <div className="relative z-10 flex flex-col">
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Venta</p>
                        {loading ? (
                            <div className="h-12 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                        ) : (
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl text-primary/60 font-medium">$</span>
                                <span className="text-6xl text-primary font-black tracking-tighter">
                                    {Math.floor(rateData?.venta ?? 0).toLocaleString('es-AR')}
                                </span>
                                <span className="text-3xl text-primary/70 font-bold bg-primary/10 px-2 rounded-md">
                                    ,{((rateData?.venta ?? 0) % 1).toFixed(2).split('.')[1]}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 w-fit">
                            <span className="material-symbols-outlined text-[18px]">trending_up</span>
                            <span className="text-xs font-bold">+0.15%</span>
                        </div>
                        <button
                            onClick={() => fetchData()}
                            disabled={loading}
                            className="text-xs font-semibold text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                        >
                            <span className={`material-symbols-outlined text-[16px] ${loading ? 'animate-spin' : ''}`}>refresh</span>
                            {loading ? 'Cargando...' : 'Actualizar'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Trend Chart */}
            <div className="px-4 pb-6">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h4 className="text-slate-900 dark:text-white text-base font-bold">Tendencia Semanal</h4>
                    <button onClick={() => onNavigate('MONTHLY')} className="text-primary text-xs font-bold uppercase tracking-wide hover:underline">
                        Ver todo
                    </button>
                </div>
                <div
                    onClick={() => onNavigate('MONTHLY')}
                    className="h-64 w-full bg-white dark:bg-[#1C252E] rounded-3xl p-6 border border-slate-100 dark:border-white/5 relative overflow-hidden cursor-pointer hover:border-primary/30 transition-all group shadow-sm active:scale-[0.99]"
                >
                    {loading ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-700 border-t-primary rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="w-full h-full relative z-10">
                            {/* Optional: Add a title or aggregate stat inside the chart area if needed */}
                            <WeeklyBarChart data={trendData} color="#137fec" />
                        </div>
                    )}
                    {/* Background Glow */}
                    <div className="absolute -bottom-10 left-10 w-full h-20 bg-primary/5 blur-3xl rounded-full"></div>
                </div>
            </div>



            <div className="pb-4 text-center opacity-40 hover:opacity-100 transition-opacity">
                <p className="text-[10px] uppercase font-bold tracking-[0.3em]">Valor Dólar Paul</p>
            </div>
        </div>
    );
};

export default HomeScreen;
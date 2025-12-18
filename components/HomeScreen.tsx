import React, { useEffect, useState } from 'react';
import { getOfficialRate } from '../services/dollarService';

interface HomeScreenProps {
    onNavigate: (screen: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
    const [rateData, setRateData] = useState<{compra: number, venta: number, timestamp: Date} | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getOfficialRate();
            setRateData(data);
        };
        fetchData();
    }, []);

    const formattedDate = rateData 
        ? new Intl.DateTimeFormat('es-AR', { hour: '2-digit', minute: '2-digit' }).format(rateData.timestamp)
        : '--:--';

    return (
        <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white pb-8">
            {/* TopAppBar */}
            <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12">
                    Dólar BNA
                </h2>
                <div className="flex w-12 items-center justify-end">
                    <button 
                        onClick={() => onNavigate('QUERY')}
                        className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[24px]">settings</span>
                    </button>
                </div>
            </div>

            {/* Headline & Date */}
            <div className="flex flex-col items-center pt-6 pb-2">
                <h3 className="text-slate-900 dark:text-white tracking-tight text-3xl font-extrabold leading-tight px-4 text-center">
                    Cotización Oficial
                </h3>
                <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800">
                    <span className="material-symbols-outlined text-[16px] text-slate-500 dark:text-slate-400">schedule</span>
                    <p className="text-slate-600 dark:text-slate-400 text-xs font-medium leading-normal uppercase tracking-wide">
                        Actualizado hoy {formattedDate}hs
                    </p>
                </div>
            </div>

            {/* Main Stats Card */}
            <div className="px-4 py-6">
                <div className="flex flex-col gap-6 rounded-2xl p-6 bg-white dark:bg-surface-dark shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group transition-all">
                    {/* Abstract background decoration */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>

                    {/* Buy Price */}
                    <div className="flex flex-col relative z-0">
                        <div className="flex justify-between items-end mb-1">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Compra</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-slate-900 dark:text-white tracking-tighter text-5xl font-black leading-none">
                                {rateData ? `$${rateData.compra.toLocaleString('es-AR', {minimumFractionDigits: 2})}` : '...'}
                            </p>
                        </div>
                    </div>

                    <div className="h-px w-full bg-slate-100 dark:bg-slate-700"></div>

                    {/* Sell Price */}
                    <div className="flex flex-col relative z-0">
                        <div className="flex justify-between items-end mb-1">
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Venta</p>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <p className="text-primary tracking-tighter text-5xl font-black leading-none">
                                {rateData ? `$${rateData.venta.toLocaleString('es-AR', {minimumFractionDigits: 2})}` : '...'}
                            </p>
                        </div>
                    </div>

                    {/* Variation Badge */}
                    <div className="flex items-center justify-between mt-2 pt-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 w-fit">
                            <span className="material-symbols-outlined text-[18px]">trending_up</span>
                            <span className="text-sm font-bold">+0.15%</span>
                        </div>
                        <span className="text-xs text-slate-400">Variación 24hs</span>
                    </div>
                </div>
            </div>

            {/* Mini Chart Section */}
            <div className="px-4 pb-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-slate-900 dark:text-white text-base font-bold">Tendencia Semanal</h4>
                    <button 
                        onClick={() => onNavigate('MONTHLY')}
                        className="text-primary text-sm font-medium hover:underline"
                    >
                        Ver histórico
                    </button>
                </div>
                <div 
                    onClick={() => onNavigate('MONTHLY')}
                    className="h-32 w-full bg-white dark:bg-surface-dark rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden cursor-pointer hover:bg-slate-50 dark:hover:bg-[#202b37] transition-colors"
                >
                    {/* Sparkline SVG representation */}
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                        <defs>
                            <linearGradient id="gradient-spark" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#137fec" stopOpacity="0.2"></stop>
                                <stop offset="100%" stopColor="#137fec" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        <path d="M0 35 L10 32 L20 34 L30 25 L40 28 L50 20 L60 22 L70 15 L80 18 L90 10 L100 5" fill="url(#gradient-spark)" stroke="none"></path>
                        <path d="M0 35 L10 32 L20 34 L30 25 L40 28 L50 20 L60 22 L70 15 L80 18 L90 10 L100 5" fill="none" stroke="#137fec" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        <circle className="dark:stroke-surface-dark" cx="100" cy="5" fill="#137fec" r="3" stroke="white" strokeWidth="2"></circle>
                    </svg>
                    {/* Axis labels (minimalist) */}
                    <div className="absolute bottom-2 left-4 text-[10px] text-slate-400 font-medium">Lunes</div>
                    <div className="absolute bottom-2 right-4 text-[10px] text-slate-400 font-medium">Hoy</div>
                </div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-4 px-4 pb-8 mt-auto">
                <button 
                    onClick={() => onNavigate('QUERY')}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">calculate</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Calculadora</span>
                </button>
                <button 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
                >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined">currency_exchange</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Otras Divisas</span>
                </button>
            </div>

            {/* Footer source */}
            <div className="pb-6 text-center">
                <p className="text-slate-400 dark:text-slate-600 text-xs font-normal">Fuente: Banco de la Nación Argentina</p>
            </div>
        </div>
    );
};

export default HomeScreen;
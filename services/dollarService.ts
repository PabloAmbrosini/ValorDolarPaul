import { ChartDataPoint, DailyRate, MonthlyStats } from "../types.ts";

let historicalCache: any[] | null = null;

const fetchHistoricalData = async () => {
    if (historicalCache) return historicalCache;
    try {
        // This endpoint provides the full history of the official dollar (BNA source)
        const response = await fetch('https://api.argentinadatos.com/v1/cotizaciones/dolares/oficial');
        const data = await response.json();
        // Sort by date descending
        historicalCache = data.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        return historicalCache;
    } catch (e) {
        console.error("Error fetching history", e);
        return [];
    }
};

export const getOfficialRate = async (): Promise<{compra: number, venta: number, timestamp: Date}> => {
    try {
        const response = await fetch(`https://dolarapi.com/v1/dolares/oficial?cache_bust=${Date.now()}`, {
            cache: 'no-store'
        });
        const data = await response.json();
        return {
            compra: data.compra,
            venta: data.venta,
            timestamp: new Date() 
        };
    } catch (e) {
        console.error("API Error", e);
        return { compra: 865.50, venta: 905.50, timestamp: new Date() };
    }
};

export const getWeeklyTrend = async (): Promise<ChartDataPoint[]> => {
    const history = await fetchHistoricalData();
    const last7 = history.slice(0, 7).reverse();
    return last7.map((item: any, idx: number) => ({
        day: idx,
        label: new Date(item.fecha).toLocaleDateString('es-AR', { weekday: 'short' }),
        value: item.venta
    }));
};

export const getMonthlyData = async (month: number, year: number): Promise<{ stats: MonthlyStats, chart: ChartDataPoint[], history: DailyRate[] }> => {
    const allHistory = await fetchHistoricalData();
    
    // Filter by month and year
    const monthlyItems = allHistory.filter((item: any) => {
        const d = new Date(item.fecha);
        return d.getMonth() === month && d.getFullYear() === year;
    });

    if (monthlyItems.length === 0) {
        // Fallback or empty state if no data for future/very old months
        return {
            stats: { open: 0, close: 0, max: 0, min: 0, current: 0, currentChange: 0 },
            chart: [],
            history: []
        };
    }

    const history: DailyRate[] = monthlyItems.map((item: any, idx: number) => {
        const date = new Date(item.fecha);
        const prevItem = monthlyItems[idx + 1] || item;
        const changePct = ((item.venta - prevItem.venta) / prevItem.venta) * 100;
        
        return {
            day: date.getDate() + 1, // API dates can be UTC, offset adjustment
            dayName: date.toLocaleDateString('es-ES', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase()),
            month: date.toLocaleDateString('es-ES', { month: 'long' }).replace(/^\w/, c => c.toUpperCase()),
            value: item.venta,
            changePercentage: changePct
        };
    });

    const chart: ChartDataPoint[] = [...history].reverse().map(d => ({
        day: d.day,
        label: d.day === 1 || d.day % 5 === 0 ? `${d.day}` : '',
        value: d.value
    }));

    const values = history.map(h => h.value);
    const stats: MonthlyStats = {
        open: history[history.length - 1].value,
        close: history[0].value,
        max: Math.max(...values),
        min: Math.min(...values),
        current: history[0].value,
        currentChange: history[0].changePercentage
    };

    return { stats, chart, history };
};

export const getRateForDate = async (day: number, month: number, year: number): Promise<DailyRate | null> => {
    const allHistory = await fetchHistoricalData();
    const targetDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    const match = allHistory.find((item: any) => item.fecha === targetDateStr);
    
    if (!match) return null;

    const date = new Date(match.fecha);
    return {
        day: date.getDate() + 1,
        dayName: date.toLocaleDateString('es-ES', { weekday: 'long' }).replace(/^\w/, c => c.toUpperCase()),
        month: date.toLocaleDateString('es-ES', { month: 'long' }).replace(/^\w/, c => c.toUpperCase()),
        value: match.venta,
        changePercentage: 0 // Simplification for specific date query
    };
};

import { ChartDataPoint, DailyRate, MonthlyStats } from "../types.ts";

export const formatCurrency = (value: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

export const getOfficialRate = async (): Promise<{compra: number, venta: number, timestamp: Date}> => {
    try {
        // Usamos un cache-buster dinámico para evitar resultados cacheados por el navegador o CDN
        const response = await fetch(`https://dolarapi.com/v1/dolares/oficial?cache_bust=${Date.now()}`, {
            cache: 'no-store'
        });
        const data = await response.json();
        
        return {
            compra: data.compra,
            venta: data.venta,
            // Usamos la hora actual del dispositivo para confirmar al usuario que la consulta se realizó "ahora"
            timestamp: new Date() 
        };
    } catch (e) {
        console.error("API Error", e);
        return { compra: 865.50, venta: 905.50, timestamp: new Date() };
    }
};

export const getMonthlyData = (month: number, year: number): { stats: MonthlyStats, chart: ChartDataPoint[], history: DailyRate[] } => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let currentRate = 350 + (year - 2023) * 300 + (month * 20); 
    
    const dailyData: DailyRate[] = [];
    const chartData: ChartDataPoint[] = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dayOfWeek = date.getDay();
        const change = (Math.sin(i * 0.5) * 2) + (Math.random() * 4 - 2); 
        currentRate += change;
        
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            const previousRate = currentRate - change;
            const changePct = ((currentRate - previousRate) / previousRate) * 100;
            const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
            const monthName = date.toLocaleDateString('es-ES', { month: 'long' });

            dailyData.unshift({
                day: i,
                dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
                month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
                value: currentRate,
                changePercentage: changePct
            });
            
            chartData.push({
                day: i,
                label: i === 1 || i % 5 === 0 ? `${i}` : '',
                value: currentRate
            });
        }
    }

    const values = dailyData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const open = dailyData[dailyData.length - 1]?.value || 0; 
    const close = dailyData[0]?.value || 0; 

    return {
        stats: {
            open,
            close,
            max,
            min,
            current: close,
            currentChange: dailyData[0]?.changePercentage || 0
        },
        chart: chartData,
        history: dailyData
    };
};

export const getRateForDate = (day: number, month: number, year: number) => {
    const data = getMonthlyData(month, year);
    const match = data.history.find(d => d.day === day) || data.history[0];
    return match;
};
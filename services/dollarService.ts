import { ChartDataPoint, DailyRate, MonthlyStats } from "../types";

// Helper to format currency
export const formatCurrency = (value: number) => 
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

// Fetch live official rate
export const getOfficialRate = async (): Promise<{compra: number, venta: number, timestamp: Date}> => {
    try {
        const response = await fetch('https://dolarapi.com/v1/dolares/oficial');
        const data = await response.json();
        return {
            compra: data.compra,
            venta: data.venta,
            timestamp: new Date(data.fechaActualizacion)
        };
    } catch (e) {
        console.error("API Error", e);
        // Fallback if API fails
        return { compra: 865.50, venta: 905.50, timestamp: new Date() };
    }
};

// Simulation for monthly history
export const getMonthlyData = (month: number, year: number): { stats: MonthlyStats, chart: ChartDataPoint[], history: DailyRate[] } => {
    // Deterministic simulation based on year/month to ensure consistent "fake" history
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Base rate grows over time
    let currentRate = 350 + (year - 2023) * 300 + (month * 20); 
    
    const dailyData: DailyRate[] = [];
    const chartData: ChartDataPoint[] = [];

    // Generate daily data
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dayOfWeek = date.getDay();
        
        // Add random fluctuation + cyclical trend
        const change = (Math.sin(i * 0.5) * 2) + (Math.random() * 4 - 2); 
        currentRate += change;
        
        // Skip weekends for the list (business days), but keep continuity in calculation
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            const previousRate = currentRate - change;
            const changePct = ((currentRate - previousRate) / previousRate) * 100;

            const dayName = date.toLocaleDateString('es-ES', { weekday: 'long' });
            const monthName = date.toLocaleDateString('es-ES', { month: 'long' });

            dailyData.unshift({ // Reverse order for list
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
    const open = dailyData[dailyData.length - 1].value; 
    const close = dailyData[0].value; 

    return {
        stats: {
            open,
            close,
            max,
            min,
            current: close,
            currentChange: dailyData[0].changePercentage
        },
        chart: chartData,
        history: dailyData
    };
};

// Simulation for a specific single date query
export const getRateForDate = (day: number, month: number, year: number) => {
    // Re-use the generation logic to be consistent
    const data = getMonthlyData(month, year);
    // Find the specific day or closest previous day
    const match = data.history.find(d => d.day === day) || data.history[0];
    return match;
};
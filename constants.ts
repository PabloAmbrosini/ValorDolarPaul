import { ChartDataPoint, DailyRate, MonthlyStats } from "./types";

export const MOCK_STATS: MonthlyStats = {
    open: 350.00,
    close: 365.50,
    max: 365.50,
    min: 350.00,
    current: 365.50,
    currentChange: 2.3
};

// Simulated data to match the curve in the screenshot roughly
// Starts low, wiggles, dips around 20th, spikes at 25th, dips, ends high
export const MOCK_CHART_DATA: ChartDataPoint[] = [
    { day: 1, label: '1 Oct', value: 350 },
    { day: 3, label: '', value: 358 },
    { day: 5, label: '5', value: 355 },
    { day: 7, label: '', value: 348 },
    { day: 8, label: '', value: 352 },
    { day: 10, label: '10', value: 345 },
    { day: 12, label: '', value: 355 },
    { day: 13, label: '', value: 356 },
    { day: 15, label: '15', value: 358 },
    { day: 18, label: '', value: 340 },
    { day: 20, label: '20', value: 335 }, // The big dip
    { day: 22, label: '', value: 345 },
    { day: 24, label: '', value: 368 }, // The peak
    { day: 25, label: '25', value: 365 },
    { day: 27, label: '', value: 350 },
    { day: 29, label: '', value: 345 },
    { day: 30, label: '30', value: 360 },
    { day: 31, label: '', value: 365.5 },
];

export const MOCK_DAILY_HISTORY: DailyRate[] = [
    { day: 31, dayName: 'Martes', month: 'Octubre', value: 365.50, changePercentage: 0.5 },
    { day: 30, dayName: 'Lunes', month: 'Octubre', value: 363.00, changePercentage: 0.0 },
    { day: 27, dayName: 'Viernes', month: 'Octubre', value: 363.00, changePercentage: -0.2 },
    { day: 26, dayName: 'Jueves', month: 'Octubre', value: 364.50, changePercentage: 1.1 },
    { day: 25, dayName: 'Miércoles', month: 'Octubre', value: 360.50, changePercentage: 2.5 },
    { day: 24, dayName: 'Martes', month: 'Octubre', value: 352.00, changePercentage: -1.0 },
];
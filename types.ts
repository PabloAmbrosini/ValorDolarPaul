export interface DailyRate {
    day: number;
    dayName: string;
    month: string;
    value: number;
    changePercentage: number;
}

export interface ChartDataPoint {
    day: number;
    label: string;
    value: number;
}

export interface MonthlyStats {
    open: number;
    close: number;
    max: number;
    min: number;
    current: number;
    currentChange: number;
}
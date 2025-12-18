import React, { useMemo } from 'react';
import { ChartDataPoint } from '../types';

interface WeeklyBarChartProps {
    data: ChartDataPoint[];
    height?: number;
    color?: string;
}

const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({
    data,
    height = 220,
    color = "#137fec"
}) => {
    // 1. Calculations
    const { processedData, min, max, gridLines } = useMemo(() => {
        if (data.length === 0) return { processedData: [], min: 0, max: 0, gridLines: [] };

        const vals = data.map(d => d.value);
        let minVal = Math.min(...vals);
        let maxVal = Math.max(...vals);

        // Add padding to Y axis so bars don't touch top/bottom completely
        const padding = (maxVal - minVal) * 0.2 || 10;
        minVal = Math.max(0, minVal - padding);
        maxVal = maxVal + padding;
        const range = maxVal - minVal || 1;

        // Generate Grid Lines (3 lines)
        const gridLinesVals = [minVal + range * 0.25, minVal + range * 0.5, minVal + range * 0.75];

        // Process bars with variation
        const processed = data.map((d, i) => {
            const prev = i > 0 ? data[i - 1].value : d.value;
            const change = ((d.value - prev) / prev) * 100;

            // Normalize height 0-1
            const normalizedHeight = (d.value - minVal) / range;

            return {
                ...d,
                normalizedHeight,
                change,
                // Layout X
                xPercent: (i / Math.max(1, data.length - 1)) * 100
            };
        });

        return { processedData: processed, min: minVal, max: maxVal, gridLines: gridLinesVals };
    }, [data]);

    if (data.length === 0) return null;

    // ViewBox dimensions
    const VIEW_W = 100;
    const VIEW_H = 100;

    // Config
    const BAR_WIDTH = 6; // relatively thin bars for elegance
    const LABEL_OFFSET = 15;

    return (
        <svg className="w-full h-full overflow-visible font-sans" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.3} />
                </linearGradient>
            </defs>

            {/* Dotted Grid Lines (Y Axis) */}
            {gridLines.map((val, i) => {
                const y = VIEW_H - ((val - min) / (max - min)) * VIEW_H;
                return (
                    <g key={`grid-${i}`}>
                        <line
                            x1={0} y1={y} x2={VIEW_W} y2={y}
                            stroke="currentColor"
                            strokeOpacity={0.1}
                            strokeDasharray="2 2"
                            strokeWidth={0.5}
                            className="text-slate-400 dark:text-slate-600"
                        />
                        <text
                            x={-2} y={y}
                            fill="currentColor"
                            fontSize="3"
                            textAnchor="end"
                            alignmentBaseline="middle"
                            className="text-slate-400 dark:text-slate-600 opacity-60"
                        >
                            {Math.round(val)}
                        </text>
                    </g>
                );
            })}

            {/* Bars & Labels */}
            {processedData.map((d, i) => {
                // Determine accurate bar width based on available space
                // Using percentage based width calculation might be safer for responsiveness
                // But for SVG coordinate system (0-100), we need to distribute them.
                // Re-calculating X to center bars in their "slot".
                const slotWidth = VIEW_W / processedData.length;
                const x = (i * slotWidth) + (slotWidth / 2);

                const barH = d.normalizedHeight * VIEW_H * 0.6; // Use 60% of height max for bars to leave room for labels
                const y = VIEW_H - barH;

                const isPositive = d.change >= 0;
                const changeColor = isPositive ? '#22c55e' : '#ef4444'; // green-500 : red-500

                return (
                    <g key={i} className="group">
                        {/* Hover Hitbox (invisible full height column) */}
                        <rect x={i * slotWidth} y={0} width={slotWidth} height={VIEW_H} fill="transparent" />

                        {/* Dotted Vertical Line (Visual Guide) */}
                        <line
                            x1={x} y1={0} x2={x} y2={VIEW_H}
                            stroke="currentColor"
                            strokeOpacity={0.05}
                            strokeDasharray="1 3"
                            strokeWidth={0.5}
                            className="text-slate-400 group-hover:stroke-opacity-20 transition-all"
                        />

                        {/* The Bar */}
                        <rect
                            x={x - (BAR_WIDTH / 2)}
                            y={y}
                            width={BAR_WIDTH}
                            height={barH}
                            rx={1}
                            fill="url(#barGradient)"
                            className="transition-all duration-300 group-hover:fill-primary group-hover:opacity-100"
                        />

                        {/* Value Label (Top of Bar) */}
                        <text
                            x={x}
                            y={y - 3}
                            textAnchor="middle"
                            fontSize="3.5"
                            fontWeight="bold"
                            fill="currentColor"
                            className="text-slate-700 dark:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        >
                            ${Math.floor(d.value)}
                        </text>

                        {/* Variation Label (Bottom or Middle) - shown always or on hover? 
                             User asked for "Show value and variation". Let's show variation permanently but tiny, 
                             or maybe better: show value permanently and variation below.
                             Let's try: Value permanently on top (small), Date at bottom.
                         */}
                        <text
                            x={x}
                            y={y - 4}
                            textAnchor="middle"
                            fontSize="3"
                            fontWeight="bold"
                            fill="currentColor"
                            className="text-slate-700 dark:text-white"
                        >
                            {Math.floor(d.value)}
                        </text>

                        {/* Variation Bubble */}
                        {i > 0 && (
                            <foreignObject x={x - 6} y={y - 12} width={12} height={6} className="overflow-visible">
                                <div className={`flex justify-center items-center text-[2px] font-bold px-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'} opacity-60 group-hover:opacity-100 transition-opacity`}>
                                    {isPositive ? '+' : ''}{d.change.toFixed(1)}%
                                </div>
                            </foreignObject>
                        )}

                        {/* Date Label */}
                        <text
                            x={x}
                            y={VIEW_H + 8} // Push below viewbox slightly, we handle with overflow-visible
                            textAnchor="middle"
                            fontSize="3"
                            fill="currentColor"
                            className="text-slate-400 uppercase font-medium"
                        >
                            {d.label.slice(0, 3)}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

export default WeeklyBarChart;

import React, { useMemo } from 'react';
import { ChartDataPoint } from '../types';

interface SparklineProps {
    data: ChartDataPoint[];
    height?: number;
    width?: number; // Though usually we rely on SVG scaling
    color?: string;
    strokeWidth?: number;
    showDot?: boolean;
    fillOpacity?: number;
}

const Sparkline: React.FC<SparklineProps> = ({
    data,
    height = 40,
    color = "#137fec",
    strokeWidth = 2,
    showDot = true,
    fillOpacity = 0.2
}) => {
    const { path, fillPath, lastPoint } = useMemo(() => {
        if (data.length < 2) return { path: "", fillPath: "", lastPoint: null };

        const min = Math.min(...data.map(d => d.value));
        const max = Math.max(...data.map(d => d.value));
        const range = max - min || 1;
        // Margins for the chart area inside SVG (0-100 x, 0-height y)
        // We use a fixed coordinate system 0-100 for X, and dynamic for Y
        
        // We want some padding on top/bottom so stroke doesn't get cut off
        const paddingY = 5;
        const availableHeight = height - (paddingY * 2);

        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            // Invert Y axis because SVG 0 is top
            const normalizedVal = (d.value - min) / range;
            const y = (height - paddingY) - (normalizedVal * availableHeight);
            return { x, y };
        });

        const pathD = points.map((p, i) => 
            `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
        ).join(' ');

        const fillD = `${pathD} L 100 ${height} L 0 ${height} Z`;

        return { 
            path: pathD, 
            fillPath: fillD,
            lastPoint: points[points.length - 1] 
        };
    }, [data, height]);

    if (data.length < 2) return null;

    const uniqueId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox={`0 0 100 ${height}`}>
            <defs>
                <linearGradient id={uniqueId} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={fillOpacity}></stop>
                    <stop offset="100%" stopColor={color} stopOpacity="0"></stop>
                </linearGradient>
            </defs>
            <path d={fillPath} fill={`url(#${uniqueId})`} stroke="none"></path>
            <path d={path} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}></path>
            {showDot && lastPoint && (
                <circle 
                    cx={lastPoint.x} 
                    cy={lastPoint.y} 
                    r="3" 
                    fill={color} 
                    stroke="white" 
                    strokeWidth="2"
                    className="dark:stroke-surface-dark"
                />
            )}
        </svg>
    );
};

export default Sparkline;

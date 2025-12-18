import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../types';

interface PriceChartProps {
    data: ChartDataPoint[];
}

// Custom dot to render at the last data point
const CustomActiveDot = (props: any) => {
    const { cx, cy, index, dataLength } = props;
    
    // Only render for the last point
    if (index === dataLength - 1) {
        return (
            <circle 
                cx={cx} 
                cy={cy} 
                r={5} 
                fill="#137fec" 
                stroke="white" 
                strokeWidth={2} 
                className="dark:stroke-[#101922]"
            />
        );
    }
    return null;
};

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
    // Calculate min/max for domain to make the chart look dynamic
    const minVal = Math.min(...data.map(d => d.value));
    const maxVal = Math.max(...data.map(d => d.value));
    const padding = (maxVal - minVal) * 0.2; // 20% padding

    return (
        <div className="w-full h-[220px] relative">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 0,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#137fec" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#137fec" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis 
                        dataKey="label" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                        interval={0} 
                        padding={{ left: 24, right: 24 }}
                    />
                    <YAxis 
                        hide 
                        domain={[minVal - padding, maxVal + padding]} 
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1c2630', 
                            borderColor: '#334155', 
                            color: '#fff',
                            borderRadius: '8px',
                            fontSize: '12px'
                        }}
                        itemStyle={{ color: '#fff' }}
                        cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Valor']}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#137fec"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        animationDuration={1500}
                        dot={<CustomActiveDot dataLength={data.length} />}
                        activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceChart;
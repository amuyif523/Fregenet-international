'use client';

interface HealthRecord {
    height: number | string | { toNumber(): number };
    weight: number | string | { toNumber(): number };
    date: string | Date;
}

export function HealthGrowthChart({ history }: { history: HealthRecord[] }) {
    if (history.length === 0) {
        return (
            <div className="h-48 flex items-center justify-center text-secondary italic text-sm">
                No health measurements recorded yet.
            </div>
        );
    }

    // Take last 8 measurements for the chart
    const data = history.slice(-8);
    const maxHeight = Math.max(...data.map(d => Number(d.height)));
    const maxWeight = Math.max(...data.map(d => Number(d.weight)));

    return (
        <div className="space-y-12 pb-4">
            {/* Height Trend */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">Height Trend (cm)</h3>
                </div>
                <div className="flex items-end gap-2 h-32">
                    {data.map((record, idx) => {
                        const heightPercent = (Number(record.height) / maxHeight) * 100;
                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                                <div className="absolute -top-6 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {Number(record.height).toFixed(0)}
                                </div>
                                <div 
                                    className="w-full bg-primary/20 rounded-t-lg hover:bg-primary transition-colors cursor-help"
                                    style={{ height: `${heightPercent}%` }}
                                ></div>
                                <span className="text-[8px] text-secondary font-bold uppercase truncate w-full text-center">
                                    {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Weight Trend */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-secondary uppercase tracking-widest">Weight Trend (kg)</h3>
                </div>
                <div className="flex items-end gap-2 h-32">
                    {data.map((record, idx) => {
                        const weightPercent = (Number(record.weight) / maxWeight) * 100;
                        return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                                <div className="absolute -top-6 bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {Number(record.weight).toFixed(1)}
                                </div>
                                <div 
                                    className="w-full bg-green-500/20 rounded-t-lg hover:bg-green-600 transition-colors cursor-help"
                                    style={{ height: `${weightPercent}%` }}
                                ></div>
                                <span className="text-[8px] text-secondary font-bold uppercase truncate w-full text-center">
                                    {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

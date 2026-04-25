import React, { useMemo } from 'react';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { Banknote } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// CustomTooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/20 ring-1 ring-slate-100">
            <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
            <div className="space-y-1">
                <p className="text-sm font-bold text-blue-600">Rev: ₹{payload[0].value}</p>
                <p className="text-sm font-bold text-amber-500">Com: ₹{payload[1].value}</p>
            </div>
        </div>
    );
};

export default function FinancialChart({ allAttendance, teams, sites }) {
    // Memoized financial data calculation
    const financialData = useMemo(() => {
        if (!allAttendance || !teams || !sites) return [];

        const days = eachDayOfInterval({
            start: subDays(new Date(), 6),
            end: new Date()
        });

        // Create Maps for O(1) lookup
        const teamsMap = new Map(teams.map(t => [t.uid, t]));
        const sitesMap = new Map(sites.map(s => [s.uid, s]));
        console.log(teamsMap, sitesMap)
        return days.map(day => {
            let revenue = 0;
            let cost = 0;

            const dayRecords = allAttendance.filter(record =>
                isSameDay(new Date(record.date), day)
            );

            dayRecords.forEach(record => {
                const site = sitesMap.get(record.siteId);

                record.presentLaborerIds.forEach(workerId => {
                    const worker = teamsMap.get(workerId);
                    if (worker) {
                        cost += Number(worker.dailyWage) || 0;
                        if (site) {
                            revenue += worker.role.toLowerCase() === 'mistri'
                                ? Number(site.mistriWage) || 0
                                : Number(site.laborWage) || 0;
                        }
                    }
                });
            });

            return {
                date: format(day, 'EEE'),
                revenue,
                commission: revenue - cost
            };
        });
    }, [allAttendance, teams, sites]);

    return (
        <section className="bg-white p-6 rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-blue-500" />
                    Financials
                </h2>
                <div className="flex items-center gap-3">
                    {[
                        { color: 'bg-blue-500', label: 'Rev', ring: 'ring-blue-100' },
                        { color: 'bg-amber-400', label: 'Com', ring: 'ring-amber-100' }
                    ].map(({ color, label, ring }) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${color} ring-2 ${ring}`} />
                            <span className="text-xs font-semibold text-slate-500">{label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="h-56 w-full -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialData}>
                        <defs>
                            {[
                                { id: 'colorRev', color: '#3B82F6' },
                                { id: 'colorCom', color: '#F59E0B' }
                            ].map(({ id, color }) => (
                                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F8FAFC" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRev)"
                        />
                        <Area
                            type="monotone"
                            dataKey="commission"
                            stroke="#F59E0B"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCom)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}

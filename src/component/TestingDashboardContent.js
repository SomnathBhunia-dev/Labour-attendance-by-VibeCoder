'use client';
import React, { useState, useEffect } from 'react';
import { useStateValue } from '@/context/context';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';
import {
    Users,
    HardHat,
    UserCheck,
    Banknote,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// StatCard Component
const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, trend, trendUp, fullWidth }) => (
    <div className={`bg-white p-5 rounded-[24px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-50 ${fullWidth ? 'w-full' : ''}`}>
        <div className="flex justify-between items-start mb-2">
            <div className={`p-2.5 rounded-xl ${bgClass}`}>
                <Icon className={`w-5 h-5 ${colorClass}`} strokeWidth={2.5} />
            </div>
            {trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {trend}
                </span>
            )}
        </div>
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">{title}</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{value}</h3>
        </div>
    </div>
);

export default function TestingDashboardContent() {
    const { allAttendance, teams, dailyRecords, sites } = useStateValue();
    const [financialData, setFinancialData] = useState([]);
    const [currentDate, setCurrentDate] = useState('');

    // Calculate Today's Attendance Stats
    const presentLaborerIds = dailyRecords?.log?.flatMap(record => record.presentLaborerIds) || [];
    const presentLaborers = teams?.filter(team => presentLaborerIds.includes(team.uid) && team.role.toLowerCase() === 'labour').length || 0;
    const presentMistris = teams?.filter(team => presentLaborerIds.includes(team.uid) && team.role.toLowerCase() === 'mistri').length || 0;
    const totalTeam = presentLaborers + presentMistris + "/" + (teams?.length || 0);

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }));
    }, []);

    useEffect(() => {
        if (allAttendance && teams && sites) {
            const end = new Date();
            const start = subDays(end, 6);
            const days = eachDayOfInterval({ start, end });

            const financials = days.map(day => {
                let dailyRevenue = 0;
                let dailyLaborCost = 0;

                // Find records for this day
                const dayRecords = allAttendance.filter(record =>
                    isSameDay(new Date(record.date), day)
                );

                dayRecords.forEach(record => {
                    const site = sites.find(s => s.uid === record.siteId);

                    record.presentLaborerIds.forEach(workerId => {
                        const worker = teams.find(t => t.uid === workerId);
                        if (worker) {
                            // Calculate Cost (Worker's Wage)
                            dailyLaborCost += Number(worker.dailyWage) || 0;

                            // Calculate Revenue (Site's Wage for that role)
                            if (site) {
                                if (worker.role.toLowerCase() === 'mistri') {
                                    dailyRevenue += Number(site.mistriWage) || 0;
                                } else {
                                    // Assuming anything not Mistri is Labor/Labour
                                    dailyRevenue += Number(site.laborWage) || 0;
                                }
                            }
                        }
                    });
                });

                return {
                    date: format(day, 'EEE'),
                    revenue: dailyRevenue,
                    commission: dailyRevenue - dailyLaborCost
                };
            });

            setFinancialData(financials);
        }
    }, [allAttendance, teams, sites]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/20 ring-1 ring-slate-100">
                    <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-blue-600">
                            Rev: ₹{payload[0].value}
                        </p>
                        <p className="text-sm font-bold text-amber-500">
                            Com: ₹{payload[1].value}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="pb-32 space-y-8 animate-fade-in p-6 bg-slate-50 min-h-screen">

            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h1>
                    <p className="text-slate-500 font-medium">Good Morning, Manager</p>
                </div>
            </div>

            {/* Attendance Section */}
            <section>
                <div className="flex justify-between items-center mb-4 px-1">
                    <h2 className="text-lg font-bold text-slate-900">Today's Attendance</h2>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                        {currentDate}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    <StatCard
                        title="Mistris"
                        value={presentMistris}
                        icon={HardHat}
                        colorClass="text-purple-600"
                        bgClass="bg-purple-50"
                    />
                    <StatCard
                        title="Laborers"
                        value={presentLaborers}
                        icon={Users}
                        colorClass="text-emerald-600"
                        bgClass="bg-emerald-50"
                        trendUp={true}
                    />
                    <div className="col-span-2 md:col-span-1">
                        <StatCard
                            title="Total Team"
                            value={totalTeam}
                            icon={UserCheck}
                            colorClass="text-blue-600"
                            bgClass="bg-blue-50"
                            fullWidth
                        />
                    </div>
                </div>
            </section>

            {/* Financials Section */}
            <section className="bg-white p-6 rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-50">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Banknote className="w-5 h-5 text-blue-500" />
                            Financials
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-100"></span>
                            <span className="text-xs font-semibold text-slate-500">Rev</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-100"></span>
                            <span className="text-xs font-semibold text-slate-500">Com</span>
                        </div>
                    </div>
                </div>
                <div className="h-56 w-full -ml-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={financialData}>
                            <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorCom" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                </linearGradient>
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
        </div>
    );
}

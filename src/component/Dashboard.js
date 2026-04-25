'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useStateValue } from '@/context/context';
import { Users, HardHat, UserCheck, Building2, AlertCircle } from 'lucide-react';
import FinancialChart from './FinancialChart';

// Helper Functions
const getGreeting = (hours) => {
  if (hours < 12) return 'Good Morning';
  if (hours < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const formatDate = (date) => date.toLocaleDateString('en-US', {
  day: 'numeric',
  month: 'long',
  weekday: 'long'
});

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

// SiteCard Component (DRY principle)
const SiteCard = ({ value, label, icon: Icon, gradient, iconColor, borderColor }) => (
  <div className={`bg-gradient-to-br ${gradient} p-6 rounded-[24px] border ${borderColor} relative overflow-hidden group`}>
    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <Icon className={`w-16 h-16 ${iconColor}`} />
    </div>
    <div className="flex flex-col h-full justify-between relative z-10">
      <div className="p-2.5 bg-white/60 backdrop-blur-sm w-fit rounded-xl mb-3 shadow-sm">
        <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2.5} />
      </div>
      <div>
        <span className="text-4xl font-extrabold text-slate-800">{value}</span>
        <p className={`text-sm font-bold ${iconColor.replace('text-', 'text-')}/80 mt-1`}>{label}</p>
      </div>
    </div>
  </div>
);



export default function Dashboard() {
  const { allAttendance, teams, dailyRecords, sites } = useStateValue();
  const [mounted, setMounted] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [greeting, setGreeting] = useState('Good Morning');

  // Initialize mounted state, greeting, and date in one effect
  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setGreeting(getGreeting(now.getHours()));
    setCurrentDate(formatDate(now));
  }, []);

  // Memoized calculations for attendance stats
  const attendanceStats = useMemo(() => {
    const presentIds = dailyRecords?.log?.flatMap(record => record.presentLaborerIds) || [];
    const presentLaborers = teams?.filter(team =>
      presentIds.includes(team.uid) && team.role.toLowerCase() === 'labour'
    ).length || 0;
    const presentMistris = teams?.filter(team =>
      presentIds.includes(team.uid) && team.role.toLowerCase() === 'mistri'
    ).length || 0;

    return {
      laborers: presentLaborers,
      mistris: presentMistris,
      total: `${presentLaborers + presentMistris}/${teams?.length || 0}`
    };
  }, [dailyRecords, teams]);

  // Memoized site stats
  const siteStats = useMemo(() => {
    const active = dailyRecords?.log?.length || 0;
    return {
      active,
      workable: (sites?.length || 0) - active
    };
  }, [dailyRecords, sites]);



  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="px-1">
        <p className="text-slate-600 text-base font-medium">{greeting}, Manager 👋</p>
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
            value={attendanceStats.mistris}
            icon={HardHat}
            colorClass="text-purple-600"
            bgClass="bg-purple-50"
          />
          <StatCard
            title="Laborers"
            value={attendanceStats.laborers}
            icon={Users}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
            trendUp={true}
          />
          <div className="col-span-2 md:col-span-1">
            <StatCard
              title="Total Team"
              value={attendanceStats.total}
              icon={UserCheck}
              colorClass="text-blue-600"
              bgClass="bg-blue-50"
              fullWidth
            />
          </div>
        </div>
      </section>

      {/* Financials Section */}
      <FinancialChart
        allAttendance={allAttendance}
        teams={teams}
        sites={sites}
      />

      {/* Site Overview Section */}
      <section>
        <h2 className="text-lg font-bold text-slate-900 mb-4 px-1">Site Overview</h2>
        <div className="grid grid-cols-2 gap-4 mb-20">
          <SiteCard
            value={siteStats.active}
            label="Active Sites"
            icon={Building2}
            gradient="from-amber-50 to-orange-50"
            iconColor="text-orange-600"
            borderColor="border-orange-100/50"
          />
          <SiteCard
            value={siteStats.workable}
            label="Workable Sites"
            icon={AlertCircle}
            gradient="from-rose-50 to-pink-50"
            iconColor="text-rose-600"
            borderColor="border-rose-100/50"
          />
        </div>
      </section>
    </div>
  );
}

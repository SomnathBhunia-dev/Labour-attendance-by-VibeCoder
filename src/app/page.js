"use client";
import { useRouter } from "next/navigation";
import { useStateValue } from "@/context/context";
import { Users, CalendarCheck, TrendingUp, HandCoins, ArrowRight } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();
  const { isAuthenticated } = useStateValue();

  const handleStart = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/signin');
    }
  };

  const workflowSteps = [
    {
      icon: Users,
      title: "1. Build Your Team & Sites",
      description: "Easily add workers, set wages, and register work locations.",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: CalendarCheck,
      title: "2. Track Daily Attendance",
      description: "Quickly mark who's present at which site, every day.",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      icon: HandCoins,
      title: "3. Auto-Calculate Financials",
      description: "See estimated earnings and commissions update in real-time.",
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      icon: TrendingUp,
      title: "4. Monitor Monthly Progress",
      description: "Detailed performance reports for every site and laborer.",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden pb-24">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-600/10 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-sm text-center mb-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 mt-12">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
          <CalendarCheck className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Labour <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Attendance</span>
        </h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed">
          The smart way for contractors to track attendance, manage sites, and visualize earnings.
        </p>
      </div>

      {/* Workflow Section */}
      <div className="w-full max-w-sm mb-12 relative z-10">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center mb-6">How It Works</h2>
        <div className="space-y-4 relative">
          {/* Connecting line */}
          <div className="absolute left-[28px] top-6 bottom-6 w-0.5 bg-slate-200" />
          
          {workflowSteps.map((step, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 relative animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${(index + 1) * 150}ms`, animationFillMode: 'both' }}
            >
              <div className={`w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center shrink-0 border border-white shadow-sm relative z-10`}>
                <step.icon className={`w-6 h-6 ${step.color}`} strokeWidth={2.5} />
              </div>
              <div className="pt-2">
                <h3 className="text-base font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky Action Button */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[425px] p-6 bg-gradient-to-t from-slate-100 via-slate-100 to-transparent z-50">
        <button
          onClick={handleStart}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[20px] font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-200/50 hover:shadow-2xl hover:shadow-blue-300/50 hover:scale-[1.02] transition-all active:scale-95 group"
        >
          <span>Get Started</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
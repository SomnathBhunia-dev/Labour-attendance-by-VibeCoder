'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStateValue } from '@/context/context';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import PageLayout from '@/component/PageLayout';
import Image from 'next/image';

import EditSiteForm from '@/component/EditSiteForm';
import Loader from '@/component/Loader';

export default function SiteProgressPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { sites, allAttendance, teams, handleDeleteSite, handleEditSite, loading: contextLoading } = useStateValue();
  const [site, setSite] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!contextLoading && sites.length > 0 && id) {
      const currentSite = sites.find((s) => s.uid === id);
      setSite(currentSite);

      // Run loader for 1 second after data is fetched
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [id, sites, contextLoading]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  if (isLoading || !site) {
    return <Loader />;
  }

  const siteRecords = allAttendance.filter((record) => record.siteId === site.uid);

  const calculateSiteMonthlyEarnings = (site, month) => {
    let totalEarnings = 0;
    const start = startOfMonth(month);
    const end = endOfMonth(month);

    siteRecords.forEach((record) => {
      const recordDate = record.date;
      if (isWithinInterval(recordDate, { start, end })) {
        record.presentLaborerIds.forEach((laborerId) => {
          const laborer = teams.find((t) => t.uid === laborerId);
          if (laborer) {
            let dailyWage = 0;
            if (laborer.role.toLowerCase() === 'mistri') {
              dailyWage = Number(site.mistriWage) || 0;
            } else if (laborer.role.toLowerCase() === 'labour') {
              dailyWage = Number(site.laborWage) || 0;
            }
            totalEarnings += dailyWage;
          }
        });
      }
    });
    return totalEarnings;
  };

  const monthlyEarnings = calculateSiteMonthlyEarnings(site, currentMonth);

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start, end });

  const siteActivityMap = new Map();
  siteRecords.forEach((record) => {
    const recordDate = record.date;
    siteActivityMap.set(format(recordDate, 'yyyy-MM-dd'), record);
  });

  const getDayStatus = (date) => {
    return siteActivityMap.get(format(date, 'yyyy-MM-dd'));
  };

  const handleDayClick = (date) => {
    const record = getDayStatus(date);
    if (record) {
      setSelectedDate(date);
    } else {
      setSelectedDate(null);
    }
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const selectedRecord = selectedDate ? getDayStatus(selectedDate) : null;
  const presentLaborers = selectedRecord ? teams.filter((team) => selectedRecord.presentLaborerIds.includes(team.uid)) : [];

  return (
    <PageLayout title="Progress Report" onBack={() => router.back()} showBack={true}>
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-8 text-center relative">
            <button
              onClick={() => setIsEditFormOpen(true)}
              className="absolute top-4 right-4 p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
            >
              <span className="material-icons text-xl">edit</span>
            </button>
            <h2 className="text-2xl font-bold text-indigo-800">{site.name}</h2>
            <p className="text-indigo-500 mt-1">Location: {site.location || 'N/A'}</p>
            <div className="flex justify-around mt-4">
              <div>
                <p className="text-sm text-indigo-400">Labour Wage</p>
                <p className="text-lg font-bold text-indigo-700">{site.laborWage}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-400">Mistri Wage</p>
                <p className="text-lg font-bold text-indigo-700">{site.mistriWage}</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Monthly Report</h3>
            <p className="text-lg text-gray-600 mb-6">
              Estimated Site Earnings: <span className="font-bold text-green-500">{monthlyEarnings.toFixed(2)}</span>
            </p>
            <div className="flex items-center justify-between mb-8">
              <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <span className="material-icons text-base">chevron_left</span>
              </button>
              <span className="text-lg font-semibold text-gray-800">{format(currentMonth, 'MMMM yyyy')}</span>
              <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <span className="material-icons text-base">chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-7 gap-3 text-center">
              <div className="font-medium text-gray-500 text-sm">S</div>
              <div className="font-medium text-gray-500 text-sm">M</div>
              <div className="font-medium text-gray-500 text-sm">T</div>
              <div className="font-medium text-gray-500 text-sm">W</div>
              <div className="font-medium text-gray-500 text-sm">T</div>
              <div className="font-medium text-gray-500 text-sm">F</div>
              <div className="font-medium text-gray-500 text-sm">S</div>
              {Array(start.getDay())
                .fill(null)
                .map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
              {daysInMonth.map((date) => {
                const record = getDayStatus(date);
                const isActive = !!record;
                return (
                  <div
                    key={format(date, 'yyyy-MM-dd')}
                    onClick={() => handleDayClick(date)}
                    className={`rounded-full p-2 flex flex-col justify-center items-center h-12 w-12 mx-auto transition-all duration-300 transform hover:scale-110 ${isActive ? 'bg-green-400 text-white cursor-pointer shadow-lg' : 'bg-gray-100'
                      }`}
                  >
                    <div className={`font-bold text-lg ${isActive ? '' : 'text-gray-800'}`}>{format(date, 'd')}</div>
                    {isActive && <div className="text-xs opacity-80">{record.presentLaborerIds.length}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {selectedRecord && (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
              <div className="bg-indigo-50 rounded-2xl shadow-2xl p-8 max-w-sm w-[24rem] mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{format(selectedDate, 'MMMM d, yyyy')}</h3>
                  <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">
                    <span className="material-icons">close</span>
                  </button>
                </div>
                <ul className="divide-y divide-gray-200">
                  {presentLaborers.map((laborer) => (
                    <li key={laborer.uid} className="py-3 flex items-center space-x-4">
                      <Image
                        src={laborer.avatar}
                        alt={laborer.name}
                        className="w-12 h-12 rounded-full object-cover"
                        width={800}
                        height={500}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{laborer.name}</p>
                        <p className="text-sm text-gray-500">{laborer.role}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {isEditFormOpen && (
            <div className="fixed z-50 flex items-center justify-center bg-opacity-50">
              <EditSiteForm
                isOpen={isEditFormOpen}
                onClose={() => setIsEditFormOpen(false)}
                onEditMember={handleEditSite}
                member={site}
              />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

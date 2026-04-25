import { useState, useEffect } from "react";
import { useStateValue } from "@/context/context";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, parseISO } from "date-fns";

export default function TeamMemberProgress({ teamMember, onBack, onEdit, onDelete }) {
  const { allAttendance, sites } = useStateValue();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const calculateMonthlyEarnings = (member, month) => {
    let totalEarnings = 0;
    const start = startOfMonth(month);
    const end = endOfMonth(month);

    allAttendance.forEach(record => {
      const recordDate = record.date;
      if (isWithinInterval(recordDate, { start, end }) && record.presentLaborerIds.includes(member.uid)) {
        const dailyWage = Number(member.dailyWage) || 100;
        totalEarnings += dailyWage;
      }
    });
    return totalEarnings;
  };

  const monthlyEarnings = calculateMonthlyEarnings(teamMember, currentMonth);

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start, end });

  const attendanceMap = new Map();
  allAttendance.forEach(record => {
    const recordDate = record.date;
    if (record.presentLaborerIds.includes(teamMember.uid)) {
      attendanceMap.set(format(recordDate, 'yyyy-MM-dd'), record);
    }
  });

  const getDayStatus = (date) => {
    return attendanceMap.get(format(date, 'yyyy-MM-dd'));
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
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const selectedRecord = selectedDate ? getDayStatus(selectedDate) : null;
  const site = selectedRecord ? sites.find(s => s.uid === selectedRecord.siteId) : null;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        <header className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-700 transition-colors">
            <span className="material-icons mr-2">arrow_back_ios_new</span>
          </button>
          <div className="text-center flex-grow">
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Progress Report</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={() => onEdit(teamMember)} className="text-indigo-500 hover:text-indigo-700 transition-colors">
              <span className="material-icons">edit</span>
            </button>
            <button onClick={() => onDelete(teamMember.uid)} className="text-rose-500 hover:text-rose-700 transition-colors">
              <span className="material-icons">delete</span>
            </button>
          </div>
        </header>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-8 text-center">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 shrink-0 mx-auto mb-4"
            style={{ backgroundImage: `url("${teamMember.avatar}")` }}
          ></div>
          <h2 className="text-2xl font-bold text-indigo-800">{teamMember.name}</h2>
          <p className="text-indigo-500 mt-1">{teamMember.role}</p>
          <p className="text-indigo-500 mt-1 font-bold">Wage: {teamMember.dailyWage || 'N/A'} / day</p>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Monthly Report</h3>
          <p className="text-lg text-gray-600 mb-6">Estimated Earnings: <span className="font-bold text-green-500">{monthlyEarnings.toFixed(2)}</span></p>
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
            {Array(start.getDay()).fill(null).map((_, i) => <div key={`empty-${i}`} className="p-2"></div>)}
            {daysInMonth.map(date => {
              const isPresent = getDayStatus(date);
              return (
                <div key={format(date, 'yyyy-MM-dd')} 
                     onClick={() => handleDayClick(date)}
                     className={`rounded-full p-2 flex flex-col justify-center items-center h-12 w-12 mx-auto transition-all duration-300 transform hover:scale-110 ${isPresent ? 'bg-green-400 text-white cursor-pointer shadow-lg' : 'bg-gray-100'}`}>
                  <div className={`font-bold text-lg ${isPresent ? '' : 'text-gray-800'}`}>{format(date, 'd')}</div>
                  {isPresent && <div className="text-xs opacity-80">P</div>}
                </div>
              );
            })}
          </div>
        </div>

        {selectedRecord && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-.center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{format(selectedDate, 'MMMM d, yyyy')}</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-800">
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-800">{site ? site.name : "Unknown Site"}</p>
                <p className="text-gray-600">{site ? site.location : ""}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

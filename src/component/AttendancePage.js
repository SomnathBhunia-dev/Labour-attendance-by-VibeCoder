'use client';
import { useStateValue } from '@/context/context';
import { useState, useMemo, useRef } from 'react';
import { Calendar, MapPin, User, Check, ChevronDown, Search, Trash2, AlertTriangle, X } from 'lucide-react';
import { isSameDay, format } from 'date-fns';

const LaborerCard = ({ laborer, isChecked, onToggle, isGloballyAssignedToday, isAssignedToSelectedSite }) => {
  const isDisabled = isGloballyAssignedToday && !isAssignedToSelectedSite;

  return (
    <div
      onClick={() => !isDisabled && onToggle(laborer)}
      className={`
        relative flex items-center gap-4 p-4 rounded-[20px] border transition-all duration-200 cursor-pointer
        ${isChecked
          ? 'bg-blue-50 border-blue-200 shadow-sm'
          : isDisabled
            ? 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
            : 'bg-white border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-blue-100'
        }
      `}
    >
      {/* Avatar */}
      <div
        className={`w-12 h-12 rounded-2xl bg-cover bg-center shadow-sm ${isDisabled ? 'grayscale' : ''}`}
        style={{ backgroundImage: `url("${laborer.avatar}")` }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-bold truncate ${isChecked ? 'text-blue-900' : 'text-slate-900'}`}>
          {laborer.name}
        </h4>
        <p className="text-xs font-medium text-slate-500 truncate">{laborer.role}</p>
      </div>

      {/* Checkbox */}
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors
        ${isChecked
          ? 'bg-blue-500 border-blue-500'
          : 'border-slate-200 bg-slate-50'
        }
      `}>
        {isChecked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ isOpen, onCancel, onConfirm, siteName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Attendance?</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">
            Are you sure you want to delete the attendance for <span className="font-bold text-slate-900">{siteName}</span>? This action cannot be undone.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full h-14 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-colors active:scale-95 flex items-center justify-center gap-2"
            >
              <Trash2 className="w-5 h-5" />
              Delete Permanently
            </button>
            <button
              onClick={onCancel}
              className="w-full h-14 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-colors active:scale-95"
            >
              Cancel
            </button>
          </div>
        </div>

        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default function Attendance() {
  const [selectedMalik, setSelectedMalik] = useState('');
  const [assignedLaborers, setAssignedLaborers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dateInputRef = useRef(null);

  const { sites, teams, setAttendence, dailyRecords, handleDeleteAttendance } = useStateValue();

  // Get records for the selected date
  const selectedDateRecords = useMemo(() => {
    const targetDate = new Date(selectedDate);
    return dailyRecords.log.filter(record =>
      isSameDay(new Date(record.date), targetDate)
    );
  }, [dailyRecords, selectedDate]);
  console.log(selectedDateRecords)
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedMalik('');
    setAssignedLaborers([]);
  };

  const handleMalikChange = (e) => {
    const malikUid = e.target.value;
    setSelectedMalik(malikUid);

    const dateRecord = selectedDateRecords.find(record => record.siteId === malikUid);

    if (dateRecord) {
      const preSelectedLaborers = teams.filter(laborer =>
        dateRecord.presentLaborerIds.includes(laborer.uid)
      );
      setAssignedLaborers(preSelectedLaborers);
    } else {
      setAssignedLaborers([]);
    }
  };

  const handleToggleLaborer = (laborer) => {
    setAssignedLaborers((prev) => {
      const isAssigned = prev.some((l) => l.uid === laborer.uid);
      return isAssigned
        ? prev.filter((l) => l.uid !== laborer.uid)
        : [...prev, laborer];
    });
  };

  const handleSave = () => {
    const siteObject = sites.find((site) => site.uid === selectedMalik);

    if (!siteObject) {
      alert("Please select a site before saving.");
      return;
    }
    if (!assignedLaborers.length) {
      alert("Please select at least one laborer.");
      return;
    }

    const attendanceDate = new Date(selectedDate);
    const attendanceInfo = {
      site: siteObject,
      teams: assignedLaborers,
      date: attendanceDate,
    };
    setAttendence(attendanceInfo);
  };

  const handleDelete = () => {
    if (!selectedMalik) return;
    handleDeleteAttendance(selectedMalik, new Date(selectedDate));
    setAssignedLaborers([]);
    setShowDeleteConfirm(false);
  };

  // Check if there's an existing record for the selected site and date
  const existingRecord = useMemo(() => {
    return selectedDateRecords.find(record => record.siteId === selectedMalik);
  }, [selectedDateRecords, selectedMalik]);

  // Get all laborer UIDs assigned on selected date across all sites
  const allAssignedOnDateUids = new Set(
    selectedDateRecords.flatMap(record => record.presentLaborerIds)
  );

  // Categorize and sort teams
  const sortedTeams = [...teams].sort((a, b) => {
    const aIsAssignedToSelected = assignedLaborers.some(l => l.uid === a.uid);
    const bIsAssignedToSelected = assignedLaborers.some(l => l.uid === b.uid);

    const aIsAssignedElsewhere = allAssignedOnDateUids.has(a.uid) && !aIsAssignedToSelected;
    const bIsAssignedElsewhere = allAssignedOnDateUids.has(b.uid) && !bIsAssignedToSelected;

    if (aIsAssignedToSelected && !bIsAssignedToSelected) return -1;
    if (!aIsAssignedToSelected && bIsAssignedToSelected) return 1;
    if (!allAssignedOnDateUids.has(a.uid) && allAssignedOnDateUids.has(b.uid)) return -1;
    if (allAssignedOnDateUids.has(a.uid) && !allAssignedOnDateUids.has(b.uid)) return 1;
    if (aIsAssignedElsewhere && !bIsAssignedElsewhere) return -1;
    if (!aIsAssignedElsewhere && bIsAssignedElsewhere) return 1;

    return 0;
  });

  const maxDate = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === maxDate;

  return (
    <div className="space-y-6 pb-40">
      {/* Compact Date Selection */}
      <div
        onClick={() => dateInputRef.current?.showPicker()}
        className="relative bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2 pl-1 pointer-events-none">
          <div className="p-2 bg-blue-50 rounded-full text-blue-600">
            <Calendar className="w-4 h-4" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">
              {isToday ? 'Today' : format(new Date(selectedDate), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl pointer-events-none">
          <span className="text-xs font-bold text-slate-600">Change</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>

        <input
          ref={dateInputRef}
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          max={maxDate}
          className="absolute opacity-0 w-0 h-0"
          style={{ visibility: 'hidden', position: 'absolute', bottom: 0, left: 0 }}
        />
      </div>

      {/* Site Selection Card */}
      <section className="bg-white p-5 rounded-[24px] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-50">
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-orange-500" />
          Select Site
        </h2>
        <div className="relative">
          <select
            value={selectedMalik}
            onChange={handleMalikChange}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-4 pl-4 pr-10 font-medium outline-none appearance-none transition-all cursor-pointer"
          >
            <option value="">Choose a site...</option>
            {sites.map((site) => (
              <option key={site.uid} value={site.uid}>
                {site.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
      </section>

      {/* Laborers List */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-500" />
            Assign Team
          </h2>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
            {assignedLaborers.length} Selected
          </span>
        </div>

        <div className="grid gap-3">
          {sortedTeams.map((laborer) => {
            const isAssignedToSelectedSite = assignedLaborers.some((l) => l.uid === laborer.uid);
            const isAssignedElsewhere = selectedDateRecords.some(
              record => record.siteId !== selectedMalik && record.presentLaborerIds.includes(laborer.uid)
            );
            return (
              <LaborerCard
                key={laborer.uid}
                laborer={laborer}
                isChecked={isAssignedToSelectedSite}
                onToggle={handleToggleLaborer}
                isGloballyAssignedToday={isAssignedElsewhere}
                isAssignedToSelectedSite={isAssignedToSelectedSite}
              />
            );
          })}
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-24 left-0 right-0 px-6 z-50">
        <div className="flex w-full max-w-sm mx-auto gap-3 items-center justify-center">
          <button
            onClick={handleSave}
            disabled={!selectedMalik || assignedLaborers.length === 0}
            className={`
              flex-1 h-14 rounded-[20px] font-bold text-white shadow-xl shadow-blue-200/50
              flex items-center justify-center gap-2 transition-all active:scale-95
              ${(!selectedMalik || assignedLaborers.length === 0)
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-2xl hover:shadow-blue-300/50'
              }
            `}
          >
            <Check className="w-5 h-5" strokeWidth={3} />
            <span>Save Attendance</span>
          </button>

          {existingRecord && assignedLaborers.length === 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="group flex items-center justify-center h-14 w-14 hover:w-48 bg-red-50 border border-red-100 text-red-600 rounded-[20px] shadow-lg transition-all duration-300 overflow-hidden active:scale-95 shrink-0"
            >
              <div className="flex items-center justify-center whitespace-nowrap px-4">
                <Trash2 className="w-5 h-5 shrink-0" strokeWidth={2.5} />
                <span className="max-w-0 opacity-0 group-hover:max-w-[150px] group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 overflow-hidden font-bold">
                  Delete Record
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        siteName={sites.find(s => s.uid === selectedMalik)?.name || 'this site'}
      />
    </div>
  );
}
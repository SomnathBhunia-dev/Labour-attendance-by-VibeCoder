import { useState, useEffect } from 'react';

const FormField = ({ label, placeholder, value, onChange, type = 'text' }) => (
  <div className="mb-4">
    <label className="flex flex-col">
      <p className="pb-2 text-base font-medium text-[#0e141b]">
        {label}
      </p>
      <input
        className="h-14 w-full flex-1 resize-none overflow-hidden rounded-xl border-none bg-[#e7edf3] p-4 text-base font-normal text-[#0e141b] placeholder:text-[#4e7297] focus:border-none focus:outline-0 focus:ring-0"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        type={type}
      />
    </label>
  </div>
);

export default function EditSiteForm({ isOpen, onClose, onEditMember, member }) {
  const [name, setName] = useState('');
  const [mistriWage, setMistriWage] = useState('');
  const [laborWage, setLaborWage] = useState('');

  useEffect(() => {
    if (member) {
      setName(member.name);
      setMistriWage(member.mistriWage);
      setLaborWage(member.laborWage);
    }
  }, [member]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = { ...member, name, mistriWage, laborWage };

    if (onEditMember) {
      onEditMember(formData);
    }
    onClose(); // Close modal
  };

  return (
    <>
      <div className="fixed left-1/2 top-1/2 z-50 flex h-[812px] w-[375px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-slate-50 font-sans shadow-2xl">
        {/* Header Section */}
        <header className="flex flex-shrink-0 items-center border-b border-slate-200 p-4">
          <button onClick={onClose} className="p-2 text-[#0e141b] hover:bg-slate-200 rounded-full transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24px"
              height="24px"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </button>
          <h2 className="text-[#101418] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Edit Site
          </h2>
        </header>
        <form onSubmit={handleSubmit} className="flex flex-grow flex-col p-4">
          <div>
            <FormField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type='text'
            />
            <FormField
              label="Mistri Wage"
              placeholder="Enter Mistri Wage"
              value={mistriWage}
              onChange={(e) => setMistriWage(e.target.value)}
              type='number'
            />
            <FormField
              label="Labor Wage"
              placeholder="Enter Labor Wage"
              value={laborWage}
              onChange={(e) => setLaborWage(e.target.value)}
              type='number'
            />
          </div>
          <div className="flex-grow"></div>
          <div className="flex px-4 py-3">
            <button
              type='submit'
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-[#b2cbe5] text-[#101418] text-base font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

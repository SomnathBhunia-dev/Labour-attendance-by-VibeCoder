import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AddSiteForm from './AddSite';
import EditSiteForm from './EditSiteForm';
import { useStateValue } from '@/context/context';
import SiteItem from './SiteItem';

export default function SiteList({ setActionButton }) {
  const router = useRouter();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedSiteForEdit, setSelectedSiteForEdit] = useState(null);
  const { sites, handleAddSite, handleEditMember, handleDeleteMember } = useStateValue();

  const handleEditClick = (site) => {
    setSelectedSiteForEdit(site);
    setIsEditFormOpen(true);
  };

  const handleViewProgress = (site) => {
    router.push(`/site-progress/${site.uid}`);
  };

  const AddButton = () => (
    <button
      onClick={() => setIsAddFormOpen(true)}
      aria-label="Add Site"
      className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 bg-transparent text-[#0e141b] gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0"
    >
      <div className="text-[#0e141b]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24px"
          height="24px"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
        </svg>
      </div>
    </button>
  );

  useEffect(() => {
    setActionButton(<AddButton />);
    return () => setActionButton(null);
  }, [setActionButton]);

  return (
    <>
      {sites.map((site) => (
        <SiteItem
          key={site.uid || site.name}
          name={site.name}
          location={site.location}
          avatar={site.avatar}
          onViewProgress={() => handleViewProgress(site)}
        />
      ))}
      {isAddFormOpen && (
        <div className="fixed z-50 flex items-center justify-center bg-opacity-50">
          <AddSiteForm
            isOpen={isAddFormOpen}
            onClose={() => setIsAddFormOpen(false)}
            onAddSite={handleAddSite}
          />
        </div>
      )}
      {isEditFormOpen && (
        <div className="fixed z-50 flex items-center justify-center bg-opacity-50">
          <EditSiteForm
            isOpen={isEditFormOpen}
            onClose={() => setIsEditFormOpen(false)}
            onEditMember={handleEditMember}
            member={selectedSiteForEdit}
          />
        </div>
      )}
    </>
  )
}

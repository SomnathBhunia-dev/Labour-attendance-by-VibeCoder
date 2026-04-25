export default function SiteItem({ name, location, avatar, onViewProgress }) {
    return (
      <button
        className="flex items-center gap-4 bg-transparent px-4 min-h-[72px] py-2 justify-between w-full text-left hover:bg-gray-100 transition-colors shadow-sm odd:bg-white even:bg-gray-50"
        onClick={onViewProgress}
      >
        <div className="flex items-center gap-4">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-14 w-fit"
            style={{ backgroundImage: `url('${avatar}')` }}
            aria-label={`${name}'s avatar`}
          />
          <div className="flex flex-col justify-center">
            <p className="text-[#0e141b] text-base font-medium leading-normal line-clamp-1">{name}</p>
            <p className="text-[#4e7297] text-sm font-normal leading-normal line-clamp-2">{location}</p>
          </div>
        </div>
        {/* <span className="text-blue-600 font-medium">View Report &rarr;</span> */}
      </button>
    );
  }
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Skeleton for AdminOverview — shown while Firestore stats are being fetched.
 * Mirrors: heading + action buttons + 3 stat cards.
 */
const AdminOverviewSkeleton = () => (
  <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
    <div className="animate-in fade-in duration-300">

      {/* Heading + action buttons */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <Skeleton width={220} height={36} borderRadius={12} className="mb-2" />
          <Skeleton width={360} height={20} borderRadius={8} />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton width={150} height={40} borderRadius={999} />
          <Skeleton width={160} height={40} borderRadius={999} />
        </div>
      </div>

      {/* 3 stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="relative rounded-[2rem] border border-slate-200/60 bg-white shadow-sm overflow-hidden p-6 flex items-center justify-between min-h-[132px]"
          >
            <div className="min-w-0">
              <Skeleton width={110} height={14} borderRadius={6} className="mb-3" />
              <Skeleton width={60} height={36} borderRadius={8} />
            </div>
            <Skeleton width={48} height={48} borderRadius={16} />
          </div>
        ))}
      </div>

    </div>
  </SkeletonTheme>
);

export default AdminOverviewSkeleton;

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const DashboardHomeSkeleton = () => (
  <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
    <div className="animate-in fade-in duration-300">
      {/* Page heading */}
      <div className="mb-10">
        <Skeleton width={220} height={36} borderRadius={12} className="mb-2" />
        <Skeleton width={340} height={20} borderRadius={8} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="relative rounded-[2rem] border border-slate-200/60 bg-white shadow-sm overflow-hidden p-6 flex items-center justify-between"
          >
            <div>
              <Skeleton width={110} height={14} borderRadius={6} className="mb-3" />
              <Skeleton width={60} height={36} borderRadius={8} />
            </div>
            <Skeleton width={48} height={48} borderRadius={16} />
          </div>
        ))}
      </div>

      {/* Action prompt */}
      <div className="rounded-[2rem] border border-slate-200/60 bg-blue-50 shadow-sm overflow-hidden p-8 flex flex-col md:flex-row items-center gap-6">
        <Skeleton width={56} height={56} borderRadius={16} />
        <div className="flex-1">
          <Skeleton width={200} height={22} borderRadius={8} className="mb-2" />
          <Skeleton width={300} height={18} borderRadius={8} />
        </div>
      </div>
    </div>
  </SkeletonTheme>
);

export default DashboardHomeSkeleton;

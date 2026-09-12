import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const DashboardScheduleSkeleton = () => (
  <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-10">
        <Skeleton width={250} height={36} borderRadius={12} className="mb-2" />
        <Skeleton width={380} height={20} borderRadius={8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Timeline (2 cols wide) */}
        <div className="lg:col-span-2 relative rounded-[2rem] border border-slate-200/60 bg-blue-50 shadow-sm overflow-hidden p-6 sm:p-10">
          <div className="space-y-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-6">
                {/* Dot */}
                <Skeleton width={40} height={40} borderRadius={50} />
                {/* Card */}
                <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <Skeleton width={100} height={12} borderRadius={4} className="mb-2" />
                  <Skeleton width={220} height={22} borderRadius={8} className="mb-2" />
                  <Skeleton width="90%" height={14} borderRadius={6} className="mb-1" />
                  <Skeleton width="70%" height={14} borderRadius={6} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: sidebar cards */}
        <div className="flex flex-col gap-6">
          {/* Highlight box */}
          <div className="relative rounded-[2rem] border border-slate-200/60 bg-blue-100 shadow-md overflow-hidden p-8">
            <Skeleton width={130} height={12} borderRadius={4} className="mb-4" />
            <Skeleton width={200} height={28} borderRadius={10} className="mb-2" />
            <Skeleton width={120} height={18} borderRadius={6} className="mb-6" />
            <div className="bg-white/60 rounded-xl p-4">
              <Skeleton width={110} height={14} borderRadius={6} className="mb-2" />
              <Skeleton width={80} height={44} borderRadius={10} />
            </div>
          </div>

          {/* Checklist box */}
          <div className="relative rounded-[2rem] border border-slate-200/60 bg-blue-50 shadow-sm overflow-hidden p-8">
            <Skeleton width={150} height={22} borderRadius={8} className="mb-6" />
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton width={20} height={20} borderRadius={50} />
                  <Skeleton width={200} height={14} borderRadius={6} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </SkeletonTheme>
);

export default DashboardScheduleSkeleton;

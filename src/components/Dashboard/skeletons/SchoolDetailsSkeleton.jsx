import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SchoolDetailsSkeleton = () => (
  <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
    <div className="animate-in fade-in duration-300">
      {/* Heading */}
      <div className="mb-10">
        <Skeleton width={200} height={36} borderRadius={12} className="mb-2" />
        <Skeleton width={320} height={20} borderRadius={8} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Institution Details block */}
        <div className="relative rounded-[2rem] border border-slate-200/60 bg-blue-50 shadow-sm overflow-hidden p-8">
          <Skeleton width={160} height={22} borderRadius={8} className="mb-6" />
          <div className="space-y-6">
            <div>
              <Skeleton width={90} height={12} borderRadius={4} className="mb-2" />
              <Skeleton width={250} height={22} borderRadius={8} />
            </div>
            <div>
              <Skeleton width={80} height={12} borderRadius={4} className="mb-2" />
              <Skeleton width={130} height={32} borderRadius={10} />
            </div>
            <div className="flex items-start gap-3 mt-4">
              <Skeleton width={20} height={20} borderRadius={4} />
              <div>
                <Skeleton width={60} height={16} borderRadius={6} className="mb-2" />
                <Skeleton width={200} height={14} borderRadius={6} className="mb-1" />
                <Skeleton width={160} height={14} borderRadius={6} className="mb-1" />
                <Skeleton width={100} height={14} borderRadius={6} />
              </div>
            </div>
          </div>
        </div>

        {/* Key Contacts block */}
        <div className="relative rounded-[2rem] border border-slate-200/60 bg-blue-100 shadow-sm overflow-hidden p-8">
          <Skeleton width={140} height={22} borderRadius={8} className="mb-6" />
          <div className="space-y-8">
            {/* Principal */}
            <div>
              <Skeleton width={70} height={12} borderRadius={4} className="mb-2" />
              <Skeleton width={200} height={24} borderRadius={8} className="mb-3" />
              <div className="flex items-center gap-3 mb-2">
                <Skeleton width={16} height={16} borderRadius={4} />
                <Skeleton width={140} height={16} borderRadius={6} />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton width={16} height={16} borderRadius={4} />
                <Skeleton width={200} height={16} borderRadius={6} />
              </div>
            </div>
            {/* Coordinator */}
            <div className="pt-6 border-t border-slate-200/40">
              <Skeleton width={140} height={12} borderRadius={4} className="mb-2" />
              <Skeleton width={200} height={24} borderRadius={8} className="mb-3" />
              <div className="flex items-center gap-3">
                <Skeleton width={16} height={16} borderRadius={4} />
                <Skeleton width={140} height={16} borderRadius={6} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SkeletonTheme>
);

export default SchoolDetailsSkeleton;

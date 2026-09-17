import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const RegisterStudentsSkeleton = () => (
  <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-10">
        <Skeleton width={230} height={36} borderRadius={12} className="mb-2" />
        <Skeleton width={420} height={20} borderRadius={8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* LEFT: Single Student Form Skeleton */}
        <div className="lg:col-span-3 rounded-[2rem] border border-slate-200/60 bg-blue-50 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col gap-8">
            {/* Academic Details */}
            <div>
              <Skeleton width={180} height={24} borderRadius={8} className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="md:col-span-2">
                  <Skeleton height={50} borderRadius={12} />
                </div>
                <div className="md:col-span-2">
                  <Skeleton height={50} borderRadius={12} />
                </div>
                <Skeleton height={50} borderRadius={12} />
                <Skeleton height={50} borderRadius={12} />
                <div className="md:col-span-2">
                  <Skeleton height={50} borderRadius={12} />
                </div>
                <div className="md:col-span-2">
                  <Skeleton height={50} borderRadius={12} />
                </div>
              </div>
            </div>

            {/* Parent Details */}
            <div>
              <Skeleton width={220} height={24} borderRadius={8} className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="md:col-span-2">
                  <Skeleton height={50} borderRadius={12} />
                </div>
                <Skeleton height={50} borderRadius={12} />
                <Skeleton height={50} borderRadius={12} />
              </div>
            </div>

            <Skeleton height={56} borderRadius={9999} className="mt-2" />
          </div>
        </div>

        {/* RIGHT: Bulk Upload Skeleton */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="rounded-[2rem] border border-slate-200/60 bg-blue-100 shadow-sm p-8">
            <Skeleton width={160} height={28} borderRadius={8} className="mb-4" />
            <Skeleton height={40} borderRadius={8} className="mb-6" />
            <Skeleton height={140} borderRadius={20} />
          </div>
          
          <div className="rounded-[2rem] border border-slate-200/60 bg-blue-50 shadow-sm p-8 flex items-center justify-between">
            <div>
              <Skeleton width={140} height={20} borderRadius={8} className="mb-2" />
              <Skeleton width={100} height={16} borderRadius={6} />
            </div>
            <Skeleton width={48} height={48} borderRadius={9999} />
          </div>
        </div>

      </div>
    </div>
  </SkeletonTheme>
);

export default RegisterStudentsSkeleton;

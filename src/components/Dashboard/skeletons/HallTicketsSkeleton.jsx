import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const HallTicketsSkeleton = () => (
  <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
    <div className="animate-in fade-in duration-300">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <Skeleton width={170} height={36} borderRadius={12} className="mb-2" />
          <Skeleton width={310} height={20} borderRadius={8} />
        </div>
        <Skeleton width={190} height={46} borderRadius={50} />
      </div>

      {/* Table card */}
      <div className="relative rounded-[2rem] border border-slate-200/60 bg-blue-50 shadow-sm overflow-hidden">
        <div className="relative z-10 p-6 sm:p-8">
          {/* Status alert skeleton */}
          <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 p-4 rounded-xl mb-6">
            <Skeleton width={20} height={20} borderRadius={50} />
            <Skeleton width={300} height={16} borderRadius={6} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200/60">
                  {['Student Name', 'Reg ID', 'Grade', 'Action'].map((col) => (
                    <th key={col} className="pb-3 px-2">
                      <Skeleton width={80} height={12} borderRadius={4} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-200/40">
                    <td className="py-4 px-2"><Skeleton width={140} height={16} borderRadius={6} /></td>
                    <td className="py-4 px-2"><Skeleton width={80} height={16} borderRadius={6} /></td>
                    <td className="py-4 px-2"><Skeleton width={50} height={16} borderRadius={6} /></td>
                    <td className="py-4 px-2 text-right">
                      <Skeleton width={70} height={32} borderRadius={8} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </SkeletonTheme>
);

export default HallTicketsSkeleton;

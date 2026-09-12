import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ViewStudentsSkeleton = () => (
  <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="mb-8">
        <Skeleton width={190} height={36} borderRadius={12} className="mb-2" />
        <Skeleton width={380} height={20} borderRadius={8} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <Skeleton width={384} height={46} borderRadius={12} />
        <Skeleton width={160} height={46} borderRadius={12} />
      </div>

      {/* Table card */}
      <div className="relative rounded-[2rem] border border-slate-200/60 bg-blue-50 shadow-sm overflow-hidden">
        <div className="relative z-10 p-6">
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Photo', 'App No.', 'Full Name', 'Class', 'Contact', 'Actions'].map((col) => (
                    <th key={col} className="py-4 px-6">
                      <Skeleton width={70} height={12} borderRadius={4} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="py-4 px-6"><Skeleton width={40} height={40} borderRadius={50} /></td>
                    <td className="py-4 px-6"><Skeleton width={100} height={16} borderRadius={6} /></td>
                    <td className="py-4 px-6"><Skeleton width={140} height={16} borderRadius={6} /></td>
                    <td className="py-4 px-6"><Skeleton width={60} height={24} borderRadius={50} /></td>
                    <td className="py-4 px-6"><Skeleton width={120} height={16} borderRadius={6} /></td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Skeleton width={32} height={32} borderRadius={8} />
                        <Skeleton width={32} height={32} borderRadius={8} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
            <Skeleton width={200} height={16} borderRadius={6} />
            <div className="flex items-center gap-2">
              <Skeleton width={90} height={38} borderRadius={10} />
              <Skeleton width={70} height={38} borderRadius={10} />
            </div>
          </div>
        </div>
      </div>
    </div>
  </SkeletonTheme>
);

export default ViewStudentsSkeleton;

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Skeleton for AdminApprovals (School Registrations tab) —
 * shown while school + student data is being fetched from Firestore.
 * Mirrors: heading + a table with rows.
 */
const AdminApprovalsSkeleton = () => (
  <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
    <div className="animate-in fade-in duration-300">

      {/* Heading */}
      <div className="mb-10">
        <Skeleton width={240} height={36} borderRadius={12} className="mb-2" />
        <Skeleton width={400} height={20} borderRadius={8} />
      </div>

      {/* Card container */}
      <div className="relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-50 overflow-hidden">
        <div className="p-4 sm:p-8">
          <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white shadow-sm">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['School / UDISE', 'Students', 'Coordinator', 'Phone'].map((col) => (
                    <th key={col} className="pb-3 pt-4 px-5">
                      <Skeleton width={col === 'School / UDISE' ? 120 : 80} height={12} borderRadius={6} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(6)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="py-4 px-5">
                      <Skeleton width={180} height={16} borderRadius={6} className="mb-1" />
                      <Skeleton width={110} height={12} borderRadius={6} />
                    </td>
                    <td className="py-4 px-5">
                      <Skeleton width={50} height={28} borderRadius={999} />
                    </td>
                    <td className="py-4 px-5">
                      <Skeleton width={130} height={16} borderRadius={6} />
                    </td>
                    <td className="py-4 px-5">
                      <Skeleton width={110} height={16} borderRadius={6} />
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

export default AdminApprovalsSkeleton;

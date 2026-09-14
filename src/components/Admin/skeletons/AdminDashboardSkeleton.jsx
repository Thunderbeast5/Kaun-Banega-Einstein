import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Full-page skeleton shown while the auth state is being resolved on the
 * Admin Dashboard. Mirrors: header bar + sidebar + overview content area.
 */
const AdminDashboardSkeleton = () => (
  <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">

      {/* ── Header skeleton ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-4">
          <Skeleton circle width={48} height={48} />
          <Skeleton width={200} height={22} borderRadius={8} />
        </div>
        <div className="text-right">
          <Skeleton width={180} height={22} borderRadius={8} className="mb-1" />
          <Skeleton width={100} height={14} borderRadius={6} />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">

        {/* ── Sidebar skeleton ── */}
        <aside className="w-64 bg-white/60 backdrop-blur-md border-r border-slate-200 hidden md:flex flex-col py-8 px-4">
          <nav className="flex flex-col gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <Skeleton width={20} height={20} borderRadius={6} />
                <Skeleton width={130} height={16} borderRadius={6} />
              </div>
            ))}
          </nav>
          {/* Logout stub */}
          <div className="mt-auto flex items-center gap-3 px-4 py-3.5">
            <Skeleton width={20} height={20} borderRadius={6} />
            <Skeleton width={60} height={16} borderRadius={6} />
          </div>
        </aside>

        {/* ── Main content skeleton (overview layout) ── */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto pb-20">

            {/* Page heading + action buttons */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <Skeleton width={220} height={36} borderRadius={12} className="mb-2" />
                <Skeleton width={340} height={20} borderRadius={8} />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton width={150} height={40} borderRadius={999} />
                <Skeleton width={150} height={40} borderRadius={999} />
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

            {/* Bento grid placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-[2rem] border border-slate-200/60 bg-white shadow-sm p-8">
                <Skeleton width={200} height={24} borderRadius={8} className="mb-6" />
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
                    <div>
                      <Skeleton width={180} height={16} borderRadius={6} className="mb-1" />
                      <Skeleton width={110} height={12} borderRadius={6} />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton circle width={32} height={32} />
                      <Skeleton circle width={32} height={32} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-[2rem] border border-slate-200/60 bg-blue-50 shadow-sm p-8">
                <Skeleton width={160} height={24} borderRadius={8} className="mb-6" />
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white p-4 mb-4">
                    <Skeleton width={140} height={16} borderRadius={6} className="mb-2" />
                    <Skeleton width={180} height={12} borderRadius={6} />
                  </div>
                ))}
                <div className="rounded-2xl bg-blue-200/60 p-5 mt-6">
                  <Skeleton width={160} height={18} borderRadius={6} className="mb-2" />
                  <Skeleton width={200} height={12} borderRadius={6} className="mb-4" />
                  <Skeleton width="100%" height={38} borderRadius={12} />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  </SkeletonTheme>
);

export default AdminDashboardSkeleton;

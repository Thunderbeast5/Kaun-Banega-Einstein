import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/**
 * Full-page skeleton shown while schoolInfo is being fetched.
 * Mirrors the overall layout: header bar + sidebar + main content area.
 */
const DashboardLayoutSkeleton = () => (
  <SkeletonTheme baseColor="#e2e8f0" highlightColor="#f1f5f9">
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">

      {/* ── Header skeleton ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-4">
          <Skeleton circle width={48} height={48} />
          <Skeleton width={200} height={22} borderRadius={8} />
        </div>
        <div className="text-right">
          <Skeleton width={220} height={22} borderRadius={8} className="mb-1" />
          <Skeleton width={140} height={14} borderRadius={6} />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">

        {/* ── Sidebar skeleton ── */}
        <aside className="w-64 bg-white/60 backdrop-blur-md border-r border-slate-200 hidden md:flex flex-col py-8 px-4">
          <nav className="flex flex-col gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                <Skeleton width={20} height={20} borderRadius={6} />
                <Skeleton width={120} height={16} borderRadius={6} />
              </div>
            ))}
          </nav>
          <div className="mt-auto flex items-center gap-3 px-4 py-3.5">
            <Skeleton width={20} height={20} borderRadius={6} />
            <Skeleton width={70} height={16} borderRadius={6} />
          </div>
        </aside>

        {/* ── Main content skeleton (DashboardHome layout) ── */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto pb-20">

            {/* Heading */}
            <div className="mb-10">
              <Skeleton width={220} height={36} borderRadius={12} className="mb-2" />
              <Skeleton width={340} height={20} borderRadius={8} />
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-[2rem] border border-slate-200/60 bg-white shadow-sm p-6 flex items-center justify-between"
                >
                  <div>
                    <Skeleton width={110} height={14} borderRadius={6} className="mb-3" />
                    <Skeleton width={60} height={36} borderRadius={8} />
                  </div>
                  <Skeleton width={48} height={48} borderRadius={16} />
                </div>
              ))}
            </div>

            {/* Action banner */}
            <div className="rounded-[2rem] border border-slate-200/60 bg-blue-50 shadow-sm p-8 flex flex-col md:flex-row items-center gap-6">
              <Skeleton width={56} height={56} borderRadius={16} />
              <div className="flex-1">
                <Skeleton width={200} height={22} borderRadius={8} className="mb-2" />
                <Skeleton width={300} height={18} borderRadius={8} />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  </SkeletonTheme>
);

export default DashboardLayoutSkeleton;

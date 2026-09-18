import { useEffect, useState } from 'react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { FiUsers, FiTrendingUp, FiFileText, FiCalendar } from 'react-icons/fi';
import DashboardHomeSkeleton from './skeletons/DashboardHomeSkeleton';
import { firestore } from '../../lib/firebase';

const DashboardHome = ({ schoolInfo, loading }) => {
  const [students, setStudents] = useState([]);
  const [ticketsPublished, setTicketsPublished] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);

  useEffect(() => {
    if (!schoolInfo?.udise) {
      return undefined;
    }

    const rosterRef = collection(doc(firestore, 'students', String(schoolInfo.udise)), 'roster');
    const schoolRef = doc(firestore, 'schools', String(schoolInfo.udise));

    const unsubscribeRoster = onSnapshot(
      rosterRef,
      (snapshot) => {
        setStudents(snapshot.docs.map((student) => student.data()));
        setStudentsLoading(false);
      },
      (error) => {
        console.error('Failed to load dashboard roster:', error);
        setStudentsLoading(false);
      },
    );
    const unsubscribeSchool = onSnapshot(
      schoolRef,
      (snapshot) => setTicketsPublished(snapshot.data()?.hallTicketPublished === true),
      (error) => console.error('Failed to load ticket status:', error),
    );

    return () => {
      unsubscribeRoster();
      unsubscribeSchool();
    };
  }, [schoolInfo?.udise]);

  if (loading || !schoolInfo || studentsLoading) return <DashboardHomeSkeleton />;

  const grade9Students = students.filter((student) => /^(9|9th|grade\s*9)$/i.test(String(student.grade).trim())).length;
  const grade10Students = students.filter((student) => /^(10|10th|grade\s*10)$/i.test(String(student.grade).trim())).length;
  const totalStudents = students.length;
  const stats = [
    { title: 'Registered Students', value: totalStudents, icon: <FiUsers className="w-6 h-6 text-blue-700" />, theme: 'bg-blue-200' },
    { title: '9th Grade', value: grade9Students, icon: <FiTrendingUp className="w-6 h-6 text-slate-700" />, theme: 'bg-white' },
    { title: '10th Grade', value: grade10Students, icon: <FiTrendingUp className="w-6 h-6 text-slate-700" />, theme: 'bg-white' },
    { title: 'Tickets Ready', value: ticketsPublished ? totalStudents : 0, icon: <FiFileText className="w-6 h-6 text-blue-800" />, theme: 'bg-blue-400' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h2>
        <p className="text-slate-600 font-medium">Here is the current status of your school's participation.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className={`relative rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden ${stat.theme}`}>
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
            <div className="relative z-10 p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/80 border border-white shadow-sm flex items-center justify-center flex-shrink-0">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Prompt */}
      <div className="group relative rounded-[2rem] border border-white/60 shadow-sm bg-blue-100 overflow-hidden p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0" />
        <div className="relative z-10 flex items-center gap-6">
           <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
              <FiCalendar className="w-6 h-6 text-blue-700" />
           </div>
           <div>
             <h3 className="text-xl font-bold text-slate-900">Registration is Open</h3>
             <p className="text-slate-700 font-medium">Add your students before the October 15th deadline.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
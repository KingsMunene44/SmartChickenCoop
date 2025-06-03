import { Link } from 'react-router-dom';
import Greeting from '../components/Greeting';
import CycleInfo from '../components/CycleInfo';
import ModeInfo from '../components/ModeInfo';
import PoultryStats from '../components/PoultryStats';
import SalesInfo from '../components/SalesInfo';

const DashboardPage = () => {
  return (
    <div className="relative min-h-screen w-full bg-center bg-cover bg-no-repeat bg-fixed bg-dashboard pt-[87px] overscroll-none">
      
      {/* Gradient overlay STARTS after Navbar (top-16 = 64px) */}
      <div className="absolute top-16 left-0 right-0 bottom-0 bg-gradient-to-br from-white/70 via-black/0 to-black/0 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 space-y-6">
        {/* Greeting fully visible below navbar */}
        <Greeting />

        {/* Grid of clickable blurred cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/dashboard/cooplive" className="p-6 backdrop-blur-md bg-white/70 rounded-xl shadow-lg hover:shadow-2xl hover:bg-white/80 transition-all duration-300 ease-in-out">
            <CycleInfo />
            <p className="mt-4 text-center text-lg font-semibold text-gray-800">Coop Status Information</p>
          </Link>

          <Link to="/dashboard/controlsetup" className="p-6 backdrop-blur-md bg-white/70 rounded-xl shadow-lg hover:shadow-2xl hover:bg-white/80 transition-all duration-300 ease-in-out">
            <ModeInfo />
            <p className="mt-4 text-center text-lg font-semibold text-gray-800">Movement Logistics</p>
          </Link>

          <Link to="/dashboard/inventorysales" className="p-6 backdrop-blur-md bg-white/70 rounded-xl shadow-lg hover:shadow-2xl hover:bg-white/80 transition-all duration-300 ease-in-out">
            <PoultryStats />
            <p className="mt-4 text-center text-lg font-semibold text-gray-800">Relevant Flock Information</p>
          </Link>

          <Link to="/dashboard/inventorysales" className="p-6 backdrop-blur-md bg-white/70 rounded-xl shadow-lg hover:shadow-2xl hover:bg-white/80 transition-all duration-300 ease-in-out">
            <SalesInfo />
            <p className="mt-4 text-center text-lg font-semibold text-gray-800">Sales Analytics</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
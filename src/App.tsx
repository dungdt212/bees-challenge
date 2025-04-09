import { Routes, Route, Link, useLocation } from 'react-router-dom';
import PageOne from './pages/PageOne'
import PageTwo from './pages/PageTwo';


function App() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">BEES GROUP CHALLENGE</h1>
          <nav className="flex space-x-6">
            <Link
              to="/page-one"
              className={`pb-2 border-b-2 transition duration-300 ${
                isActive("/page-one")
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent hover:border-blue-400 text-gray-600 hover:text-blue-500"
              }`}
            >
              Logic Test
            </Link>
            <Link
              to="/page-two"
              className={`pb-2 border-b-2 transition duration-300 ${
                isActive("/page-two")
                  ? "border-blue-600 text-blue-600 font-semibold"
                  : "border-transparent hover:border-blue-400 text-gray-600 hover:text-blue-500"
              }`}
            >
              App Development Test
            </Link>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/page-one" element={<PageOne />} />
          <Route path="/page-two" element={<PageTwo />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

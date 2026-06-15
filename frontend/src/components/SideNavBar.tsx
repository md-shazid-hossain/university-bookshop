// components/SideNavBar.jsx
import { Outlet } from "react-router";
import {
  FaHome,
  FaBook,
  FaPencilAlt,
  FaSearch,
  FaCrown,
  FaBars,
  FaCalculator,
} from "react-icons/fa";
import { NavLink } from "react-router";

const menuItems = [
  { icon: FaHome, label: "Home", path: "/dashboard/home" },
  { icon: FaBook, label: "Books", path: "books" },
  { icon: FaPencilAlt, label: "Stationary", path: "stationary" },
  { icon: FaCalculator, label: "Calculator", path: "calculator" },
  { icon: FaCrown, label: "Subscriptions", path: "subscriptions" },
];

const SideNavBar = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Toggle Button */}
        <label
          htmlFor="main-drawer"
          className="btn btn-ghost drawer-button lg:hidden m-2 text-base"
        >
          <FaBars className="mr-2 text-base" /> Open Menu
        </label>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <aside className="drawer-side">
        <label
          htmlFor="main-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <nav className="menu p-4 w-80 min-h-full bg-blue-900 text-white flex flex-col">
          <div className="mb-4 px-4 py-2">
            <h2 className="text-xl font-bold">Student Dashboard</h2>
          </div>
          <ul className="space-y-0.5">
            {menuItems.map(({ icon: Icon, label, path }, index) => (
              <li key={index}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      isActive ? "bg-blue-800 text-white" : "hover:bg-blue-700"
                    }`
                  }
                >
                  <Icon className="text-base" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default SideNavBar;

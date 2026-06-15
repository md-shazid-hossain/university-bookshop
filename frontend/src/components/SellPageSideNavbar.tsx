// components/SellPageSideNavbar.jsx
import { Outlet } from "react-router";
import {
  FaTag,
  FaList,
  FaBook,
  FaPencilAlt,
  FaSearch,
  FaCrown,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router";

const sellMenuItems = [
  { icon: FaTag, label: "Sell New Item", path: "sell-item-form" },
  { icon: FaBook, label: "Books", path: "books" },
  { icon: FaPencilAlt, label: "Stationary", path: "stationary" },
  { icon: FaCrown, label: "Subscription", path: "subscriptions" },
];

const SellPageSideNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here
    // Examples:
    // - Clear localStorage/sessionStorage
    // - Clear authentication context
    // - Call logout API

    localStorage.removeItem("token"); // Example
    sessionStorage.clear(); // Example

    navigate("/login"); // Redirect to login page
  };

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
          <FaList className="mr-2 text-base" /> Sell Menu
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
        <nav className="menu p-4 w-80 min-h-full bg-teal-600 text-white flex flex-col">
          <div className="mb-4 px-4 py-2">
            <h2 className="text-xl font-bold">Sell Center</h2>
          </div>

          {/* Menu items - flex-grow pushes logout to bottom */}
          <ul className="space-y-0.5 flex-grow">
            {sellMenuItems.map(({ icon: Icon, label, path }, index) => (
              <li key={index}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      isActive ? "bg-teal-700 text-white" : "hover:bg-teal-500"
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

export default SellPageSideNavbar;

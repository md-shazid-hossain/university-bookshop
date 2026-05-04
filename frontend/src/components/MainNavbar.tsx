// components/MainNavbar.jsx
import { NavLink, useNavigate } from "react-router";
import {
  FaHome,
  FaPlusCircle,
  FaCrown,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";

const navItems = [
  { to: "/dashboard/home", icon: FaHome, label: "Home" },
  { to: "/sellpage/sell-item-form", icon: FaPlusCircle, label: "Sell" },
  { to: "/subscriptions", icon: FaCrown, label: "Subscriptions" },
];

const MainNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication tokens/storage
    localStorage.removeItem("token"); // or sessionStorage.clear()
    // Or if using context/redux, dispatch logout action here

    // Redirect to login page
    navigate("/login");
  };

  return (
    <header className="navbar bg-base-100 shadow-md px-4 sticky top-0 z-50">
      {/* Mobile Menu Button */}
      <div className="flex-none lg:hidden">
        <label htmlFor="main-drawer" className="btn btn-square btn-ghost">
          <FaBars size={18} />
        </label>
      </div>

      {/* Logo */}
<div className="flex-1">
  <NavLink to="/dashboard/home" className="block">
    <div className="flex items-center gap-2">
      {/* Logo icon - using emoji or you can use an SVG */}
      <div className="bg-blue-600 text-white w-9 h-9 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm">
        CM
      </div>
      {/* Text logo */}
      <div className="text-2xl font-bold tracking-tight">
        <span className="text-blue-600">Campus</span>
        <span className="text-gray-800">Market</span>
      </div>
    </div>
  </NavLink>
</div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg 
              transition-colors duration-200
              ${
                isActive ? "bg-base-200 font-semibold" : "hover:bg-base-200/50"
              }`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg 
            transition-colors duration-200 text-error hover:bg-error/10"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </nav>
    </header>
  );
};

export default MainNavbar;

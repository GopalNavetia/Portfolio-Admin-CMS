import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/admin/about", label: "About" },
  { to: "/admin/skills", label: "Skills" },
  { to: "/admin/projects", label: "Projects" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed bottom-0 left-0 z-20 flex w-full shrink-0 flex-col border-t border-slate-700 bg-slate-900 p-2 text-white md:static md:min-h-screen md:w-64 md:border-t-0 md:p-5">
      <h1 className="mb-3 hidden text-xl font-bold md:block md:mb-8">Portfolio CMS</h1>
      <nav className="grid grid-cols-4 gap-1 md:block md:space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block cursor-pointer rounded-md px-2 py-2 text-center text-xs font-medium transition-colors md:rounded-lg md:px-4 md:py-3 md:text-left md:text-sm ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        onClick={handleLogout}
        className="cursor-pointer rounded-md px-2 py-2 text-center text-xs font-medium text-slate-300 transition-colors hover:bg-blue-600 hover:text-white md:mt-auto md:rounded-lg md:px-4 md:py-3 md:text-left md:text-sm"
      >
        Logout
      </button>
    </aside>
  );
}

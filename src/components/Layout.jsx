import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../hooks/useAuth.js";
import { signOut } from "../store/authSlice.js";
import {
  Clock,
  Settings,
  LogOut,
  Scissors,
  Sparkles,
  User,
  Info,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Layout({ children }) {
  const { isAuthenticated, client } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/dashboard", label: "Create Shorts", icon: Sparkles, primary: true },
    { to: "/history", label: "History", icon: Clock },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* HEADER */}
      <header className="border-b border-border bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* BRAND */}
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-sm">
              <Scissors size={16} className="text-white" />
            </div>

            <div className="leading-tight">
              <div className="font-bold text-text-primary text-base tracking-tight">
                ShortMint
              </div>
              <div className="text-[11px] text-text-dim hidden sm:block">
                Turn videos into engaging Shorts
              </div>
            </div>
          </Link>

          {/* NAV AREA */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* DESKTOP NAV */}
              <div className="hidden sm:flex items-center gap-2">
                {navLinks.map(({ to, label, icon: Icon, primary }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      primary
                        ? isActive(to)
                          ? "bg-primary text-white shadow-sm"
                          : "bg-primary/90 text-white hover:bg-primary"
                        : isActive(to)
                          ? "bg-bg-secondary text-primary"
                          : "text-text-muted hover:text-text-primary hover:bg-bg-surface"
                    }`}
                  >
                    <Icon size={15} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>

              {/* MOBILE CREATE BUTTON */}
              <Link
                to="/dashboard"
                className=" sm:hidden flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm transition-all hover:bg-primary/90 active:scale-95"
              >
                <Sparkles size={15} />
                Create
              </Link>

              {/* USER DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                {/* AVATAR */}
                <button
                  onClick={() => setOpen(!open)}
                  aria-label="Open account menu"
                  className="w-9 h-9 rounded-full bg-bg-secondary flex items-center justify-center text-text-primary hover:bg-bg-surface hover:ring-2 hover:ring-primary/20 transition-all"
                >
                  {client?.name ? (
                    <span className="text-sm font-semibold">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User size={16} />
                  )}
                </button>

                {/* DROPDOWN */}
                {open && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-border rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95">
                    {/* USER INFO */}
                    <div className="px-3 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-text-primary">
                        {client?.name || "User"}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {client?.email}
                      </p>
                    </div>

                    {/* MOBILE ONLY: HISTORY */}
                    <Link
                      to="/history"
                      onClick={() => setOpen(false)}
                      className="sm:hidden flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:bg-bg-surface hover:text-text-primary transition"
                    >
                      <Clock size={14} />
                      History
                    </Link>

                    {/* SETTINGS */}
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:bg-bg-surface hover:text-text-primary transition"
                    >
                      <Settings size={14} />
                      Settings
                    </button>

                    {/* LOGOUT */}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-red-50 transition"
                    >
                      <LogOut size={14} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-ghost text-sm">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="btn-primary text-sm py-2 px-4 shadow-sm"
              >
                Get started free
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* USAGE BAR */}
      {isAuthenticated &&
        client &&
        client.usage_hours_limit > 0 &&
        location.pathname !== "/dashboard" && (
          <div className="bg-bg-surface border-b border-border">
            <div className="max-w-5xl mx-auto px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-text-muted">
                  {parseFloat(client.usage_hours_used).toFixed(1)} /{" "}
                  {client.usage_hours_limit} hrs created
                </span>

                <div className="relative group">
                  <Info size={13} className="text-text-dim cursor-help" />

                  {/* Tooltip */}
                  <div className=" absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 hidden group-hover:block bg-gray-900 text-white text-xs leading-relaxed rounded-lg px-3 py-2 shadow-lg z-[100]">
                    Your monthly allowance is based on video length. Longer
                    videos use more processing time.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${Math.min(
                        (client.usage_hours_used / client.usage_hours_limit) *
                          100,
                        100,
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-text-dim capitalize">
                  {client.plan}
                </span>
              </div>
            </div>
          </div>
        )}

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

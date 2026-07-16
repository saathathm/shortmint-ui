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
  Zap,
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
    { to: "/dashboard", label: "Create", icon: Sparkles, primary: true },
    { to: "/history", label: "History", icon: Clock },
  ];

  const hoursUsed = parseFloat(client?.usage_hours_used || 0);
  const hoursLimit = parseFloat(client?.usage_hours_limit || 1);
  const usagePct = Math.min((hoursUsed / hoursLimit) * 100, 100);
  const usageColor =
    usagePct > 80 ? "bg-error" : usagePct > 60 ? "bg-amber-400" : "bg-primary";

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

                {/* Upgrade button — desktop, non-pro only */}
                {client?.plan !== "pro" && (
                  <Link
                    to="/pricing"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive("/pricing")
                        ? "bg-amber-50 text-amber-600"
                        : "text-amber-600 hover:bg-amber-50"
                    }`}
                  >
                    <Zap size={14} />
                    <span>Upgrade</span>
                  </Link>
                )}
              </div>

              {/* MOBILE CREATE BUTTON */}
              {/* MOBILE NAV */}
              <div className="sm:hidden flex items-center gap-2">
                {/* Create */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
                >
                  <Sparkles size={15} />
                  Create
                </Link>

                {/* History */}
                <Link
                  to="/history"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-text-muted hover:bg-bg-surface hover:text-text-primary transition"
                >
                  <Clock size={17} />
                </Link>
              </div>

              {/* USER DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                {/* AVATAR */}
                <button
                  onClick={() => setOpen(!open)}
                  aria-label="Open account menu"
                  className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold hover:ring-2 hover:ring-primary/20 transition-all"
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
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95">
                    {/* USER INFO */}
                    <div className="px-3 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-text-primary">
                        {client?.name || "User"}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {client?.email}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${usageColor}`}
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-dim whitespace-nowrap">
                          {hoursUsed.toFixed(1)}/{hoursLimit}h
                        </span>
                      </div>
                    </div>

                    {/* UPGRADE — non-pro only */}
                    {client?.plan !== "pro" && (
                      <Link
                        to="/pricing"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 transition font-medium"
                      >
                        <Zap size={14} />
                        Upgrade plan
                        <span className="ml-auto text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-md capitalize">
                          {client?.plan || "trial"}
                        </span>
                      </Link>
                    )}

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

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

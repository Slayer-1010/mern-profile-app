
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: "▦",
    },
    {
      name: "Manage Users",
      path: "/admin/users",
      icon: "♙",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col
        bg-slate-900 text-white transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >

        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-700 px-5">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-slate-400">
                Management System
              </p>
            </div>
          )}

          {collapsed && (
            <span className="text-xl font-bold text-blue-400">A</span>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:block"
            aria-label="Toggle sidebar"
          >
            {collapsed ? "»" : "«"}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-3">
          {!collapsed && (
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Main Menu
            </p>
          )}

          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? item.name : ""}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                } ${collapsed ? "justify-center" : ""}`
              }
            >
              <span className="text-xl">{item.icon}</span>

              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-700 p-4">
          {!collapsed && (
            <p className="text-xs text-slate-400">
              Admin Dashboard
            </p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >

        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm md:px-8">

          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              ☰
            </button>

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Admin Dashboard
              </h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your application
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
              A
            </div>

            <span className="hidden text-sm font-medium text-slate-700 sm:block">
              Administrator
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-5 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;

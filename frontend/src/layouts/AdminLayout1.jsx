
import { NavLink, Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white">
        <div className="border-b border-slate-700 p-6">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-sm text-slate-400">
            Management Dashboard
          </p>
        </div>

        <nav className="space-y-2 p-4">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `block rounded-lg px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            Manage Users
          </NavLink>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white px-8 py-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            Admin Dashboard
          </h2>

          <span className="text-sm font-medium text-slate-600">
            Administrator
          </span>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;
    
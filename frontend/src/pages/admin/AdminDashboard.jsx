import { useEffect, useState } from "react";
import {
  getDashboardStats,
  getRecentUsers,
} from "../../services/adminServices";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  {
    /* Recent users*/
  }
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await getDashboardStats();
        setStats(result.stats);
      } catch (error) {
        setError(error.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        const result = await getRecentUsers();
        setRecentUsers(result.users);
      } catch (error) {
        setRecentError(error.message || "Failed to load recent users.");
      } finally {
        setRecentLoading(false);
      }
    };

    fetchRecentUsers();
  }, []);

  if (loading) {
    return <p className="text-slate-600">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!stats) {
    return <p>No dashboard data available.</p>;
  }

  // const cards = [
  //   {
  //     title: "Total Users",
  //     value: stats.totalUsers,
  //   },
  //   {
  //     title: "Active Users",
  //     value: stats.activeUsers,
  //   },
  //   {
  //     title: "Disabled Users",
  //     value: stats.disabledUsers,
  //   },
  //   {
  //     title: "Total Admins",
  //     value: stats.totalAdmins,
  //   },
  //   {
  //     title: "New Users (Last 30 Days)",
  //     value: stats.newUsers,
  //   },
  // ];

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "All registered users",
      color: "blue",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      description: "Currently active accounts",
      color: "emerald",
    },
    {
      title: "Disabled Users",
      value: stats.disabledUsers,
      description: "Currently disabled accounts",
      color: "rose",
    },
    {
      title: "Total Admins",
      value: stats.totalAdmins,
      description: "Administrator accounts",
      color: "violet",
    },
    {
      title: "New Users",
      value: stats.newUsers,
      description: "Registered in the last 30 days",
      color: "amber",
    },
  ];
  const colorStyles = {
    blue: {
      bar: "bg-blue-500",
      icon: "bg-blue-50",
      dot: "bg-blue-500",
    },
    emerald: {
      bar: "bg-emerald-500",
      icon: "bg-emerald-50",
      dot: "bg-emerald-500",
    },
    rose: {
      bar: "bg-rose-500",
      icon: "bg-rose-50",
      dot: "bg-rose-500",
    },
    violet: {
      bar: "bg-violet-500",
      icon: "bg-violet-50",
      dot: "bg-violet-500",
    },
    amber: {
      bar: "bg-amber-500",
      icon: "bg-amber-50",
      dot: "bg-amber-500",
    },
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Monitor your application and manage your users.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const styles = colorStyles[card.color];

          return (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`absolute left-0 top-0 h-full w-1 ${styles.bar}`}
              />

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {card.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-800">
                    {card.value ?? 0}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.icon}`}
                >
                  <span className={`h-3 w-3 rounded-full ${styles.dot}`} />
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Users */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Recent Users
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Recently registered accounts
            </p>
          </div>

          <Link
            to="/admin/users"
            className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            View All Users →
          </Link>
        </div>

        {recentLoading ? (
          <p className="p-6 text-sm text-slate-500">Loading recent users...</p>
        ) : recentError ? (
          <p role="alert" className="p-6 text-sm text-red-600">
            {recentError}
          </p>
        ) : recentUsers.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No users found.</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentUsers.map((user) => (
                  <tr key={user._id} className="transition hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-800">
                      {user.name}
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-violet-50 text-violet-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          user.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;

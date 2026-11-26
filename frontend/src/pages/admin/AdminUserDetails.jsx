import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserDetails } from "../../services/adminServices";

function AdminUserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUserDetails(id);
        setUser(result.user);
      } catch (error) {
        setError(error.message || "Failed to load user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return <p className="text-slate-500">Loading user details</p>;
  }
  if (error) {
    return (
      <div role="alert" className="rounded-lg bg-red-50 text-red-700">
        {error}
      </div>
    );
  }
  if (!user) {
    return <p className="text-slate-500">User not found</p>;
  }

  const details = [
    ["Full name", user.name],
    ["Email", user.email],
    ["Phone", user.phone || "Not provided"],
    ["Address", user.address || "Not provided"],
    [
      "Date of Birth",
      user.dob ? new Date(user.dob).toLocaleDateString() : "Not provided",
    ],
    ["Role", user.role],
    ["Account Status", user.status],
    [
      "Joined",
      user.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "Not available",
    ],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            User Details
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View account information.
          </p>
        </div>

        <Link
          to="/admin/users"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          ← Back to Users
        </Link>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-row items-center gap-5 border-b border-slate-100 pb-5">
          <div>
            {user.profileImage && (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${user.profileImage}`}
                alt={`${user.name}'s profile`}
                className="h-20 w-20 shrink-0 rounded-full border border-slate-200 object-cover"
              />
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {user.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {label} :
              </p>
              <p className="mt-2 break-words text-sm font-medium text-slate-700">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminUserDetails;

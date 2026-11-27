
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getUserDetails,
  updateUserByAdmin,
} from "../../services/adminServices";
import Input from "../../components/Input";
import Button from "../../components/Button";

function getFormData(user) {
  return {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    dob: user.dob ? new Date(user.dob).toISOString().slice(0, 10) : "",
  };
}

function AdminUserDetails() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await getUserDetails(id);
        setUser(result.user);
        setFormData(getFormData(result.user));
      } catch (error) {
        setError(error.message || "Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setFormData(getFormData(user));
    setError("");
    setSuccess("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(getFormData(user));
    setError("");
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const result = await updateUserByAdmin(id, formData);

      setUser(result.user);
      setFormData(getFormData(result.user));
      setIsEditing(false);
      setSuccess(result.message || "User updated successfully.");
    } catch (error) {
      setError(error.message || "Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-500">Loading user details...</p>;
  }

  if (error && !user) {
    return (
      <div role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  if (!user) {
    return <p className="text-slate-500">User not found.</p>;
  }

  const details = [
    ["Full name", user.name],
    ["Email", user.email],
    ["Phone", user.phone || "Not provided"],
    ["Address", user.address || "Not provided"],
    [
      "Date of Birth",
      user.dob
        ? new Date(user.dob).toLocaleDateString()
        : "Not provided",
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
            View and manage account information.
          </p>
        </div>

        <Link
          to="/admin/users"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          ← Back to Users
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          {success}
        </div>
      )}

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

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Full Name"
                id="name"
                value={formData.name}
                onChange={handleChange}
              />

              <Input
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />

              <Input
                label="Phone"
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />

              <Input
                label="Address"
                id="address"
                value={formData.address}
                onChange={handleChange}
              />

              <Input
                label="Date of Birth"
                id="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-3">
              <Button
                type="submit"
                loading={saving}
                className="w-auto"
              >
                Save Changes
              </Button>

              <Button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="w-auto bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {details.map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    {label}:
                  </p>
                  <p className="mt-2 break-words text-sm font-medium text-slate-700">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <Button
                type="button"
                onClick={handleEdit}
                className="w-auto"
              >
                Edit User
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminUserDetails;


{/* <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
</div> */}
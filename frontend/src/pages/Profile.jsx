import { useEffect, useState } from "react";
import {getMyProfile} from "../services/prrofileServices";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authServices"

function Profile() {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  const [isloggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("")

  const navigate = useNavigate();

  useEffect(() => {
    const fetchedProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getMyProfile();
        setUser(result.user);
      } catch (error) {
        setError(error.message || "Failed to load Prfile");
      } finally {
        setLoading(false);
      }
    };
    fetchedProfile();
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(false);
      setLogoutError("");
      await logoutUser();
      navigate("/login", { replace : true});
    } catch (error) {
      setLogoutError(error.message || "Logout failed.");
    }
    finally{
      setIsLoggingOut(false);
    }
  }
  
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900">
        <p className="text-white">Your Profile is Loading.....</p>
      </main>
    );
  }
  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      </main>
    );
  }
  if (!user) return null;

  const API_ORIGIN = new URL(import.meta.env.VITE_API_BASE_URL).origin;

  const profileImageUrl = user.profileImage
    ? user.profileImage.startsWith("http")
      ? user.profileImage
      : `${API_ORIGIN}${user.profileImage}`
    : "";

    // console.log("Profile image path:", user.profileImage);
    // console.log("Full image URL:", profileImageUrl);
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
      <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-800">
          My Profile
        </h1>
        <div className="mb-6 flex flex-col items-center">
          {profileImageUrl && !imageError ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              onError={()=>{setImageError(true)}}
              className="h-28 w-28 rounded-full object-cover bg-red-700"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-200 text-3xl font-bold text-slate-500">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <h2 className="mt-4 text-xl font-semibold text-slate-800">
            {user.name}
          </h2>

          <p className="text-sm text-slate-500">{user.email}</p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Phone</p>
            <p className="text-slate-800">{user.phone || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Address</p>
            <p className="text-slate-800">{user.address || "Not provided"}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Date of Birth</p>
            <p className="text-slate-800">
              {user.dob
                ? new Date(user.dob).toLocaleDateString()
                : "Not provided"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={ () => navigate("/profile/edit") }
          className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-700"
        >
          Edit Profile
        </button>

        <button 
        type="button"
        onClick={handleLogout}
        disabled={isloggingOut}
        className="mt-3 w-full rounded-lg bg-red-600 px-4 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled-opacity-50"
        >
          {isloggingOut ? "Logging out..." : "Logout"}
        </button>
        
        {logoutError && (
          <p role="alert"className="mt-3 text-center text-sm text-red-600">{logoutError}</p>
        )}

      </section>
    </main>
  );
}
export default Profile;
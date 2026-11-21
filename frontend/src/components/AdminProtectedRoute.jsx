
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getMyProfile } from "../services/prrofileServices";

function AdminProtectedRoute() {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      try {
        const result = await getMyProfile();

        if (isMounted) {
          setIsAdmin(result.user?.role === "admin");
        }
      } catch (error) {
        if (isMounted) {
          setIsAdmin(false);
        }
      }
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAdmin === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Checking admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AdminProtectedRoute;

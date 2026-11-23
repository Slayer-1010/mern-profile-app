const APP_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get admin dashboard statistics
export async function getDashboardStats() {
  const response = await fetch(`${APP_BASE_URL}/admin/dashboard`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || result.msg || "Failed to retrieve dashboard statistics."
    );
  }

  return result;
}


// Get the 5 most recently registered users
export async function getRecentUsers() {
  const response = await fetch(`${APP_BASE_URL}/admin/recent-users`, {
    method: "GET",
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || result.msg || "Failed to retrieve recent users."
    );
  }

  return result;
}


export async function getAllUsers(page = 1, limit = 10) {
  const response = await fetch(
    `${APP_BASE_URL}/admin/users?page=${page}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || result.msg || "Failed to retrieve users."
    );
  }

  return result;
}

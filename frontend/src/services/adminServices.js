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
//normal getuser without filter
// export async function getAllUsers(page = 1, limit = 10) {
//   const response = await fetch(
//     `${APP_BASE_URL}/admin/users?page=${page}&limit=${limit}`,
//     {
//       method: "GET",
//       credentials: "include",
//     }
//   );

//   const result = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       result.message || result.msg || "Failed to retrieve users."
//     );
//   }

//   return result;
// }

export async function getAllUsers(page = 1, limit = 10, filters = {}) {
  const params = new URLSearchParams({
    page : String(page),
    limit : String(limit),
  })
  
  if (filters.search) params.set("search",filters.search)
  if (filters.role) params.set("role",filters.role)
  if (filters.status) params.set("status",filters.status)

  const response = await fetch(
    `${APP_BASE_URL}/admin/users?${params.toString()}`,
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

export async function getUserDetails(userId) {
  const response = await fetch(`${APP_BASE_URL}/admin/users/${userId}`,
    {
      method : "GET",
      credentials : "include"
    }
  );
  const result = await response.json();
  if(!response.ok){
    throw new Error(
      result.message || result.msg || "Failed to retrieve user details."
    );
  }
  return result;
}

export async function updateUserByAdmin(userId, userData){
  const response = await fetch(`${APP_BASE_URL}/admin/users/${userId}`, {
    method : "PATCH",
    credentials : "include",
    headers : {
      "Content-Type" : "application/json"
    },
    body : JSON.stringify(userData),
  })
  const result = await response.json()
  if(!response.ok){
    throw new Error(result.message || result.msg || "Failed to update user")
  }
  return result;
}
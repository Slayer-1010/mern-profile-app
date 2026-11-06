const APP_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get the logged-in user's profile
export async function getMyProfile(){
    const response = await fetch(`${APP_BASE_URL}/profile/me`, {
        method : "GET",
        credentials : "include"
    })
    const result = await response.json();
    if(!response.ok){
        throw new Error( result.message || result.msg || "Failed to Retrieve Profile");       
    }
    return result;
}
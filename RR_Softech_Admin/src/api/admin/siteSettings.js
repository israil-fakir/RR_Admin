import apiClient from "../auth"; // adjust path/name to your axios instance

// Get current site settings
export const fetchSiteSettings = () => {
    return apiClient.get("/site-settings/");
};

// Update site settings
export const updateSiteSettings = (data) => {
    return apiClient.patch("/site-settings/", data);
};

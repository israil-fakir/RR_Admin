import apiClient from "../auth";

// POST /api/services/
export async function createService(payload) {
  const res = await apiClient.post("services/", payload);
  return res.data;
}

// GET /api/services/
export async function fetchServices() {
  const res = await apiClient.get("services/");
  return res.data;
}

export const servicesData = [
  {
    id: 1,
    name: "John Smith",
    serviceTitle: "PPC Campaign",
    date: "Jan 15, 2025",
    status: "Pending",
  },
  {
    id: 2,
    name: "Afsar Uddin",
    serviceTitle: "Website Redesign",
    date: "Feb 02, 2025",
    status: "Accepted",
  },
  {
    id: 3,
    name: "Fatima Akter",
    serviceTitle: "SEO Optimization",
    date: "Mar 10, 2025",
    status: "Accepted",
  },
  {
    id: 4,
    name: "Rahim Ahmed",
    serviceTitle: "Social Media Marketing",
    date: "Apr 22, 2025",
    status: "Finished",
  },
  {
    id: 5,
    name: "Karim Hasan",
    serviceTitle: "Brand Identity Design",
    date: "May 05, 2025",
    status: "Rejected",
  },
];

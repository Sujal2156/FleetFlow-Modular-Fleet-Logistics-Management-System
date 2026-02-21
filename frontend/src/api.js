const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

function getToken() {
  return localStorage.getItem("fleetflow_token") || "";
}

function getAuthHeaders(extraHeaders = {}) {
  const token = getToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message = payload?.message || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export function listResources(endpoint) {
  return request(endpoint);
}

export function createResource(endpoint, body) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function updateResource(endpoint, id, body) {
  return request(`${endpoint}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function deleteResource(endpoint, id) {
  return request(`${endpoint}/${id}`, {
    method: "DELETE",
  });
}

export function login(body) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function register(body) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function me() {
  return request("/auth/me");
}

export function getDashboardSummary(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return request(`/dashboard/summary${query ? `?${query}` : ""}`);
}

export function getAnalyticsSummary() {
  return request("/analytics/summary");
}

export async function exportAnalyticsReport(format) {
  const response = await fetch(`${API_BASE_URL}/analytics/export?format=${encodeURIComponent(format)}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let message = `Export failed with status ${response.status}`;
    try {
      const payload = await response.json();
      message = payload?.message || message;
    } catch {
      message = `Export failed with status ${response.status}`;
    }
    throw new Error(message);
  }

  return response.blob();
}
export function forgotPassword(body) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function resetPassword(body) {
  return request("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getOdometerHistory(vehicleId) {
  return request(`/odometer/vehicle/${vehicleId}`);
}

export function recordOdometerReading(body) {
  return request("/odometer", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function getOdometerStats(vehicleId) {
  return request(`/odometer/stats/${vehicleId}`);
}

export function getDriverSafetyScore(driverId) {
  return request(`/safety-scores/${driverId}`);
}

export function listSafetyScores(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return request(`/safety-scores${query ? `?${query}` : ""}`);
}

export function getSafetyScoreSummary() {
  return request("/safety-scores/summary");
}

export function listAuditLogs(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return request(`/audit${query ? `?${query}` : ""}`);
}

export function getSafetyDashboard() {
  return request("/audit/dashboard");
}

export function createAuditLog(body) {
  return request("/audit", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
const API_URL = getApiUrl();
const API_Users = `${API_URL}/users`;
const API_Auth = `${API_URL}/auth`;
const API_CalendarEvents = `${API_URL}/calendarEvents`;

function getApiUrl() {
  const configuredBase = process.env.REACT_APP_API_URL?.replace(/\/+$/, "");
  return configuredBase ? `${configuredBase}/api` : "/api";
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string"
        ? payload
        : payload?.message || `Request failed (${response.status})`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function getUsers() {
  return requestJson(API_Users, {
    credentials: "include"
  });
}

export async function createUser(data) {
  return requestJson(API_Users, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
}

export async function updateUser(id, data) {
  return requestJson(`${API_Users}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
}

export async function deleteUser(id) {
  return requestJson(`${API_Users}/${id}`, {
    method: "DELETE",
    credentials: "include"
  });
}

export async function login(username, password) {
  return requestJson(`${API_Auth}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include"
  });
}

export async function logout() {
  return requestJson(`${API_Auth}/logout`, {
    method: "POST",
    credentials: "include"
  });
}

export async function getCurrentUser() {
  return requestJson(`${API_Auth}/currentUser`, {
    method: "GET",
    credentials: "include"
  });
}

//Calendar Events APIs
export async function getMyCalendarEvents() {
  return requestJson(API_CalendarEvents, {
    method: "GET",
    credentials: "include"
  });
}

export async function getMemberCalendarEvents() {
  return requestJson(`${API_CalendarEvents}/member`, {
    method: "GET",
    credentials: "include"
  });
}

export async function createCalendarEvent(data) {
  return requestJson(API_CalendarEvents, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const request = async (url, method , body, token = null) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || data.detail || "An unexpected error occurred.");
      error.status = data.status;
      error.statusCode = response.status;
      
      throw error;
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }

};

export const apiService = {
  get: (url, token = null) => request(url, "GET", null, token),
  post: (url, body, token = null) => request(url, "POST", body, token),
  put: (url, body, token = null) => request(url, "PUT", body, token),
  delete: (url, token = null) => request(url, "DELETE", null, token),
};

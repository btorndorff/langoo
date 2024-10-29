const API_BASE_URL = "http://127.0.0.1:5000/api";

export const fetchActivities = async (userId: string) => {
  const response = await fetch(`${API_BASE_URL}/activities?userId=${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }
  return response.json();
};

export const createActivity = async (activity: {
  title: string;
  language: string;
  category: string;
  userId: string;
  entry: string;
  date: Date;
}) => {
  const response = await fetch(`${API_BASE_URL}/activities`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });
  if (!response.ok) {
    throw new Error("Failed to create activity");
  }
  return response.json();
};

export const updateActivity = async (
  activityId: string,
  activity: {
    title: string;
    language: string;
    category: string;
    userId: string;
    entry: string;
    date: Date;
  }
) => {
  const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(activity),
  });
  if (!response.ok) {
    throw new Error("Failed to update activity");
  }
  return response.json();
};

export const deleteActivity = async (activityId: string) => {
  const response = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete activity");
  }
  return response.json();
};

export const fetchCurrentStreak = async (userId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/streaks/current?userId=${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch streak");
  }
  return response.json();
};

export const generateSuggestions = async (data: {
  title: string;
  language: string;
  category: string;
  entry: string;
  userId: string;
  date: string;
  activityId?: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/suggestions/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to generate suggestions");
  }

  const responseData = await response.json();
  return {
    suggestions: responseData.suggestions || [],
  };
};

export const fetchSuggestionsForActivity = async (activityId: string) => {
  const response = await fetch(`${API_BASE_URL}/suggestions/${activityId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch suggestions");
  }
  const data = await response.json();
  return {
    suggestions: data.suggestions || [],
  };
};

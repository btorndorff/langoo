import { useState, useEffect } from "react";
import { Activity } from "@/types/activity";
import { fetchActivities } from "@/services/api";

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await fetchActivities("borff");
      setActivities(data);
    } catch (err) {
      setError("Failed to load activities");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  const activeDates = activities.reduce(
    (acc, activity) => ({
      ...acc,
      [new Date(activity.date).toDateString()]: true,
    }),
    {} as Record<string, boolean>
  );

  return { activities, loading, error, activeDates, refetch: loadActivities };
}

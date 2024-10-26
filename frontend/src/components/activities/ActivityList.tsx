import ActivityCard from "@/components/activities/ActivityCard";
import { Activity } from "@/types/activity";
import { Loader2 } from "lucide-react";

export default function ActivityList({
  activities,
  selectedDate,
  loading = false,
  error = null,
  onActivityUpdate,
}: {
  activities: Activity[];
  selectedDate: Date;
  loading?: boolean;
  error?: string | null;
  onActivityUpdate: () => void;
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">Error: {error}</div>;
  }

  const getActivitiesForDate = (date: Date) => {
    return activities.filter((activity) => {
      const activityDate = new Date(activity.date);
      return activityDate.toDateString() === date.toDateString();
    });
  };

  const activitiesForDate = selectedDate
    ? getActivitiesForDate(selectedDate)
    : [];

  return (
    <div className="relative pt-2 px-2">
      <div className="flex flex-col w-full space-y-4 max-h-[500px] overflow-y-auto">
        {activitiesForDate.map((activity) => (
          <ActivityCard
            key={activity._id}
            activity={activity}
            selectedDate={selectedDate}
            onActivityUpdate={onActivityUpdate}
          />
        ))}
        {activitiesForDate.length === 0 && (
          <p className="text-gray-500 text-center mt-8">
            No activities for this date 😭
          </p>
        )}
      </div>
    </div>
  );
}

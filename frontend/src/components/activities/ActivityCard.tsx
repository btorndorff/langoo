import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "@/types/activity";
import ActivityModal from "@/components/activities/ActivityModal";
import { Badge } from "@/components/ui/badge";

export default function ActivityCard({
  activity,
  selectedDate,
  onActivityUpdate,
}: {
  activity: Activity;
  selectedDate: Date;
  onActivityUpdate: () => void;
}) {
  return (
    <ActivityModal
      activity={activity}
      selectedDate={selectedDate}
      onActivityCreateOrUpdate={onActivityUpdate}
    >
      <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge>{activity.category}</Badge>
            <h3 className="font-semibold">{activity.title}</h3>
          </div>
          <p className="text-gray-600 line-clamp-2">
            {activity.entry.includes("\n")
              ? `${activity.entry.split("\n")[0]}`
              : activity.entry.length > 100
              ? `${activity.entry.slice(0, 100)}`
              : activity.entry}
          </p>
        </CardContent>
      </Card>
    </ActivityModal>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "@/types/activity";
import ActivityModal from "@/components/activities/ActivityModal/ActivityModal";
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
      <Card className="cursor-pointer hover:bg-gray-50 transition-colors relative">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">{activity.title}</h3>
          <p className="text-gray-600 line-clamp-2">
            {activity.entry.includes("\n")
              ? `${activity.entry.split("\n")[0]}`
              : activity.entry.length > 100
              ? `${activity.entry.slice(0, 100)}`
              : activity.entry}
          </p>
          <Badge className="absolute top-1/2 right-4 transform -translate-y-1/2">
            {activity.category}
          </Badge>
        </CardContent>
      </Card>
    </ActivityModal>
  );
}

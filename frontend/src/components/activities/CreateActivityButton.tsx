"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ActivityModal from "@/components/activities/ActivityModal";

export default function CreateActivityButton({
  userId,
  selectedDate,
  onActivityCreated,
}: {
  userId: string;
  selectedDate: Date;
  onActivityCreated: () => void;
}) {
  return (
    <ActivityModal
      selectedDate={selectedDate}
      onActivityCreateOrUpdate={onActivityCreated}
    >
      <Button size="icon" variant="ghost" aria-label="Create new activity">
        <PlusCircle className="h-8 w-8" />
      </Button>
    </ActivityModal>
  );
}

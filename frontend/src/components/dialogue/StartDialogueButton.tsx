"use client";

import { Button } from "@/components/ui/button";
import { AudioLines } from "lucide-react";
import DialogueModal from "@/components/dialogue/DialogueModal";

export default function CreateActivityButton() {
  return (
    <DialogueModal>
      <Button size="icon" variant="ghost" aria-label="Create new activity">
        <AudioLines className="h-8 w-8" />
      </Button>
    </DialogueModal>
  );
}

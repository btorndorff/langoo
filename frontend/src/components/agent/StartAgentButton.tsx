"use client";

import { Button } from "@/components/ui/button";
import { AudioLines } from "lucide-react";
import AgentModal from "@/components/agent/AgentModal/AgentModal";

export default function CreateActivityButton() {
  return (
    <AgentModal>
      <Button size="icon" variant="ghost" aria-label="Create new activity">
        <AudioLines className="h-8 w-8" />
      </Button>
    </AgentModal>
  );
}

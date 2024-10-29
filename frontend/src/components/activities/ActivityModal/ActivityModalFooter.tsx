"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

export default function ActivityModalFooter({
  activity,
  isDeleting,
  isSaving,
  onDelete,
  onSave,
}: {
  activity?: { _id: string };
  isDeleting: boolean;
  isSaving: boolean;
  onDelete: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex justify-end items-center space-x-2 p-4 border-t">
      <div className="flex space-x-2">
        {activity && (
          <Button
            type="button"
            variant="ghost"
            onClick={onDelete}
            disabled={isDeleting || isSaving}
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </div>
            )}
          </Button>
        )}
        <Button
          type="button"
          onClick={onSave}
          disabled={isDeleting || isSaving}
          className="min-w-[80px]"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving</span>
            </div>
          ) : activity ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </div>
  );
}

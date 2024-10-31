"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import AudioModal from "./AudioModal";

export default function ActivityModalFooter({
  activity,
  isDeleting,
  isSaving,
  onDelete,
  onSave,
  onAudioSelect,
}: {
  activity?: { _id: string };
  isDeleting: boolean;
  isSaving: boolean;
  onDelete: () => void;
  onSave: () => void;
  onAudioSelect: (file: File) => void;
}) {
  const [showAudioModal, setShowAudioModal] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center space-x-2 p-4 border-t">
        <Button
          variant="outline"
          onClick={() => setShowAudioModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Audio</span>
        </Button>

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

      <AudioModal
        isOpen={showAudioModal}
        onClose={() => setShowAudioModal(false)}
        onAudioSelect={onAudioSelect}
      />
    </>
  );
}

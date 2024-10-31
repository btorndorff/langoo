"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Activity, Category } from "@/types/activity";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  createActivity,
  updateActivity,
  deleteActivity,
  deleteActivityAudio,
} from "@/services/api";
import ActivityModalHeader from "./ActivityModalHeader";
import ActivityModalContent from "./ActivityModalContent";
import ActivityModalSuggestions from "./ActivityModalSuggestions";
import ActivityModalFooter from "./ActivityModalFooter";
import ActivityAudioPlayer from "./ActivityAudioPlayer";

export default function ActivityModal({
  activity,
  selectedDate,
  children,
  onActivityCreateOrUpdate,
}: {
  activity?: Activity;
  selectedDate: Date;
  children: React.ReactNode;
  onActivityCreateOrUpdate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Writing");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [audio, setAudio] = useState<File | string | null>(
    activity?.audioUrl ?? null
  );

  useEffect(() => {
    if (activity) {
      setContent(activity.entry || "");
      setTitle(activity.title);
      setCategory(activity.category as Category);
    } else {
      setContent("");
      setTitle("");
      setCategory("Writing");
      setIsEditingTitle(true);
    }
  }, [activity, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (!activity) {
      setContent("");
      setTitle("");
      setCategory("Writing");
      setAudio(null);
    }
    setIsSaving(false);
    setShowSuggestions(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      handleClose();
    }
  };

  const handleSave = async () => {
    if (title.trim() === "" || content.trim() === "") {
      alert("Title and content cannot be empty");
      return;
    }

    try {
      setIsSaving(true);
      const activityData = {
        title: title.trim(),
        language: "Vietnamese",
        category: category,
        userId: "borff",
        entry: content.trim(),
        date: selectedDate,
        audioFile: audio instanceof File ? audio : undefined,
      };

      if (activity) {
        await updateActivity(activity._id, activityData);
      } else {
        await createActivity(activityData);
      }

      onActivityCreateOrUpdate();
      handleClose();
    } catch (error) {
      console.error("Failed to save activity:", error);
      alert("Failed to save activity. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activity) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this activity? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteActivity(activity._id);
      onActivityCreateOrUpdate();
      handleClose();
    } catch (error) {
      console.error("Failed to delete activity:", error);
      alert("Failed to delete activity. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAudioSelect = (file: File) => {
    setAudio(file);
  };

  const handleAudioRemove = () => {
    setAudio(null);
    if (activity?.audioUrl) {
      deleteActivityAudio(activity._id);
    }
  };

  const modalDimensions = () => {
    let tailwindClass = "p-0 flex flex-col";

    tailwindClass += " sm:h-[80vh]";

    if (showSuggestions) {
      tailwindClass += " sm:max-w-[75vw]";
    } else {
      tailwindClass += " sm:max-w-[55vw]";
    }

    return tailwindClass;
  };

  console.log(audio);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <VisuallyHidden.Root>
        <DialogTitle>Activity</DialogTitle>
      </VisuallyHidden.Root>
      <DialogContent className={modalDimensions()}>
        <div className="flex-grow flex relative">
          <div className="flex-grow flex flex-col p-8">
            <ActivityModalHeader
              title={title}
              category={category}
              isEditingTitle={isEditingTitle}
              isEditingCategory={isEditingCategory}
              setIsEditingCategory={setIsEditingCategory}
              onTitleChange={(e) => setTitle(e.target.value)}
              onTitleClick={() => setIsEditingTitle(true)}
              onCategorySelect={(cat) => {
                setCategory(cat);
                setIsEditingCategory(false);
              }}
              onCategoryClick={() => setIsEditingCategory(true)}
            />
            {audio && (
              <ActivityAudioPlayer
                audioUrl={
                  audio instanceof File ? URL.createObjectURL(audio) : audio
                }
                onRemove={handleAudioRemove}
              />
            )}
            <div className="flex flex-grow">
              <ActivityModalContent
                content={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <ActivityModalSuggestions
                isOpen={showSuggestions}
                handleClose={() => setShowSuggestions(false)}
                handleOpen={() => setShowSuggestions(true)}
                activityData={{
                  title,
                  language: "Vietnamese",
                  category,
                  entry: content,
                  userId: "borff",
                  date: selectedDate.toISOString(),
                  activityId: activity?._id,
                }}
              />
            </div>
          </div>
        </div>
        <ActivityModalFooter
          activity={activity}
          isDeleting={isDeleting}
          isSaving={isSaving}
          onDelete={handleDelete}
          onSave={handleSave}
          onAudioSelect={handleAudioSelect}
        />
      </DialogContent>
    </Dialog>
  );
}

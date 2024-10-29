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
import { createActivity, updateActivity, deleteActivity } from "@/services/api";
import ActivityModalHeader from "./ActivityModalHeader";
import ActivityModalContent from "./ActivityModalContent";
import ActivityModalSuggestions from "./ActivityModalSuggestions";
import ActivityModalFooter from "./ActivityModalFooter";

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
    }
    setIsSaving(false);
    setShowSuggestions(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <VisuallyHidden.Root>
        <DialogTitle>Activity</DialogTitle>
      </VisuallyHidden.Root>
      <DialogContent
        className={`sm:h-[75vh] p-0 flex flex-col ${
          showSuggestions ? "sm:max-w-[75vw]" : "sm:max-w-[50vw] "
        }`}
      >
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
        />
      </DialogContent>
    </Dialog>
  );
}

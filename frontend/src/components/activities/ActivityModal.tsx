"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Activity, Category, ActivityCategories } from "@/types/activity";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { createActivity, updateActivity, deleteActivity } from "@/services/api";
import { Loader2, Trash2 } from "lucide-react";

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
  }, [activity, isOpen]); // Also reset when modal opens/closes

  const handleTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleCategoryClick = () => {
    setIsEditingCategory(true);
  };

  const handleCategorySelect = (selectedCategory: Category) => {
    setCategory(selectedCategory);
    setIsEditingCategory(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset form
    if (!activity) {
      setContent("");
      setTitle("");
      setCategory("Writing");
    }
    setIsSaving(false);
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
        language: "English",
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
        <DialogTitle>{activity ? "Edit" : "Create"} Activity</DialogTitle>
      </VisuallyHidden.Root>
      <DialogContent className="sm:max-w-[50vw] sm:h-[75vh] p-0 flex flex-col">
        <div className="flex-grow flex flex-col p-8 space-y-4">
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <Popover
                open={isEditingCategory}
                onOpenChange={setIsEditingCategory}
              >
                <PopoverTrigger asChild>
                  <Badge
                    className="mr-2 cursor-pointer hover:bg-primary/80"
                    onClick={handleCategoryClick}
                  >
                    {category}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="flex flex-col gap-2">
                    {ActivityCategories.map((cat) => (
                      <Badge
                        key={cat}
                        className="cursor-pointer hover:bg-primary/80"
                        onClick={() => handleCategorySelect(cat)}
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  className="text-xl font-semibold bg-transparent border-none focus:outline-none flex-grow mr-2"
                  autoFocus
                  placeholder="Title"
                />
              ) : (
                <h2
                  className="text-xl cursor-text font-semibold"
                  onClick={handleTitleClick}
                >
                  {title}
                </h2>
              )}
            </div>
          </div>
          <Textarea
            placeholder="Write your activity notes here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-grow resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-lg"
            noShadow
          />
        </div>
        <div className="flex justify-end space-x-2 p-4 border-t">
          {activity && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
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
            onClick={handleSave}
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
      </DialogContent>
    </Dialog>
  );
}

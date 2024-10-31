"use client";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Category, ActivityCategories } from "@/types/activity";

export default function ActivityModalHeader({
  title,
  category,
  isEditingTitle,
  isEditingCategory,
  setIsEditingCategory,
  onTitleChange,
  onTitleClick,
  onCategorySelect,
  onCategoryClick,
}: {
  title: string;
  category: Category;
  isEditingTitle: boolean;
  isEditingCategory: boolean;
  setIsEditingCategory: (value: boolean) => void;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTitleClick: () => void;
  onCategorySelect: (category: Category) => void;
  onCategoryClick: () => void;
}) {
  return (
    <div className="flex items-center mb-4 w-full">
      <div className="flex items-center w-full">
        <Popover open={isEditingCategory} onOpenChange={setIsEditingCategory}>
          <PopoverTrigger asChild>
            <Badge
              className="mr-2 cursor-pointer hover:bg-primary/80"
              onClick={onCategoryClick}
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
                  onClick={() => onCategorySelect(cat)}
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
            onChange={onTitleChange}
            className="text-xl font-semibold bg-transparent border-none focus:outline-none flex-grow mr-2 w-full"
            autoFocus
            placeholder="Title"
          />
        ) : (
          <h2
            className="text-xl cursor-text font-semibold"
            onClick={onTitleClick}
          >
            {title}
          </h2>
        )}
      </div>
    </div>
  );
}

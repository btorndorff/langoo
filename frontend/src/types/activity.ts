export const ActivityCategories = [
  "Writing",
  "Journal",
  "Reflection",
  "Reading",
  "Listening",
  "Speaking",
  "Lesson",
] as const;

export type Category = (typeof ActivityCategories)[number];

export type Activity = {
  _id: string;
  title: string;
  language: string;
  category: string;
  userId: string;
  entry: string;
  date: Date;
  audioUrl?: string;
  createdAt: string;
  updatedAt: string;
};

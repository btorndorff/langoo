export type Category =
  | "Writing"
  | "Journal"
  | "Reflection"
  | "Reading"
  | "Listening"
  | "Speaking";

export const ActivityCategories: Category[] = [
  "Writing",
  "Journal",
  "Reflection",
  "Reading",
  "Listening",
  "Speaking",
];

export type Activity = {
  _id: string;
  title: string;
  language: string;
  category: string;
  userId: string;
  entry: string;
  date: Date;
  createdAt: string;
  updatedAt: string;
};

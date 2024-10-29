"use client";

import { Textarea } from "@/components/ui/textarea";

export default function ActivityModalContent({
  content,
  onChange,
}: {
  content: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <Textarea
      placeholder="Write your activity notes here..."
      value={content}
      onChange={onChange}
      className="flex-grow resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-lg"
      noShadow
    />
  );
}

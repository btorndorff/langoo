import { Calendar } from "@/components/ui/calendar";

export default function ActivityCalendar({
  date,
  setDate,
  activeDates,
}: {
  date: Date;
  setDate: (date: Date) => void;
  activeDates: Record<string, boolean>;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasActivityOnDate = (d: Date) => {
    const isSelectedDate = d.toDateString() === date?.toDateString();
    return !isSelectedDate && activeDates[d.toDateString()];
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(newDate) => newDate && setDate(newDate)}
      className="rounded-md border w-full bg-white"
      modifiers={{
        hasActivity: hasActivityOnDate,
        inactive: (date) => date > today,
      }}
      modifiersStyles={{
        hasActivity: {
          fontWeight: "bold",
          backgroundColor: "rgba(255, 0, 0, 0.25)",
          color: "black",
        },
        inactive: {
          opacity: 0.5,
          pointerEvents: "none",
        },
      }}
      disabled={(date) => date > today}
    />
  );
}

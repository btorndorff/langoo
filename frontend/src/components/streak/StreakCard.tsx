import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchCurrentStreak } from "@/services/api";

export default function StreakCard({ userId }: { userId: string }) {
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const data = await fetchCurrentStreak(userId);
        setStreak(data.streak);
      } catch (error) {
        console.error("Failed to load streak:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStreak();
  }, [userId]);

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex flex-col items-start">
          <h2 className="text-4xl font-bold">Streak</h2>
          <p className="text-sm text-gray-500">Keep it up!</p>
        </div>
        <div className="text-right">
          {loading ? (
            <p className="text-3xl font-bold">Loading...</p>
          ) : (
            <p className="text-3xl font-bold">
              {streak} day{streak !== 1 ? "s" : ""} 🔥
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

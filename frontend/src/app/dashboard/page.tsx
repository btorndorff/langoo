"use client";

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import ActivityCalendar from "@/components/activities/ActivityCalendar";
import ActivityList from "@/components/activities/ActivityList";
import { useActivities } from "@/hooks/useActivities";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import StreakCard from "@/components/streak/StreakCard";
import CreateActivityButton from "@/components/activities/CreateActivityButton";
import StartAgentButton from "@/components/agent/StartAgentButton";

export default function Dashboard() {
  const [date, setDate] = useState<Date>(new Date());
  const { activities, loading, error, activeDates, refetch } = useActivities();

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col gap-4 w-1/3">
            <div>
              <ActivityCalendar
                date={date}
                setDate={setDate}
                activeDates={activeDates}
              />
            </div>

            <StreakCard userId="borff" />
          </div>

          <Card className="md:w-2/3">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Activities for {date?.toDateString()}
                <div className="flex items-center gap-2">
                  <StartAgentButton />
                  <CreateActivityButton
                    userId="borff"
                    selectedDate={date}
                    onActivityCreated={refetch}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityList
                activities={activities}
                selectedDate={date}
                loading={loading}
                error={error}
                onActivityUpdate={refetch}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

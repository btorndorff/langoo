"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  Lightbulb,
  LightbulbOff,
  Leaf,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Suggestion } from "@/types/suggestion";
import {
  fetchSuggestionsForActivity,
  generateSuggestions,
} from "@/services/api";

export default function ActivityModalSuggestions({
  handleClose,
  handleOpen,
  isOpen,
  activityData,
}: {
  handleClose: () => void;
  handleOpen: () => void;
  isOpen: boolean;
  activityData: {
    title: string;
    language: string;
    category: string;
    entry: string;
    userId: string;
    date: string;
    activityId?: string;
  };
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    try {
      if (activityData.activityId) {
        setLoading(true);
        const response = await fetchSuggestionsForActivity(
          activityData.activityId
        );
        // Check if response.suggestions exists, if not use empty array
        setSuggestions(response.suggestions || []);
      }
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [activityData.activityId]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      const response = await generateSuggestions(activityData);
      setSuggestions(response.suggestions);
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
      alert("Failed to generate suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpen}
        className="absolute top-18 right-2"
      >
        <Lightbulb className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="w-3/5 px-4">
      <div className="flex justify-end items-center mb-4">
        <Button
          variant="outline"
          onClick={handleGenerate}
          className="flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : suggestions && suggestions.length > 0 ? (
            <RefreshCw className="h-4 w-4 mr-1" />
          ) : (
            <Leaf className="h-4 w-4 mr-1" />
          )}
          {loading
            ? "Generating"
            : suggestions && suggestions.length > 0
            ? "Regenerate"
            : "Generate"}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-18 right-2"
        >
          <LightbulbOff className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4 overflow-y-auto max-h-[40vh]">
        {loading || (suggestions && suggestions.length > 0) ? (
          suggestions.map((suggestion, index) => (
            <Card key={index}>
              <CardContent className="p-3">
                <p className="italic">"{suggestion.textPart}"</p>
                <p className="text-gray-500">{suggestion.suggestion}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-3">
              <p className="text-center text-gray-500">
                No suggestions yet. Click generate to get started!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

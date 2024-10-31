"use client";

import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserSettings } from "@/context/UserSettingsContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export default function DashboardHeader() {
  const { language, setLanguage } = useUserSettings();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src="/logo.svg"
            alt="Language Learning App Logo"
            width={40}
            height={32}
            className="mr-4 invert"
          />
          <h1 className="text-2xl font-bold text-gray-900">Langoo</h1>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage("Japanese")}>
              Japanese
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("Vietnamese")}>
              Vietnamese
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

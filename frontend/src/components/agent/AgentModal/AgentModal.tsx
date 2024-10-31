"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import "@livekit/components-styles";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  AgentState,
} from "@livekit/components-react";
import { NoAgentNotification } from "@/components/NoAgentNotification";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleVoiceAssistant } from "./SimpleVoiceAssistant";
import { ControlBar } from "./ControlBar";
import { MediaDeviceFailure } from "livekit-client";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useUserSettings } from "@/context/UserSettingsContext";

export type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

export default function AgentModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, username } = useUserSettings();
  const [connectionDetails, setConnectionDetails] = useState<
    ConnectionDetails | undefined
  >(undefined);
  const [agentState, setAgentState] = useState<AgentState>("disconnected");
  const [userInstructions, setUserInstructions] = useState("");

  const onConnectButtonClicked = useCallback(async () => {
    try {
      const url = new URL("/api/connection-details", window.location.origin);
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          username,
          accent: "Tokyo",
          user_instructions:
            userInstructions || "I want to practice free talk.",
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch connection details");

      const data = await response.json();
      setConnectionDetails(data);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to voice assistant");
    }
  }, [userInstructions, language, username]);

  function onDeviceFailure(error?: MediaDeviceFailure) {
    console.error(error);
    alert(
      "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
    );
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setConnectionDetails(undefined);
          setAgentState("disconnected");
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <VisuallyHidden.Root>
        <DialogTitle>Agent</DialogTitle>
      </VisuallyHidden.Root>
      <DialogContent className="sm:max-w-[425px]">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg">Practice Speaking</CardTitle>
        </CardHeader>

        <LiveKitRoom
          token={connectionDetails?.participantToken}
          serverUrl={connectionDetails?.serverUrl}
          connect={connectionDetails !== undefined}
          audio={true}
          video={false}
          onMediaDeviceFailure={onDeviceFailure}
          onDisconnected={() => {
            setConnectionDetails(undefined);
          }}
          className="flex flex-col items-center"
        >
          <SimpleVoiceAssistant onStateChange={setAgentState} />
          <ControlBar
            onConnectButtonClicked={onConnectButtonClicked}
            agentState={agentState}
            userInstructions={userInstructions}
            setUserInstructions={setUserInstructions}
          />
          <RoomAudioRenderer />
          <NoAgentNotification state={agentState} />
        </LiveKitRoom>
      </DialogContent>
    </Dialog>
  );
}

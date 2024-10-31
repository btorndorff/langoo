import { AnimatePresence, motion } from "framer-motion";
import {
  VoiceAssistantControlBar,
  AgentState,
  DisconnectButton,
} from "@livekit/components-react";
import { Button } from "@/components/ui/button";
import { PhoneOff, Speech } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ControlBar({
  onConnectButtonClicked,
  agentState,
  userInstructions,
  setUserInstructions,
}: {
  onConnectButtonClicked: () => void;
  agentState: AgentState;
  userInstructions: string;
  setUserInstructions: (value: string) => void;
}) {
  return (
    <div className="w-full flex justify-center items-center">
      <AnimatePresence mode="wait">
        {agentState === "disconnected" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-6 justify-center items-center w-full"
          >
            <div className="w-full flex flex-col gap-2">
              <Label
                htmlFor="instructions"
                className="text-sm ml-2 text-muted-foreground"
              >
                What do you want to talk about?
              </Label>
              <Textarea
                id="instructions"
                value={userInstructions}
                onChange={(e) => setUserInstructions(e.target.value)}
                placeholder="Enter conversation topic or scenario"
                className="flex-1 min-h-[100px] px-4 py-2 rounded-md border border-input bg-background resize-none w-full"
              />
            </div>
            <Button
              variant="default"
              onClick={onConnectButtonClicked}
              className="h-10 px-4 py-2 inline-flex items-center justify-center rounded-md font-medium transition-colors"
            >
              <Speech className="mr-2 h-4 w-4" />
              Start conversation!
            </Button>
          </motion.div>
        )}
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 p-2 rounded-lg bg-background border w-[75%]"
          >
            <VoiceAssistantControlBar
              controls={{ leave: false }}
              className=""
            />
            <DisconnectButton className="p-2 rounded-full hover:bg-destructive/10 transition-colors">
              <PhoneOff className="h-5 w-5 text-destructive" />
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

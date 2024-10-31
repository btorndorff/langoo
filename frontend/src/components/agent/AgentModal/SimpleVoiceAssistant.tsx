import { useEffect } from "react";
import {
  useVoiceAssistant,
  BarVisualizer,
  AgentState,
} from "@livekit/components-react";
import { Card, CardContent } from "@/components/ui/card";

export function SimpleVoiceAssistant({
  onStateChange,
}: {
  onStateChange: (state: AgentState) => void;
}) {
  const { state, audioTrack } = useVoiceAssistant();

  useEffect(() => {
    onStateChange(state);
  }, [onStateChange, state]);

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="h-[200px] max-w-[90vw] mx-auto p-0">
        <BarVisualizer
          state={state}
          barCount={5}
          trackRef={audioTrack}
          className="agent-visualizer"
          options={{ minHeight: 24 }}
        />
      </CardContent>
    </Card>
  );
}

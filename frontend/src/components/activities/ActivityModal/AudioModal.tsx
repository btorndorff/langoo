"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Square, Upload } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function AudioModal({
  isOpen,
  onClose,
  onAudioSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAudioSelect: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onAudioSelect(file);
      onClose();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioFile = new File(
          [audioBlob],
          `recorded-audio-${Date.now()}.webm`,
          {
            type: "audio/webm",
          }
        );
        onAudioSelect(audioFile);
        onClose();

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access microphone. Please check your permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Audio</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 w-full"
            disabled={isRecording}
          >
            <Upload className="h-4 w-4" />
            <span>Upload Audio</span>
          </Button>
          <div className="flex flex-col gap-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              className="flex items-center gap-2 w-full"
              onClick={handleRecordClick}
            >
              {isRecording ? (
                <>
                  <Square className="h-4 w-4" />
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  <span>Record Audio</span>
                </>
              )}
            </Button>
            {isRecording && (
              <div className="text-center text-sm text-muted-foreground">
                Recording: {formatTime(recordingTime)}
              </div>
            )}
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="audio/*"
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  );
}

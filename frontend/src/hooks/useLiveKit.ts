import { useState, useEffect } from "react";

export function useLiveKit(roomName: string, username: string) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/livekit/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            room: roomName,
            username: username,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await response.json();
        setToken(data.token);
        setServerUrl(data.ws_url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to connect");
      }
    };

    if (roomName && username) {
      fetchToken();
    }
  }, [roomName, username]);

  return { token, serverUrl, error };
}

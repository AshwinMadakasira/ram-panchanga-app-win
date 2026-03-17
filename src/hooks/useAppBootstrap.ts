import { useEffect, useState } from "react";
import { useFonts } from "expo-font";

import { ensureDatabaseReady } from "@/db/bootstrap";

export const useAppBootstrap = () => {
  const [fontsLoaded, fontsError] = useFonts({
    "Neuton-Bold": require("../../assets/fonts/Neuton-Bold.ttf"),
    "Neuton-Regular": require("../../assets/fonts/Neuton-Regular.ttf")
  });
  const [isReady, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    ensureDatabaseReady()
      .then(() => setReady(true))
      .catch((bootError) => {
        setError(bootError instanceof Error ? bootError : new Error("Database bootstrap failed"));
      });
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsError) {
      setError(fontsError);
    }
  }, [fontsError]);

  return { isReady, error };
};

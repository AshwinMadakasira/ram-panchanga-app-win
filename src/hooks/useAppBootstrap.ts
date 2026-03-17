/*
 * Hook teaching note:
 * Custom hooks package reusable stateful logic. This hook answers one startup question:
 * "Is the app ready to render real screens yet?"
 *
 * In this app, startup means:
 * - custom fonts are loaded
 * - the local database exists and is seeded
 */
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";

// The bootstrap hook delegates database setup to the DB layer instead of mixing SQL into React code.
import { ensureDatabaseReady } from "@/db/bootstrap";

/** Load startup resources and report whether the app can safely render its main routes yet. */
export const useAppBootstrap = () => {
  const [fontsLoaded, fontsError] = useFonts({
    "Neuton-Bold": require("../../assets/fonts/Neuton-Bold.ttf"),
    "Neuton-Regular": require("../../assets/fonts/Neuton-Regular.ttf"),
    "NotoSerifKannada-Bold": require("../../assets/fonts/NotoSerifKannada-Bold.ttf"),
    "NotoSerifKannada-Regular": require("../../assets/fonts/NotoSerifKannada-Regular.ttf")
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

import { useEffect, useState } from "react";

import { ensureDatabaseReady } from "@/db/bootstrap";

export const useAppBootstrap = () => {
  const [isReady, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    ensureDatabaseReady()
      .then(() => setReady(true))
      .catch((bootError) => {
        setError(bootError instanceof Error ? bootError : new Error("Database bootstrap failed"));
      });
  }, []);

  return { isReady, error };
};

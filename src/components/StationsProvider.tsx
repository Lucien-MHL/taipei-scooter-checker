"use client";

import { useEffect } from "react";
import { useStations } from "@/stores/useStations";
import { Metadata, Station } from "@/types/station";

type StationsData = { metadata: Metadata; stations: Station[] };

export const StationsProvider = ({ children }: React.PropsWithChildren) => {
  const setData = useStations((state) => state.setData);
  const setLoading = useStations((state) => state.setLoading);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch("/data/stations.json");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data: StationsData = await response.json();
        setData(data);
      } catch (error: Error | any) {
        setLoading(false, {
          isFetchFail: true,
          message: error.message || "未知錯誤",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return <>{children}</>;
};

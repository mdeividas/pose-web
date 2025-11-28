import { create } from "zustand";
import type { PoseLandMarkerState } from "./types.ts";
import { immer } from "zustand/middleware/immer";

export const usePoseLandMarkerStore = create<PoseLandMarkerState>()(
  immer((set) => ({
    isReady: false,

    hasError: false,

    setIsReady: (flag: boolean) =>
      set((state) => {
        state.isReady = flag;
      }),

    setHasError: (flag: boolean) =>
      set((state) => {
        state.hasError = flag;
      }),
  })),
);

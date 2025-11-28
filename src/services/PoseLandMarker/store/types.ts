export interface PoseLandMarkerState {
  isReady: boolean;
  hasError: boolean;

  setIsReady(flag: boolean): void;

  setHasError(flag: boolean): void;
}

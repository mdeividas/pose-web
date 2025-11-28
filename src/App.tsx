import { usePoseLandMarkerStore } from "./services/PoseLandMarkerState/pose/store.ts";

function App() {
  const isReady = usePoseLandMarkerStore((state) => state.isReady);

  return (
    <>
      <button
        onClick={() => {
          usePoseLandMarkerStore.getState().setIsReady(!isReady);
        }}
      >
        Set
      </button>
      {isReady ? "Ready" : "Not Ready"}
    </>
  );
}

export default App;

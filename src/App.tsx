import React from 'react';
import {
  poseLandMarker,
  usePoseLandMarkerStore,
} from './services/PoseLandMarker';

function App() {
  const mounted = React.useRef(false);
  const isReady = usePoseLandMarkerStore((state) => state.isReady);

  React.useEffect(() => {
    if (mounted.current) {
      return;
    }

    mounted.current = true;

    (async () => {
      poseLandMarker.init();
    })();
  }, []);

  return (
    <>
      <button
        onClick={() => {
          usePoseLandMarkerStore.getState().setIsReady(!isReady);
        }}
      >
        Set
      </button>
      {isReady ? 'Ready' : 'Not Ready'}
    </>
  );
}

export default App;

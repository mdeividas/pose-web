import React from 'react';
import {
  poseLandMarker,
  usePoseLandMarkerStore,
} from './services/PoseLandMarker';
import demoImg from './../public/woman-g1af8d3deb_640.jpg';
import { PoseCanvas } from './services/PoseCanvas';
import { WebCam } from './components/WebCam';

function App() {
  const mounted = React.useRef(false);

  const isReady = usePoseLandMarkerStore((state) => state.isReady);

  const canvas = React.useRef<PoseCanvas>(null);

  React.useEffect(() => {
    if (mounted.current) {
      return;
    }

    mounted.current = true;

    (async () => {
      await poseLandMarker.init();

      // const img = document.getElementById('test');
      //
      // canvas.current = new PoseCanvas(
      //   document.getElementById('canvas') as HTMLCanvasElement,
      //   img!.clientWidth,
      //   img!.clientHeight,
      // );
      //
      // poseLandMarker.detectFromImage(img as HTMLImageElement, (landmarks) =>
      //   canvas.current!.draw(landmarks),
      // );
    })();
  }, []);

  return (
    <>
      {!isReady && <div>Loading...</div>}

      {/*<div style={{ position: 'relative' }}>*/}
      {/*  <img id="test" src={demoImg} />*/}
      {/*  <canvas id="canvas"></canvas>*/}
      {/*</div>*/}

      <WebCam />

      <div style={{ position: 'relative' }}>
        <video autoPlay={true} id="videoElement"></video>
        <canvas id="canvas"></canvas>
      </div>
    </>
  );
}

export default App;

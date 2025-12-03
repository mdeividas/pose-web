import React from 'react';

import classes from './WebCam.module.scss';
import type { CameraPermission } from 'services/Camera';
import { PoseCanvas } from 'services/PoseCanvas';
import { poseLandMarker } from '../../services/PoseLandMarker';

export const WebCam: React.FC = () => {
  const [cameraPermission, setCameraPermission] =
    React.useState<CameraPermission | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const poseCanvas = React.useRef<PoseCanvas>(null);

  const lastVideoTime = React.useRef<number>(-1);

  const predictWebcam = () => {
    let startTimeMs = performance.now();
    if (lastVideoTime.current !== videoRef.current!.currentTime) {
      lastVideoTime.current = videoRef.current!.currentTime;

      poseLandMarker.detectForVideo(
        videoRef.current!,
        startTimeMs,
        (landmarks) => poseCanvas.current!.draw(landmarks),
      );
    }

    window.requestAnimationFrame(predictWebcam);
  };

  React.useEffect(() => {
    (async () => {
      videoRef.current!.srcObject = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
      });

      videoRef.current!.addEventListener('loadeddata', predictWebcam);

      poseCanvas.current = new PoseCanvas(
        canvasRef.current!,
        videoRef.current!.clientWidth,
        videoRef.current!.clientHeight,
      );
    })();
  }, []);

  // TODO handle permissions

  return (
    <div className={classes.container}>
      <video ref={videoRef} autoPlay className={classes.video}></video>
      <canvas ref={canvasRef} className={classes.canvas} />
    </div>
  );
};

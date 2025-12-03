import {
  PoseLandmarker,
  FilesetResolver,
  type NormalizedLandmark,
} from '@mediapipe/tasks-vision';

import { usePoseLandMarkerStore } from './store/store.ts';

export class PoseLandMarker {
  #model: PoseLandmarker | null = null;

  async init() {
    usePoseLandMarkerStore.getState().setIsReady(false);

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm',
      );

      this.#model = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          // TODO
          // pose_landmarker_full.task
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO', // VIDEO | IMAGE
        numPoses: 2,
      });
    } catch (error) {
      // TODO log the error

      console.error(error);

      usePoseLandMarkerStore.getState().setHasError(true);
    } finally {
      usePoseLandMarkerStore.getState().setIsReady(true);
    }
  }

  detectFromImage(
    img: HTMLImageElement,
    draw: (landmarks: NormalizedLandmark[][]) => void,
  ) {
    this.#model?.detect(img, (result) => {
      console.log('__DEBUG', result);

      draw(result.landmarks);
    });
  }

  detectForVideo(
    video: HTMLVideoElement,
    startTimeMs: number,
    draw: (landmarks: NormalizedLandmark[][]) => void,
  ) {
    this.#model?.detectForVideo(video, startTimeMs, (result) => {
      draw(result.landmarks);
    });
  }
}

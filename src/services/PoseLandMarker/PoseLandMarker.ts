import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from '@mediapipe/tasks-vision';

import { usePoseLandMarkerStore } from './store/store.ts';

export class PoseLandMarker {
  async init() {
    usePoseLandMarkerStore.getState().setIsReady(false);

    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm',
      );

      console.log(vision);
    } catch (error) {
      // TODO log the error

      console.error(error);

      usePoseLandMarkerStore.getState().setHasError(true);
    } finally {
      usePoseLandMarkerStore.getState().setIsReady(true);
    }
  }
}

//const createPoseLandmarker = async () => {
//     const vision = await FilesetResolver.forVisionTasks(
//         "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
//     );
//     poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
//         baseOptions: {
//             modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
//             delegate: "GPU"
//         },
//         runningMode: runningMode,
//         numPoses: 2
//     });
//     demosSection.classList.remove("invisible");
// };

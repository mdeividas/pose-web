import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export class PoseCanvas {
  #ref: HTMLCanvasElement;

  #lastLandMarks: NormalizedLandmark[][] = [];

  #usedLandmarks = [
    {
      index: 0,
      threshold: 0.015,
    },
    {
      index: 11,
      threshold: 0.025,
    },
    {
      index: 12,
      threshold: 0.025,
    },
    {
      index: 13,
      threshold: 0.025,
    },
    {
      index: 14,
      threshold: 0.025,
    },
  ];

  constructor(ref: HTMLCanvasElement, width: number, height: number) {
    this.#ref = ref;

    this.#ref.style.position = 'absolute';
    this.#ref.style.top = '0px';
    this.#ref.style.left = '0px';
    this.#ref.height = height;
    this.#ref.width = width;
  }

  #updateLandmarks(landmarks: NormalizedLandmark[], index: number) {
    if (!this.#lastLandMarks[index]) {
      this.#lastLandMarks[index] = landmarks;
    }

    const previous = this.#lastLandMarks[index];

    this.#usedLandmarks.forEach((target) => {
      if (
        Math.abs(landmarks[target.index].x - previous[target.index].x) >
        target.threshold
      ) {
        this.#lastLandMarks[index][target.index].x = landmarks[target.index].x;
      }

      if (
        Math.abs(landmarks[target.index].y - previous[target.index].y) >
        target.threshold
      ) {
        this.#lastLandMarks[index][target.index].y = landmarks[target.index].y;
      }
    });
  }

  draw(landmarks: NormalizedLandmark[][]) {
    const ctx = this.#ref!.getContext('2d')!;

    landmarks.forEach((landmark, index) => {
      ctx.save();
      ctx.clearRect(0, 0, this.#ref.width, this.#ref.height);
      ctx.beginPath();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 5;

      this.#updateLandmarks(landmark, index);

      ctx.arc(
        this.#lastLandMarks[index][0].x * this.#ref.width,
        this.#lastLandMarks[index][0].y * this.#ref.height,
        5,
        0,
        Math.PI * 2,
        true,
      );

      ctx.moveTo(
        this.#lastLandMarks[index][13].x * this.#ref.width,
        this.#lastLandMarks[index][13].y * this.#ref.height,
      );

      ctx.arc(
        this.#lastLandMarks[index][13].x * this.#ref.width,
        this.#lastLandMarks[index][13].y * this.#ref.height,
        5,
        0,
        Math.PI * 2,
        true,
      );

      ctx.arc(
        this.#lastLandMarks[index][11].x * this.#ref.width,
        this.#lastLandMarks[index][11].y * this.#ref.height,
        5,
        0,
        Math.PI * 2,
        true,
      );

      ctx.arc(
        this.#lastLandMarks[index][12].x * this.#ref.width,
        this.#lastLandMarks[index][12].y * this.#ref.height,
        5,
        0,
        Math.PI * 2,
        true,
      );

      ctx.arc(
        this.#lastLandMarks[index][14].x * this.#ref.width,
        this.#lastLandMarks[index][14].y * this.#ref.height,
        5,
        0,
        Math.PI * 2,
        true,
      );
      ctx.stroke();
      ctx.restore();
    });
  }
}

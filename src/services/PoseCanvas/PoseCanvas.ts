import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

interface IPoint {
  x: number;
  y: number;
}

export class PoseCanvas {
  #ref: HTMLCanvasElement;

  #lastLandMarks: NormalizedLandmark[][] = [];

  #usedLandmarks = [
    {
      index: 0,
      threshold: 0.015,
    },

    {
      index: 13,
      threshold: 0.035,
    },
    {
      index: 11,
      threshold: 0.025,
    },
    {
      index: 23,
      threshold: 0.025,
    },
    {
      index: 25,
      threshold: 0.025,
    },

    {
      index: 14,
      threshold: 0.035,
    },
    {
      index: 12,
      threshold: 0.025,
    },
    {
      index: 24,
      threshold: 0.025,
    },
    {
      index: 26,
      threshold: 0.025,
    },

    // Right palm
    {
      index: 20,
      threshold: 0.035,
    },
    {
      index: 18,
      threshold: 0.035,
    },
    {
      index: 16,
      threshold: 0.035,
    },

    // Right foot
    {
      index: 28,
      threshold: 0.035,
    },
    {
      index: 32,
      threshold: 0.035,
    },
    {
      index: 30,
      threshold: 0.035,
    },
    // Left palm
    {
      index: 19,
      threshold: 0.035,
    },
    {
      index: 17,
      threshold: 0.035,
    },
    {
      index: 15,
      threshold: 0.035,
    },
    // Left foot
    {
      index: 27,
      threshold: 0.035,
    },
    {
      index: 29,
      threshold: 0.035,
    },
    {
      index: 31,
      threshold: 0.035,
    },
  ];

  #triangleCentroid(A: IPoint, B: IPoint, C: IPoint) {
    return {
      x: (A.x + B.x + C.x) / 3,
      y: (A.y + B.y + C.y) / 3,
    };
  }

  constructor(ref: HTMLCanvasElement, width: number, height: number) {
    this.#ref = ref;

    const dpr = window.devicePixelRatio || 1;

    this.#ref.style.position = 'absolute';
    this.#ref.style.top = '0px';
    this.#ref.style.left = '0px';

    // Set style size (CSS pixels)
    this.#ref.style.width = width + 'px';
    this.#ref.style.height = height + 'px';

    // Set actual canvas size (real pixels)
    this.#ref.width = width * dpr;
    this.#ref.height = height * dpr;

    this.#ref.style.backgroundColor = '#000000';

    const ctx = this.#ref.getContext('2d')!;

    ctx.scale(dpr, dpr);
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

  #drawHalfBody(
    ctx: CanvasRenderingContext2D,
    A: IPoint,
    B: IPoint,
    C: IPoint,
    D: IPoint,
    E: IPoint,
    G: IPoint,
  ) {
    ctx.moveTo(A.x * this.#ref.width, A.y * this.#ref.height);

    [A, B, C, D, E, G].forEach((point) =>
      ctx.arc(
        point.x * this.#ref.width,
        point.y * this.#ref.height,
        5,
        0,
        Math.PI * 2,
        true,
      ),
    );
  }

  #drawHead(ctx: CanvasRenderingContext2D, A: IPoint) {
    ctx.moveTo(A.x * this.#ref.width, A.y * this.#ref.height);

    ctx.arc(
      A.x * this.#ref.width,
      A.y * this.#ref.height,
      50,
      0,
      Math.PI * 2,
      true,
    );
  }

  #connectParts(
    ctx: CanvasRenderingContext2D,
    headPoint: IPoint,
    leftShoulderPoint: IPoint,
    rightShoulderPoint: IPoint,
    leftHipsPoint: IPoint,
    rightHipsPoint: IPoint,
  ) {
    const center = (leftShoulderPoint.x + rightShoulderPoint.x) / 2;

    ctx.moveTo(center * this.#ref.width, headPoint.y * this.#ref.height);

    ctx.lineTo(
      center * this.#ref.width,
      leftShoulderPoint.y * this.#ref.height,
    );

    ctx.moveTo(
      leftShoulderPoint.x * this.#ref.width,
      leftShoulderPoint.y * this.#ref.height,
    );

    ctx.lineTo(
      rightShoulderPoint.x * this.#ref.width,
      rightShoulderPoint.y * this.#ref.height,
    );

    ctx.moveTo(
      leftHipsPoint.x * this.#ref.width,
      leftHipsPoint.y * this.#ref.height,
    );

    ctx.lineTo(
      rightHipsPoint.x * this.#ref.width,
      rightHipsPoint.y * this.#ref.height,
    );
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

      const rightPalm = this.#triangleCentroid(
        {
          x: this.#lastLandMarks[index][20].x,
          y: this.#lastLandMarks[index][20].y,
        },
        {
          x: this.#lastLandMarks[index][16].x,
          y: this.#lastLandMarks[index][16].y,
        },
        {
          x: this.#lastLandMarks[index][18].x,
          y: this.#lastLandMarks[index][18].y,
        },
      );

      const rightFoot = this.#triangleCentroid(
        {
          x: this.#lastLandMarks[index][28].x,
          y: this.#lastLandMarks[index][28].y,
        },
        {
          x: this.#lastLandMarks[index][32].x,
          y: this.#lastLandMarks[index][32].y,
        },
        {
          x: this.#lastLandMarks[index][30].x,
          y: this.#lastLandMarks[index][30].y,
        },
      );

      const leftPalm = this.#triangleCentroid(
        {
          x: this.#lastLandMarks[index][19].x,
          y: this.#lastLandMarks[index][19].y,
        },
        {
          x: this.#lastLandMarks[index][17].x,
          y: this.#lastLandMarks[index][17].y,
        },
        {
          x: this.#lastLandMarks[index][15].x,
          y: this.#lastLandMarks[index][15].y,
        },
      );

      const leftFoot = this.#triangleCentroid(
        {
          x: this.#lastLandMarks[index][27].x,
          y: this.#lastLandMarks[index][27].y,
        },
        {
          x: this.#lastLandMarks[index][29].x,
          y: this.#lastLandMarks[index][29].y,
        },
        {
          x: this.#lastLandMarks[index][31].x,
          y: this.#lastLandMarks[index][31].y,
        },
      );

      this.#drawHalfBody(
        ctx,
        rightPalm,
        this.#lastLandMarks[index][14],
        this.#lastLandMarks[index][12],
        this.#lastLandMarks[index][24],
        this.#lastLandMarks[index][26],
        rightFoot,
      );
      this.#drawHalfBody(
        ctx,
        leftPalm,
        this.#lastLandMarks[index][13],
        this.#lastLandMarks[index][11],
        this.#lastLandMarks[index][23],
        this.#lastLandMarks[index][25],
        leftFoot,
      );

      this.#drawHead(ctx, this.#lastLandMarks[index][0]);

      this.#connectParts(
        ctx,
        this.#lastLandMarks[index][0],
        this.#lastLandMarks[index][12],
        this.#lastLandMarks[index][11],
        this.#lastLandMarks[index][24],
        this.#lastLandMarks[index][23],
      );

      ctx.stroke();
      ctx.restore();
    });
  }
}

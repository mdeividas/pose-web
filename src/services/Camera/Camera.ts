export enum CameraPermission {
  Granted = 'granted',
  Prompt = 'prompt',
  Denied = 'denied',
}

export class Camera {
  #state: CameraPermission = CameraPermission.Denied;

  async checkPermission(cb: () => void) {
    try {
      const status = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });

      this.#state = status.state as CameraPermission;

      status.onchange = (event) => {
        this.#state = (
          event.currentTarget as unknown as {
            state: CameraPermission;
          }
        ).state;
        cb();
      };

      cb();
      return Promise.resolve();
    } catch {
      // Fail silently
    }
  }

  get permission(): CameraPermission {
    return this.#state;
  }

  set permission(permission: CameraPermission) {
    this.#state = permission;
  }
}

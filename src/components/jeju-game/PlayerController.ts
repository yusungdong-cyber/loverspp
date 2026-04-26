export type MovementState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
};

export class PlayerController {
  public movement: MovementState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
  };

  constructor() {
    if (typeof window === "undefined") return;

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  dispose() {
    if (typeof window === "undefined") return;
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }

  setMobileDirection(direction: keyof MovementState, active: boolean) {
    this.movement[direction] = active;
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "KeyW" || event.code === "ArrowUp") this.movement.forward = true;
    if (event.code === "KeyS" || event.code === "ArrowDown") this.movement.backward = true;
    if (event.code === "KeyA" || event.code === "ArrowLeft") this.movement.left = true;
    if (event.code === "KeyD" || event.code === "ArrowRight") this.movement.right = true;
  };

  private handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === "KeyW" || event.code === "ArrowUp") this.movement.forward = false;
    if (event.code === "KeyS" || event.code === "ArrowDown") this.movement.backward = false;
    if (event.code === "KeyA" || event.code === "ArrowLeft") this.movement.left = false;
    if (event.code === "KeyD" || event.code === "ArrowRight") this.movement.right = false;
  };
}

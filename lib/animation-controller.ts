/**
 * Centralized Animation Controller
 * Professional approach: Single RAF loop manages all animations
 * Inspired by Awwwards-winning sites and Three.js best practices
 */

type AnimationCallback = (time: number, delta: number) => void;

class AnimationController {
  private static instance: AnimationController;
  private callbacks: Map<string, AnimationCallback> = new Map();
  private rafId: number | null = null;
  private lastTime: number = 0;
  private isRunning: boolean = false;

  private constructor() {}

  static getInstance(): AnimationController {
    if (!AnimationController.instance) {
      AnimationController.instance = new AnimationController();
    }
    return AnimationController.instance;
  }

  register(id: string, callback: AnimationCallback): void {
    this.callbacks.set(id, callback);
    if (!this.isRunning) {
      this.start();
    }
  }

  unregister(id: string): void {
    this.callbacks.delete(id);
    if (this.callbacks.size === 0) {
      this.stop();
    }
  }

  private animate = (time: number): void => {
    const delta = time - this.lastTime;
    this.lastTime = time;

    this.callbacks.forEach((callback) => {
      callback(time, delta);
    });

    this.rafId = requestAnimationFrame(this.animate);
  };

  private start(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      this.rafId = requestAnimationFrame(this.animate);
    }
  }

  private stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRunning = false;
  }

  getCallbackCount(): number {
    return this.callbacks.size;
  }
}

export const animationController = AnimationController.getInstance();

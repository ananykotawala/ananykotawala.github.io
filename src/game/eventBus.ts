type Listener<T> = (payload: T) => void;

class EventBus {
  private listeners: Map<string, Set<Listener<unknown>>> = new Map();

  on<T = unknown>(event: string, fn: Listener<T>) {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(fn as Listener<unknown>);
    return () => this.off(event, fn);
  }

  off<T = unknown>(event: string, fn: Listener<T>) {
    this.listeners.get(event)?.delete(fn as Listener<unknown>);
  }

  emit<T = unknown>(event: string, payload?: T) {
    this.listeners.get(event)?.forEach((fn) => fn(payload as unknown));
  }
}

export const bus = new EventBus();

export const EVENTS = {
  OPEN_SECTION: "open-section",
  CLOSE_SECTION: "close-section",
  GAME_READY: "game-ready",
  LOAD_PROGRESS: "load-progress",
  PAUSE_INPUT: "pause-input",
  RESUME_INPUT: "resume-input",
} as const;

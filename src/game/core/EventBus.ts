/**
 * EventBus — Lightweight pub/sub system for internal game communication.
 * The Game Engine and React hooks communicate exclusively through this bus.
 * The engine never imports React; React subscribes to events from the engine.
 */
export type EventCallback = (...args: unknown[]) => void;

export class EventBus {
  private static listeners: Map<string, Set<EventCallback>> = new Map();

  static on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  static off(event: string, callback: EventCallback): void {
    this.listeners.get(event)?.delete(callback);
  }

  static emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach((cb) => cb(...args));
  }

  static clear(): void {
    this.listeners.clear();
  }
}

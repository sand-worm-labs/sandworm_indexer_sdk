export interface CursorStore {
  getCursor(eventName: string): Promise<string | null>;
  saveCursor(eventName: string, cursor: string | null): Promise<void>;
}

export interface EventHandler<T> {
  (events: T[], saveCursor: (cursor: string | null) => Promise<void>): Promise<void>;
}

export class InMemoryCursorStore implements CursorStore {
  private store: Map<string, string> = new Map();

  /**
   * Retrieves the cursor associated with the given event name.
   * @param eventName - The name of the event.
   * @returns The saved cursor or null if not found.
   */
  async getCursor(eventName: string): Promise<string | null> {
    return this.store.get(eventName) ?? null;
  }

  /**
   * Saves the cursor for a specific event name.
   * @param eventName - The name of the event.
   * @param cursor - The cursor value to save.
   */
  async saveCursor(eventName: string, cursor: string | null): Promise<void> {
    if (cursor !== null) {
      this.store.set(eventName, cursor);
    } else {
      this.store.delete(eventName);
    }
  }
}

import type { CursorStore } from "../interface";

/**
 * InMemoryCursorStore is a simple in-memory implementation of the CursorStore interface.
 * 
 * Suitable for development, testing, or short-lived processes where persistence is not required.
 * 
 * NOTE: This implementation does NOT persist across application restarts.
 */
export class InMemoryCursorStore implements CursorStore {
  private store: Map<string, string> = new Map();

  /**
   * Retrieves the cursor associated with the given event name.
   * 
   * @param eventName - A unique name identifying the event stream (e.g. "TransferEvent:USDC").
   * @returns The last saved cursor for the event, or null if none exists.
   */
  async getCursor(eventName: string): Promise<string | null> {
    return this.store.get(eventName) ?? null;
  }

  /**
   * Saves or clears the cursor for a specific event name.
   * 
   * @param eventName - A unique name identifying the event stream.
   * @param cursor - The cursor string to save. If null, removes the saved cursor.
   */
  async saveCursor(eventName: string, cursor: string | null): Promise<void> {
    if (cursor !== null) {
      this.store.set(eventName, cursor);
    } else {
      this.store.delete(eventName);
    }
  }
}

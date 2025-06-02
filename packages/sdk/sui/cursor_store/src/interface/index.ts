/**
 * CursorStore defines a storage interface for managing event stream cursors.
 * This is useful for resuming processing from a specific point.
 */
export interface CursorStore {
  /**
   * Retrieves the saved cursor for a given event stream.
   * @param eventName - A unique identifier for the event stream (e.g. "SwapEvent", "TransferEvent").
   * @returns The last saved cursor as a string, or null if not found.
   */
  getCursor(eventName: string): Promise<string | null>;

  /**
   * Persists the cursor for a specific event stream.
   * @param eventName - A unique identifier for the event stream.
   * @param cursor - The cursor value to save. Use null to clear/reset.
   */
  saveCursor(eventName: string, cursor: string | null): Promise<void>;
}

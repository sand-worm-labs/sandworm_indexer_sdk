export interface CursorStore {
  getCursor(eventName: string): Promise<string | null>;
  saveCursor(eventName: string, cursor: string | null): Promise<void>;
}


export interface EventHandler<T> {
  (events: T[], saveCursor: (cursor: string | null) => Promise<void>): Promise<void>;
}
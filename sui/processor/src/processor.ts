import { SuiClient,SuiEventFilter } from '@mysten/sui/client';
import { CursorStore, EventHandler } from './interface';

class SuiProcessor {
  private client: SuiClient;
  private eventFilters: Map<string, SuiEventFilter> = new Map();
  private cursors: Map<string, string | null> = new Map();
  private batchSize = 1000;
  private pollingInterval = 1000; // ms
  private cursorStore: CursorStore;
  private handler?: EventHandler<any>;

  constructor(client: SuiClient, cursorStore: CursorStore) {
    this.client = client;
    this.cursorStore = cursorStore;
  }

  setClientUrl(url: string): this {
    this.client = new SuiClient({ url });
    return this;
  }

  addEvent(filter: SuiEventFilter, eventName: string): this {
    this.eventFilters.set(eventName, filter);
    return this;
  }

  setBatchSize(size: number): this {
    this.batchSize = size;
    return this;
  }

  setPollingInterval(ms: number): this {
    this.pollingInterval = ms;
    return this;
  }

  async loadCursors() {
    for (const eventName of this.eventFilters.keys()) {
      const cursor = await this.cursorStore.getCursor(eventName);
      this.cursors.set(eventName, cursor);
    }
  }

    // Getter for batchSize
  getBatchSize(): number {
    return this.batchSize;
  }


  // Getter for pollingInterval
  getPollingInterval(): number {
    return this.pollingInterval;
  }


  onEvents(handler: EventHandler<any>): this {
    this.handler = handler;
    return this;
  }

  async run() {
    // if (!this.handler) throw new Error("Event handler not set. Use onEvents()");

    // await this.loadCursors();

    // while (true) {
    //   for (const [eventName, filter] of this.eventFilters.entries()) {
    //     const cursor = this.cursors.get(eventName) ?? null;

    //     // Fetch batch of events from Sui node using client and cursor
    //     const events = await this.client.queryEvents({
    //       query: filter,
    //       cursor,
    //       limit: this.batchSize,
    //     });

    //     if (events.length > 0) {
    //       await this.handler(events, async (newCursor) => {
    //         this.cursors.set(eventName, newCursor);
    //         await this.cursorStore.saveCursor(eventName, newCursor);
    //       });
    //     }
    //   }
    //   await new Promise((r) => setTimeout(r, this.pollingInterval));
    // }
  }
}

import { SuiClient,SuiEventFilter } from '@mysten/sui/client';
import { CursorStore, EventHandler, InMemoryCursorStore } from '@sdk';
import { writeFileSync } from 'fs';
import { parseEventFilterFile } from '@sdk/sui/utils';

export class SuiBatchProcessor {
  private client: SuiClient;
  private eventFilters: Map<string, SuiEventFilter> = new Map();
  private cursors: Map<string, string | null> = new Map();
  private batchSize = 1000;
  private pollingInterval = 1000; // ms
  private cursorStore: CursorStore;

  constructor() {
    this.client = new SuiClient({ url: 'https://fullnode.devnet.sui.io:443' });
    this.cursorStore = new InMemoryCursorStore();
  }

  setClientUrl(url: string): this {
    this.client = new SuiClient({ url });
    return this;
  }

  addEvent(eventName: string, filter: SuiEventFilter): this {
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

  /**
   * Loads event filters from a JSON file and adds them to the processor.
   * @param filePath - The path to the JSON file containing the event filters.
   * @returns The current instance of SuiBatchProcessor for method chaining.
   */

  loadEventsFromFile(filePath: string): this {
    const filters =  parseEventFilterFile(filePath);
    for (const [name, filter] of Object.entries(filters)) {
      this.addEvent(name, filter);
    }
    return this;
  }


  /**
   * Saves the event filters to a JSON file.
   * @param filePath - The path to the JSON file to write to.
   */
  exportEventsToFile(filePath: string): void {
    const json: Record<string, SuiEventFilter> = {};
    for (const [name, filter] of this.eventFilters.entries()) {
      json[name] = filter;
    }

    const output = JSON.stringify(json, null, 2);
    writeFileSync(filePath, output, 'utf-8');
  }

}

import type { SuiClient, SuiEvent, SuiEventFilter } from "@mysten/sui/client";
import  jsonToTS  from "json-to-ts";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import SuiBatchProcessor from "../processor/src/processor";

export default class EventTypeGenerator {
  private processor: SuiBatchProcessor;

  private generatePath = "./generate_event_types";

  constructor(processor: SuiBatchProcessor) {
    this.processor = processor;
  }

  setGeneratePath(path: string) {
    this.generatePath = path;
  }

  /**
   * Collects all MoveEventType strings from the filters.
   */
  collectEventTypes(): string[] {
    const eventTypes: Set<string> = new Set();

    for (const filter of Object.values(this.processor.exportEventstoMap)) {
      if ("MoveEventType" in filter) {
        eventTypes.add(filter.MoveEventType);
      }

      if ("Any" in filter) {
        for (const subFilter of filter.Any) {
          if ("MoveEventType" in subFilter) {
            eventTypes.add(subFilter.MoveEventType);
          }
        }
      }
    }
    return Array.from(eventTypes);
  }

  /**
   * Queries one event from the blockchain by MoveEventType.
   * Returns the raw JSON data of the event or null if none found.
   */
  async querySampleEvent(moveEventType: SuiEventFilter, eventName: string): Promise<any> {
    const foundEvents =  await this.processor.client.queryEvents({
      query:moveEventType,
      limit: 1000,
      order:"descending",
     });

     if (foundEvents.data.length === 0) {
       throw new Error(`No events found for MoveEventType: ${eventName}`);
     }

     if (foundEvents.data[0]?.parsedJson === null) {
       throw new Error(`No events found for MoveEventType: ${eventName}`);
     }
     return foundEvents.data[0]?.parsedJson;
  }

  /**
   * Generates TypeScript interfaces from JSON data using json-to-ts.
   */
  generateTypesFromJson(json: any, rootInterfaceName = "RootObject"): string {
    const interfaces = jsonToTS(json, { rootName: rootInterfaceName });
    return interfaces.join("\n\n");
  }

  async run() {
    mkdirSync(this.generatePath, { recursive: true });

    const moveEventTypes = this.collectEventTypes();

    for (const moveEventType of moveEventTypes) {
      try {
        const json = await this.querySampleEvent(
          { MoveEventType: moveEventType },
          moveEventType,
        );

        const typeName = moveEventType.replace(/[:<>]/g, "_");
        const ts = this.generateTypesFromJson(json, typeName);
        const filePath = join(this.generatePath, `${typeName}.ts`);

        writeFileSync(filePath, ts);
        console.log(`✅ Generated: ${filePath}`);
      } catch (err) {
        console.warn(`⚠️ Skipped ${moveEventType}: ${(err as Error).message}`);
      }
    }
  }
}

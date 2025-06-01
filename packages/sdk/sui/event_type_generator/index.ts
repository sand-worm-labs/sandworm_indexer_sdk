import {EventFilterMap} from "../processor/src/interface";
let x = {
  "AllEvents": { "All": [] },
  "SwapBySender": { "Sender": "0xabc123..." },
  "SpecificSwap": { "MoveEventType": "0x1::pool::SwapEvent" },
  "ByModule": {
    "MoveModule": {
      "module": "pool",
      "package": "0x1"
    }
  },
  "ByEventModule": {
    "MoveEventModule": {
      "module": "pool",
      "package": "0x1"
    }
  },
  "TimeWindow": {
    "TimeRange": {
      "startTime": "1680000000000",
      "endTime": "1690000000000"
    }
  },
  "AnyExample": {
    "Any": [
      { "Sender": "0xabc123..." },
      { "MoveEventType": "0x1::foo::BarEvent" }
    ]
  }
} as EventFilterMap

export function generateEventType(filters: EventFilterMap) {
  for (const [name, filter] of Object.entries(filters)) {
    if ('MoveEventType' in filter) {
      const typeName = name;
      const typeValue = filter.MoveEventType;
      console.log(`export type ${typeName} = "${typeValue}";`);
    }

    if ('Any' in filter) {
      for (const subFilter of filter.Any) {
        if ('MoveEventType' in subFilter) {
          const typeName = `${name}SubType`;
          const typeValue = subFilter.MoveEventType;
          console.log(`export type ${typeName} = "${typeValue}";`);
        }
      }
    }
  }
}

generateEventType(x)
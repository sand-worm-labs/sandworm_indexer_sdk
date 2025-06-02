import { readFileSync } from 'fs';
import type { SuiEventFilter } from '@mysten/sui/client';

type RawEventFilters = Record<string, unknown>;


function isValidSuiEventFilter(filter: any): filter is SuiEventFilter {
  if (typeof filter !== 'object' || filter === null) return false;

  const keys = Object.keys(filter);
  if (keys.length !== 1) return false;

  const key = keys[0];

  switch (key) {
    case 'All':
      return Array.isArray(filter.All) && filter.All.length === 0;

    case 'Any':
      return (
        Array.isArray(filter.Any) &&
        filter.Any.every((sub: any) => isValidSuiEventFilter(sub))
      );

    case 'Sender':
    case 'Transaction':
    case 'MoveEventType':
      return typeof filter[key] === 'string';

    case 'MoveModule':
    case 'MoveEventModule':
      return (
        typeof filter[key]?.module === 'string' &&
        typeof filter[key]?.package === 'string'
      );

    case 'TimeRange':
      return (
        typeof filter[key]?.startTime === 'string' &&
        typeof filter[key]?.endTime === 'string'
      );

    default:
      return false;
  }
}

/**
 * Parse and validate a JSON file of event filters.
 */
export function parseEventFilterFile(filePath: string): Record<string, SuiEventFilter> {
  const raw = readFileSync(filePath, 'utf-8');
  let parsed: RawEventFilters;

  try {
    parsed = JSON.parse(raw);
  } catch (err: any) {
    throw new Error(`Invalid JSON format in file: ${filePath}\n${err.message}`);
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Root JSON must be an object mapping event names to filters.');
  }

  const filters: Record<string, SuiEventFilter> = {};

  for (const [eventName, filter] of Object.entries(parsed)) {
    if (!isValidSuiEventFilter(filter)) {
      throw new Error(`Invalid SuiEventFilter for event "${eventName}"`);
    }
    filters[eventName] = filter;
  }

  return filters;
}

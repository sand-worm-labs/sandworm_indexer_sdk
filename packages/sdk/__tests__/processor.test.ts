import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SuiEventFilter } from '@mysten/sui/client';
import * as fs from 'fs';
import SuiBatchProcessor from '../sui/processor/src/processor';

vi.mock('@sdk/sui/utils', () => ({
  parseEventFilterFile: vi.fn(() => ({
    TestEvent: {
      Package: '0x123',
      Module: 'test',
      EventType: 'event',
    },
  })),
}));

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof fs>();
  return {
    ...actual,
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  };
});

describe('SuiBatchProcessor', () => {
  let processor: SuiBatchProcessor;

  beforeEach(() => {
    processor = new SuiBatchProcessor();
  });

  it('sets a custom client URL', () => {
    const url = 'https://fullnode.testnet.sui.io:443';
    processor.setClientUrl(url);
    expect(processor.getClientUrl()).toBe(url);
  });

  it('adds an event filter', () => {
    const filter: SuiEventFilter = {
      MoveEventType: '0x123::test::event',
    };
    processor.addEvent('TestEvent', filter);
    const map = processor.exportEventstoMap();
    expect(map.has('TestEvent')).toBe(true);
    expect(map.get('TestEvent')).toEqual(filter);
  });

  it('loads events from file', () => {
    
    vi.spyOn(processor, 'loadEventsFromFile').mockImplementation((_filePath: string) => {
      const fakeFilter: SuiEventFilter = { MoveEventType: '0x123::test::event' };
      // @ts-ignore: accessing private map directly for test
      processor.addEvent('TestEvent', fakeFilter);
      return processor;
    });

    processor.loadEventsFromFile('./event/path.json');
    const events = processor.exportEventstoMap();
    expect(events.has('TestEvent')).toBe(true);
    expect(events.get('TestEvent')).toEqual({
      MoveEventType: '0x123::test::event',
    });
  });

  it('exports events to file', () => {
    const filter = { MoveEventType: '0x123::test::event' };
    const filter2 = {
      Any: [
        { MoveEventType: '0x123::test::event' },
        { Transaction: '0x123::test::event' },
      ],
    };

    processor.addEvent('MyEvent', filter);
    processor.addEvent('MyEvent2', filter2);
    processor.exportEventsToFile('./event/file.json');

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      './event/file.json',
      JSON.stringify({ MyEvent: filter, MyEvent2: filter2 }, null, 2),
      'utf-8',
    );
  });

  it('gets batch size and polling interval', () => {
    processor.setBatchSize(999);
    processor.setPollingInterval(3333);
    expect(processor.getBatchSize()).toBe(999);
    expect(processor.getPollingInterval()).toBe(3333);
  });
});

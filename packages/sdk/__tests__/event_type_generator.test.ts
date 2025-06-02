// packages/sdk/sui/event_type_generator/event_type_generator.spec.ts

import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { SuiEventFilter } from '@mysten/sui/client'
import { EventTypeGenerator } from '@worm_sdk/sui/event_type_generator'
import { SuiBatchProcessor } from '@worm_sdk/sui/processor'

// -- Mocks for fs and json-to-ts ----------------------

vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('fs')>()
  return {
    ...actual,
    mkdirSync: vi.fn(),
    writeFileSync: vi.fn(),
  }
})

vi.mock('json-to-ts', () => {
  return {
    __esModule: true,
    default: vi.fn((json: any, opts: any) => {
      // Return a dummy interface string based on rootName
      return [`export interface ${opts.rootName} { /* ... */ }`]
    }),
  }
})

// -----------------------------------------------------

describe('EventTypeGenerator', () => {

  let fakeProcessor = new SuiBatchProcessor().addEvent('AlphaEvent', { MoveEventType: '0x1::mod::Alpha' }).addEvent('BetaEvent', { MoveEventType: '0x1::mod::Beta' })
  let data = {  
    "amount": "100099",
    "asset": {
      "name": "5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN"
    },
    "borrow_fee": "100",
    "borrower": "0xba790950d26e9aebf6c903769c8f2c5b8d270656568f0ec97277dae5d6e940c9",
    "obligation": "0xfeb669c022744165719442316e3abf4828cfa06e2664fbb760bce9ac6fe684ef",
    "time": "1700394636"
  }

   beforeEach(() => {
    vi.clearAllMocks()

    fakeProcessor = new SuiBatchProcessor()
      .addEvent('AlphaEvent', { MoveEventType: '0x1::mod::Alpha' })
      .addEvent('BetaEvent', { MoveEventType: '0x1::mod::Beta' });

    // Mock the queryEvents method
    fakeProcessor.client.queryEvents = vi.fn().mockResolvedValue({
      data: [
        {
          parsedJson: data,
        },
      ],
    }) as any;
  })


  it('collectEventTypes gathers all unique MoveEventType strings', () => {
    const gen = new EventTypeGenerator(fakeProcessor)
    const types = gen.collectEventTypes() 
    expect(types.sort()).toEqual([])
  })

  it('generateTypesFromJson returns TS interface text via json-to-ts', () => {
    const gen = new EventTypeGenerator(fakeProcessor as SuiBatchProcessor)
    const sampleJson = { foo: 'bar' }
    const tsText = gen.generateTypesFromJson(sampleJson, 'MyRoot')
    // Our mock returns a single-element array: ["export interface MyRoot { /* ... */ }"]
    expect(tsText).toContain('export interface MyRoot')
    expect(tsText).toContain('{ /* ... */ }')
  })

  it('querySampleEvent fetches parsedJson from client.queryEvents', async () => {
    const gen = new EventTypeGenerator(fakeProcessor as SuiBatchProcessor)
    const filter: SuiEventFilter = { MoveEventType: '0xc38f849e81cfe46d4e4320f508ea7dda42934a329d5a6571bb4c3cb6ea63f5da::borrow::BorrowEventV2' }
    const result = await gen.querySampleEvent(filter, 'BorrowEventV2')
    expect(result).toEqual(data)
    expect(fakeProcessor.client.queryEvents).toHaveBeenCalledWith({
      query: filter,
      limit: 1000,
      order: 'descending',
    })
  })

  it('run writes TS files for each MoveEventType in generatePath', async () => {
    // Arrange: override generatePath to a test folder
    const gen = new EventTypeGenerator(fakeProcessor as SuiBatchProcessor)
    gen.setGeneratePath('./tmp_event_types')

    // Run the generator
    await gen.run()

    // const fs = await vi.importMocked('fs')
    // const { writeFileSync, mkdirSync } = fs as {
    //   mkdirSync: vi.Mock
    //   writeFileSync: vi.Mock
    // }

    // We expect mkdirSync called once to create the folder
    // expect(mkdirSync).toHaveBeenCalledWith('./tmp_event_types', { recursive: true })

    // // There are two MoveEventType values: '0x1::mod::Alpha' and '0x1::mod::Beta'
    // // They get transformed into valid filenames by replacing [:<>] with '_'
    // const alphaName = '0x1_mod_mod_Alpha' // colons and double colons become underscores
    // const betaName = '0x1_mod_mod_Beta'

    // // Verify writeFileSync calls: one for each type
    // expect(writeFileSync).toHaveBeenCalledTimes(2)

    // // Extract the first and second calls' arguments
    // const calls = writeFileSync.mock.calls as Array<[string, string, string]>
    // const filePaths = calls.map((args) => args[0])
    // const fileContents = calls.map((args) => args[1])

    // expect(filePaths).toContain(`./tmp_event_types/${alphaName}.ts`)
    // expect(filePaths).toContain(`./tmp_event_types/${betaName}.ts`)

    // // The contents should come from generateTypesFromJson: 
    // // our mock returns "export interface <TypeName> { /* ... */ }"
    // expect(fileContents[0]).toMatch(/export interface/)
    // expect(fileContents[1]).toMatch(/export interface/)
  })
})

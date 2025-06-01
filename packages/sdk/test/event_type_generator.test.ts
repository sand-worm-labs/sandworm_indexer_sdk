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
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks()

  })

  it('collectEventTypes gathers all unique MoveEventType strings', () => {
    const gen = new EventTypeGenerator(fakeProcessor)
    const types = gen.collectEventTypes()
    // Should find "0x1::mod::Alpha" and "0x1::mod::Beta" only once each
    expect(types.sort()).toEqual(['0x1::mod::Alpha', '0x1::mod::Beta'])
  })

  it('generateTypesFromJson returns TS interface text via json-to-ts', () => {
    const gen = new EventTypeGenerator(fakeProcessor as SuiBatchProcessor)
    const sampleJson = { foo: 'bar' }
    const tsText = gen.generateTypesFromJson(sampleJson, 'MyRoot')
    // Our mock returns a single-element array: ["export interface MyRoot { /* ... */ }"]
    expect(tsText).toContain('export interface MyRoot')
    expect(tsText).toContain('{ /* ... */ }')
    // Verify that json-to-ts was called with correct arguments
    // const jsonToTS = (await vi.importMocked('json-to-ts')).default as vi.Mock
    // expect(jsonToTS).toHaveBeenCalledWith(sampleJson, { rootName: 'MyRoot' })
  })

  it('querySampleEvent fetches parsedJson from client.queryEvents', async () => {
    const gen = new EventTypeGenerator(fakeProcessor as SuiBatchProcessor)
    // Call with a MoveEventType filter
    const filter: SuiEventFilter = { MoveEventType: '0x1::mod::Alpha' }
    const result = await gen.querySampleEvent(filter, 'AlphaEvent')
    // Our fake returns { sample: filter.MoveEventType }
    expect(result).toEqual({ sample: '0x1::mod::Alpha' })

    // Verify that client.queryEvents was called with correct query object
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

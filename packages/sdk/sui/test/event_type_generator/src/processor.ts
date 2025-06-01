import { SuiBatchProcessor,  } from '../../../processor/src';

let packageId = "sui_cetus";
const processor = new SuiBatchProcessor()
    .setClientUrl('https://fullnode.devnet.sui.io:443')
    .addEvent("MintEvent",{ MoveEventType: "0x2::cetus::MintEvent" })
    .addEvent("BurnEvent",{ MoveEventType: "0x2::cetus::BurnEvent" })
    .addEvent("AddLiquidityEvent", { MoveEventType: `${packageId}::pool::AddLiquidityEvent`})
    .addEvent("RemoveLiquidityEvent", {MoveEventType: `${packageId}::pool::RemoveLiquidityEvent`})
    .addEvent("SwapEvent", { MoveEventType: `${packageId}::pool::SwapEvent`})
    .addEvent("CollectFeeEvent", { MoveEventType: `${packageId}::pool::CollectFeeEvent`}) 
    .addEvent("FlashLoanEvent", {MoveEventType: `${packageId}::pool::FlashLoanEvent` })
    .addEvent("FlashLoanEventBySender", {Sender: "0xabc123..."  })
    .addEvent("FlashLoanEventAny", { Any: [ { MoveEventType: `${packageId}::pool::FlashLoanEvent` },{ Sender: "0xabc123..." }]})
    .addEvent("Timerange",  {  TimeRange: {startTime: "1680000000000",endTime: "1689999999999"  } })
    .setBatchSize(100)
    .setPollingInterval(1000);


//     const packageId = "0x123abc"; // example package ID

// const processor = new SuiBatchProcessor()
//   .setClientUrl('https://fullnode.devnet.sui.io:443')

//   // 1. All events
//   .addEvent("AllEvents", { All: [] })

//   // 2. Any of multiple filters (OR)
//   .addEvent("AnyEvents", { Any: [
//     { Sender: "0xabc123..." },
//     { MoveEventType: `${packageId}::pool::FlashLoanEvent` }
//   ]})

//   // 3. Filter by sender address
//   .addEvent("BySender", { Sender: "0xabc123..." })

//   // 4. Filter by transaction digest
//   .addEvent("ByTransaction", { Transaction: "0xdeadbeef..." })

//   // 5. Filter by Move module (where event is emitted)
//   .addEvent("ByMoveModule", { MoveModule: {
//     module: "pool",
//     package: packageId,
//   }})

//   // 6. Filter by Move event struct tag (full path)
//   .addEvent("ByMoveEventType", { MoveEventType: `${packageId}::pool::FlashLoanEvent` })

//   // 7. Filter by Move event module (where struct is defined)
//   .addEvent("ByMoveEventModule", { MoveEventModule: {
//     module: "pool",
//     package: packageId,
//   }})

//   // 8. Filter events in a time range (timestamps in ms since epoch)
//   .addEvent("ByTimeRange", { TimeRange: {
//     startTime: "1680000000000",
//     endTime: "1689999999999",
//   }})

//   // 9. Combine filters with All (AND)
//   .addEvent("ByEventTypeAndTimeRange", { All: [
//     { MoveEventType: `${packageId}::pool::FlashLoanEvent` },
//     { TimeRange: {
//         startTime: "1680000000000",
//         endTime: "1689999999999"
//       }
//     }
//   ]})

//   // 10. Combine filters with Any (OR)
//   .addEvent("BySenderOrEventType", { Any: [
//     { Sender: "0xabc123..." },
//     { MoveEventType: `${packageId}::pool::FlashLoanEvent` }
//   ]})

//   .setBatchSize(100)
//   .setPollingInterval(1000);

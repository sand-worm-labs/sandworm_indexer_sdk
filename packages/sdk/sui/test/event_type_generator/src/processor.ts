import { SuiBatchProcessor,  } from 'sdk/sui/processor';
import { EventTypeGenerator } from "sdk/sui/event_type_generator"

let packageId = "sui_cetus";
export const processor = new SuiBatchProcessor()
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
    .setPollingInterval(1000)
    .exportEventsToFile("./events.json");

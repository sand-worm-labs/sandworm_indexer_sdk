import { EventTypeGenerator } from "sdk/sui/event_type_generator"
import { processor } from "./processor";

async function main() {
  const generator = new EventTypeGenerator(processor);
  generator.setGeneratePath("./generate_event_types");
  await generator.run();
}

main().catch(console.error);

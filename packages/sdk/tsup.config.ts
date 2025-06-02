import { defineConfig } from "tsup";

import { createPackageConfig } from "../../tsup.config.base.js";

export default defineConfig(
  createPackageConfig({
    entry: {
      index: "index.ts", 
      "sui/index": "sui/index.ts",
    },
    external: [
      "@mysten/sui",
    ],
    noExternal: [],
  }),
);

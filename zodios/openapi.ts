import { openApiBuilder } from "npm:@zodios/openapi"
import { contract } from "./contract.ts"

export const openapi = openApiBuilder({
  title: "Example API",
  version: "1.0.0",
})
  .addPublicApi(contract)
  .build()

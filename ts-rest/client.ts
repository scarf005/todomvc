import { initClient } from "npm:@ts-rest/core"
import { contract } from "./contract.ts"

const client = initClient(contract, {
  baseUrl: "http://localhost:9000",
  baseHeaders: {},
  throwOnUnknownStatus: true,
})

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

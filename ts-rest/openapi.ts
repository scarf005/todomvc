import { generateOpenApi } from "npm:@ts-rest/open-api"
import { contract } from "./contract.ts"

export const openapi = generateOpenApi(contract, {
  info: {
    title: "Example API",
    version: "1.0.0",
  },
})

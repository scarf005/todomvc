import { z } from "./deps.ts"

export const notFoundSchema = z
  .object({ message: z.string() })
  .openapi({
    title: "NotFound",
    description: "Not Found",
    example: { message: "Not Found" },
  })

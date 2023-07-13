import { z } from "npm:zod@3.21.4"
import { extendApi, extendZodWithOpenApi } from "npm:@anatine/zod-openapi@2.0.1"

extendZodWithOpenApi(z)

export { extendApi, z }

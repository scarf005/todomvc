import { apiBuilder, ZodiosEndpointParameter } from "npm:@zodios/core@^10.9.2"
import { todoSchema, todosSchema } from "../todo.ts"
import { notFoundSchema } from "../responses.ts"

const idPath = {
  type: "Path" as const,
  name: "id",
  schema: todoSchema.shape.id,
} satisfies ZodiosEndpointParameter

const bodyParam = {
  type: "Body" as const,
  name: "body",
  schema: todoSchema.omit({ id: true }),
} satisfies ZodiosEndpointParameter

export const contract = apiBuilder({
  alias: "getTodos",
  method: "get",
  path: "/todos",
  response: todosSchema,
})
  .addEndpoint({
    alias: "getTodo",
    method: "get",
    path: "/todos/:id",
    parameters: [idPath],
    response: todoSchema,
    errors: [{ status: 404, schema: notFoundSchema }],
  })
  .addEndpoint({
    alias: "createTodo",
    method: "post",
    path: "/todos",
    parameters: [idPath, bodyParam],
    response: todoSchema,
    status: 201,
  })
  .addEndpoint({
    alias: "updateTodo",
    method: "put",
    path: "/todos/:id",
    parameters: [idPath, bodyParam],
    response: todoSchema,
    errors: [{ status: 404, schema: notFoundSchema }],
  })
  .addEndpoint({
    alias: "deleteTodo",
    method: "delete",
    path: "/todos/:id",
    parameters: [idPath],
    response: todoSchema,
    errors: [{ status: 404, schema: notFoundSchema }],
  })
  .build()

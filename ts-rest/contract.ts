import { initContract } from "npm:@ts-rest/core"
import { todoSchema, todosSchema } from "../todo.ts"
import { z } from "../deps.ts"
import { notFoundSchema } from "../responses.ts"

const c = initContract()

const getTodos = c.query(
  {
    method: "GET",
    path: "/todos",
    responses: {
      200: todosSchema,
    },
  } as const,
)

const getTodo = c.query(
  {
    method: "GET",
    path: "/todos/:id",
    responses: {
      200: todoSchema,
      404: notFoundSchema,
    },
  } as const,
)

const createTodo = c.mutation(
  {
    method: "POST",
    path: "/todos",
    body: todoSchema.omit({ id: true }),
    responses: {
      201: todoSchema,
    },
  } as const,
)

const updateTodo = c.mutation(
  {
    method: "PUT",
    path: "/todos/:id",
    body: todoSchema.omit({ id: true }),
    responses: {
      200: todoSchema,
      404: notFoundSchema,
    },
  } as const,
)

const deleteTodo = c.mutation(
  {
    method: "DELETE",
    path: "/todos/:id",
    body: z.void(),
    responses: {
      200: todoSchema,
      404: notFoundSchema,
    },
  } as const,
)

export const contract = c.router(
  {
    getTodo,
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  },
  { strictStatusCodes: true },
)

// deno-lint-ignore-file require-await
import {
  AppRoute,
  ServerInferRequest as InferReq,
  ServerInferResponses as InferRes,
} from "npm:@ts-rest/core@3.26.3"
import { createExpressEndpoints, initServer } from "npm:@ts-rest/express@3.26.3"
// @deno-types="npm:@types/node"
// @deno-types=npm:@types/express
import express from "npm:express"
// @deno-types=npm:@types/swagger-ui-express
import * as swaggerUi from "npm:swagger-ui-express"

import { contract } from "./contract.ts"
import { openapi } from "./openapi.ts"

import * as repo from "../shared/store.ts"

// types.ts
type ServerInferRoute<T extends AppRoute> = (req: InferReq<T>) => Promise<InferRes<T>>

// controllers.ts
type GetTodos = ServerInferRoute<typeof contract.getTodos>
const getTodos: GetTodos = async () => ({ status: 200, body: repo.getTodos() } as const)

type GetTodo = ServerInferRoute<typeof contract.getTodo>
type GetTodoRes = InferRes<typeof contract.getTodo>
const getTodo: GetTodo = async ({ params: { id } }) =>
  repo.getTodoById({ id })
    .mapOrDefault<GetTodoRes>(
      (todo) => ({ status: 200, body: todo } as const),
      { status: 404, body: { message: "not found" } },
    )

type CreateTodo = ServerInferRoute<typeof contract.createTodo>
const createTodo: CreateTodo = async ({ body }) => ({
  status: 201,
  body: repo.createTodo(body),
})

type UpdateTodo = ServerInferRoute<typeof contract.updateTodo>
const updateTodo: UpdateTodo = async ({ params: { id }, body }) =>
  match(repo.updateTodoById({ ...body, id }))
    .with(P.not(null), (updatedTodo) => ({ status: 200, body: updatedTodo } as const))
    .otherwise(() => ({ status: 404, body: { message: "not found" } } as const))

type DeleteTodo = ServerInferRoute<typeof contract.deleteTodo>
const deleteTodo: DeleteTodo = async ({ params: { id } }) =>
  match(repo.deleteTodoById(id))
    .with(P.not(null), (deletedTodo) => ({ status: 200, body: deletedTodo } as const))
    .otherwise(() => ({ status: 404, body: { message: "not found" } } as const))

// controller.ts
const s = initServer()
const router = s.router(contract, {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
})

// docs.ts
export const docs = express.Router()
docs.get("/docs.json", (_, res) => res.send(openapi))
docs.use("/docs", swaggerUi.serveFiles(undefined, { swaggerUrl: "/docs.json" }))
docs.use("/docs", swaggerUi.setup(undefined, { swaggerUrl: "/docs.json" }))

// app.ts

export const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use("/", docs)

createExpressEndpoints(contract, router, app, {
  requestValidationErrorHandler: "combined",
  responseValidation: true,
})

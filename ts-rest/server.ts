import {
  AppRoute,
  ServerInferRequest as InferReq,
  ServerInferResponses as InferRes,
} from "npm:@ts-rest/core"
import { createExpressEndpoints, initServer } from "npm:@ts-rest/express"
// @deno-types=npm:@types/express
import express from "npm:express"
// @deno-types=npm:@types/swagger-ui-express
import * as swaggerUi from "npm:swagger-ui-express"

import { match, P } from "npm:ts-pattern@^5.0.1"

import { contract } from "./contract.ts"
import { openapi } from "./openapi.ts"

import * as repo from "../store.ts"

export const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use("/docs.json", (_, res) => res.send(openapi))
app.use("/docs", swaggerUi.serveFiles(undefined, { swaggerUrl: "/docs.json" }))
app.use("/docs", swaggerUi.setup(undefined, { swaggerUrl: "/docs.json" }))
const s = initServer()

// deno-fmt-ignore
type ServerInferRoute<T extends AppRoute> = (req: InferReq<T>) => Promise<InferRes<T>>

type GetTodos = ServerInferRoute<typeof contract.getTodos>
const getTodos: GetTodos = async () => ({ status: 200, body: await repo.getTodos() } as const)

type GetTodo = ServerInferRoute<typeof contract.getTodo>
const getTodo: GetTodo = async ({ params: { id } }) =>
  match(await repo.getTodoById(id))
    .with(P.not(P.nullish), (t) => ({ status: 200, body: t } as const))
    .otherwise(() => ({ status: 404, body: { message: "not found" } } as const))

type CreateTodo = ServerInferRoute<typeof contract.createTodo>
const createTodo: CreateTodo = ({ body }) =>
  repo
    .createTodo(body)
    .then((t) => ({ status: 201, body: t } as const))

type UpdateTodo = ServerInferRoute<typeof contract.updateTodo>
const updateTodo: UpdateTodo = async ({ params: { id }, body }) =>
  match(await repo.updateTodoById({ ...body, id }))
    .with(P.not(P.nullish), (t) => ({ status: 200, body: t } as const))
    .otherwise(() => ({ status: 404, body: { message: "not found" } } as const))

type DeleteTodo = ServerInferRoute<typeof contract.deleteTodo>
const deleteTodo: DeleteTodo = async ({ params: { id } }) =>
  match(await repo.deleteTodoById(id))
    .with(P.not(P.nullish), (t) => ({ status: 200, body: t } as const))
    .otherwise(() => ({ status: 404, body: { message: "not found" } } as const))

const router = s.router(contract, {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
})

createExpressEndpoints(contract, router, app, {
  requestValidationErrorHandler: "combined",
  responseValidation: true,
})

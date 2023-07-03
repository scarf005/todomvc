import { zodiosApp } from "npm:@zodios/express"
// @deno-types=npm:@types/express
import express from "npm:express"
// @deno-types=npm:@types/swagger-ui-express
import * as swaggerUi from "npm:swagger-ui-express"

import { match, P } from "npm:ts-pattern@^5.0.1"

import { contract } from "./contract.ts"
import { openapi } from "./openapi.ts"

import * as repo from "../store.ts"

export const app = zodiosApp(contract)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use("/docs.json", (_, res) => res.send(openapi))
app.use("/docs", swaggerUi.serveFiles(undefined, { swaggerUrl: "/docs.json" }))
app.use("/docs", swaggerUi.setup(undefined, { swaggerUrl: "/docs.json"}))

app.get("/todos", async (_, res) => res.send(await repo.getTodos()))
app.get(
  "/todos/:id",
  async ({ params: { id } }, res) =>
    match(await repo.getTodoById(id.toString()))
      .with(P.not(P.nullish), (t) => res.send(t))
      .otherwise(() => res.status(404).send({ message: "not found" })),
)

app.post("/todos", ({ body }, res) =>
  repo
    .createTodo(body)
    .then((t) => res.status(201).send(t)))

app.put(
  "/todos/:id",
  async ({ params: { id }, body }, res) =>
    match(await repo.updateTodoById({ ...body, id: id.toString() }))
      .with(P.not(P.nullish), (t) => res.status(200).send(t))
      .otherwise(() => res.status(404).send({ message: "not found" })),
)

app.delete(
  "/todos/:id",
  async ({ params: { id } }, res) =>
    match(await repo.deleteTodoById(id.toString()))
      .with(P.not(P.nullish), (t) => res.status(200).send(t))
      .otherwise(() => res.status(404).send({ message: "not found" })),
)

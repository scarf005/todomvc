import { z } from "./deps.ts"

const examples = [
  {
    title: "hello",
    completed: true,
    id: "8a84d26c-c014-4a80-8709-2b44487e110d",
  },
  {
    title: "hello",
    completed: true,
    id: "5f976cd6-ff5c-4569-b310-f6763250c364",
  },
] satisfies Todo[]

export type Todo = z.infer<typeof todoSchema>
const todoSchema = z.object({
  id: z.string().uuid().describe("The unique identifier for a TODO"),
  title: z.string().describe("The title of the TODO").openapi({ example: "buy chicken!" }),
  completed: z.boolean().default(false).describe("Whether or not the TODO is completed"),
})

export const todoSchemaOpenapi = todoSchema.openapi({
  title: "Todo",
  description: "A single TODO",
  example: examples[0],
})

export const todosSchema = z.array(todoSchema).openapi({
  title: "Todos",
  description: "A list of all TODOs",
  examples,
})

export { todoSchemaOpenapi as todoSchema }

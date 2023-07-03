import { Todo } from "./todo.ts"
import { asynciter } from "./deps.ts"

const store = await Deno.openKv("store.sqlite3")

type TodoSelector = ["todos", string]

export const getTodos = async () => {
  const entries = store.list<Todo>({ prefix: ["todos"] satisfies [TodoSelector[0]] })

  return await asynciter(entries)
    .map(({ value }) => value)
    .collect()
}

export const getTodoById = async (id: string): Promise<Todo | null> =>
  (await store.get<Todo>(["todos", id] satisfies TodoSelector)).value

export const createTodo = async (todo: Omit<Todo, "id">): Promise<Todo> => {
  const id = crypto.randomUUID()
  const newTodo = { ...todo, id }

  await store.set(["todos", id] satisfies TodoSelector, newTodo)
  return newTodo
}

export const updateTodoById = async (
  { id, title, completed }: Pick<Todo, "id"> & Partial<Todo>,
): Promise<Todo | null> => {
  const current = (await store.get<Todo>(["todos", id] satisfies TodoSelector)).value
  if (!current) return null

  const updated = {
    id: current.id,
    title: title ?? current.title,
    completed: completed ?? current.completed,
  }
  await store.set(["todos", id] satisfies TodoSelector, updated)
  return updated
}

export const deleteTodoById = async (id: string): Promise<Todo | null> => {
  const current = await store.get<Todo>([id])
  if (!current) return null

  await store.delete([id])
  return current.value
}

if (import.meta.main) {
  const item1 = await createTodo({ title: "hello", completed: false })
  const item2 = await createTodo({ title: "world", completed: false })
  console.table(await getTodos())

  await updateTodoById({ id: item1.id, completed: true })
  console.log(await getTodoById(item1.id))
  console.log(await getTodoById("asdf"))

  await deleteTodoById(item2.id)
  console.table(await getTodos())

  store.close()
  await Deno.remove("store.sqlite3")
}

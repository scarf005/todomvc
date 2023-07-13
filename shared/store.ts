import { Maybe } from "npm:purify-ts/Maybe"
import { Todo } from "./todo.ts"

type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>

const store = new Map<string, Todo>()

export const getTodos = () => [...store.values()]
export const getTodoById = ({ id }: Pick<Todo, "id">) => Maybe.fromNullable(store.get(id))
export const createTodo = (todo: Omit<Todo, "id">) => {
  const id = crypto.randomUUID()
  const newTodo = { ...todo, id }

  store.set(id, newTodo)
  return newTodo
}

export const updateTodoById = ({ id, ...rest }: PartialExcept<Todo, "id">) =>
  Maybe.fromNullable(store.get(id))
    .map((prev) => ({ ...prev, ...rest }))
    .map((updated) => {
      store.set(id, updated)
      return updated
    })

export const deleteTodoById = ({ id }: Pick<Todo, "id">) =>
  Maybe.fromNullable(store.get(id))
    .map((prev) => {
      store.delete(id)
      return prev
    })

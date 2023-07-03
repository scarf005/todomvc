import { Zodios } from "npm:@zodios/axios"
import { contract } from "./contract.ts"

const userClient = new Zodios(`http://localhost:${9001}`, contract)

while (true) {
  const id = prompt("Enter user id: ")
  if (!id) {
    console.log("id is required")
    continue
  }
  // @ts-ignore: Error: Type 'string' is not assignable to type 'number'.
  const result = await userClient.get("/users/:id", { params: { id } })
  console.log(result)
}

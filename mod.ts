import { app as tsRestApp } from "./ts-rest/server.ts"
import { app as zodiosApp } from "./zodios/server.ts"

for (
  const { app, port, name } of [
    { app: tsRestApp, port: 9000, name: "ts-Rest" },
    { app: zodiosApp, port: 9001, name: "Zodios" },
  ]
) {
  app.listen(port, () => console.log(`${name} Server is running on port ${port}`))
}

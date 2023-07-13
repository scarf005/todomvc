import { client } from "./main"

function App() {
  const result = client.getTodo.useQuery(
    ["todos"],
    { params: { id: "1" } },
  )

  return (
    <div>
      <h1>Vite + React</h1>
      <code>
        {JSON.stringify(result, null, 2)}
      </code>
    </div>
  )
}

export default App

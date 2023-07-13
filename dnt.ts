import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts"

const outDir = "./contract"

await emptyDir(outDir)

await build({
  entryPoints: ["./ts-rest/contract.ts"],
  outDir,
  shims: {},
  test: false,
  packageManager: "pnpm",
  package: {
    name: "@contract/ts-rest",
    version: Deno.args[0] ?? "0.0.1",
    description: "But does it work on npm?",
    license: "agpl-3.0-only",
    repository: {
      type: "git",
      url: "git+https://github.com/scarf005/zodios-vs-ts-rest.git",
    },
    bugs: {
      url: "https://github.com/scarf005/zodios-vs-ts-rest/issues",
    },
    dependencies: {
      "@types/node": "^20.4.0",
    },
  },
})

import { BundlerOptions } from "../types"
import { getViteConfig } from "./config"

export async function build(options: BundlerOptions) {
  const vite = await import("vite")

  const viteConfig = await getViteConfig(options)

  try {
    await vite.build(
      vite.mergeConfig(viteConfig, { mode: "production", logLevel: "silent" })
    )
  } catch (error) {
    console.error(error)
    throw new Error("Failed to build admin panel")
  }
}

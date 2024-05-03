import { DocsConfig } from "types"
import { sidebarConfig } from "./sidebar"

export const config: DocsConfig = {
  titleSuffix: "Medusa Book",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  sidebar: sidebarConfig,
}

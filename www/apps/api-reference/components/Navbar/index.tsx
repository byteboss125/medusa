"use client"

import {
  Navbar as UiNavbar,
  getNavbarItems,
  usePageLoading,
  useSidebar,
} from "docs-ui"
import FeedbackModal from "./FeedbackModal"
import { useMemo } from "react"
import { config } from "../../config"
import { usePathname } from "next/navigation"
import VersionSwitcher from "../VersionSwitcher"
import { useVersion } from "../../providers/version"

const Navbar = () => {
  const { setMobileSidebarOpen, mobileSidebarOpen } = useSidebar()
  const pathname = usePathname()
  const { isLoading } = usePageLoading()
  const { isVersioningEnabled } = useVersion()

  const navbarItems = useMemo(
    () =>
      getNavbarItems({
        basePath: config.baseUrl,
        activePath: pathname,
      }),
    [pathname]
  )

  return (
    <UiNavbar
      logo={{
        light: "/images/logo-icon.png",
        dark: "/images/logo-icon-dark.png",
      }}
      items={navbarItems}
      mobileMenuButton={{
        setMobileSidebarOpen,
        mobileSidebarOpen,
      }}
      additionalActionsBefore={
        <>{isVersioningEnabled && <VersionSwitcher />}</>
      }
      additionalActionsAfter={<FeedbackModal />}
      isLoading={isLoading}
    />
  )
}

export default Navbar

import React from "react"
import clsx from "clsx"
import { useModal } from "@/providers"
import { Button } from "@/components"
import { XMark } from "@medusajs/icons"

export type ModalHeaderProps = {
  title?: string
}

export const ModalHeader = ({ title }: ModalHeaderProps) => {
  const { closeModal } = useModal()

  return (
    <div
      className={clsx(
        "border-medusa-border-base dark:border-medusa-border-base-dark border-0 border-b border-solid py-docs_1.5 px-docs_2",
        "flex items-center justify-between"
      )}
    >
      <span
        className={clsx(
          "text-medusa-fg-base dark:text-medusa-fg-base-dark text-h2"
        )}
      >
        {title}
      </span>
      <Button
        variant="clear"
        className="cursor-pointer"
        onClick={() => closeModal()}
      >
        <XMark />
      </Button>
    </div>
  )
}

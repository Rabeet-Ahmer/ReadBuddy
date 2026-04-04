"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

/**
 * Renders a styled separator element with an optional `className` override and selectable `orientation`.
 *
 * @param className - Additional CSS classes to merge with the component's built-in styles.
 * @param orientation - Separator orientation, either `"horizontal"` or `"vertical"`. Defaults to `"horizontal"`.
 * @returns A separator element with merged classes and the specified orientation.
 */
function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }

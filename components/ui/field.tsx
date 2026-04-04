"use client"

import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

/**
 * Renders a fieldset container for grouped form fields with layout and styling hooks.
 *
 * Applies a column flex layout, adjusts vertical gap when nested checkbox or radio groups
 * are present, sets `data-slot="field-set"`, merges caller `className`, and forwards all other props to the underlying `<fieldset>`.
 *
 * @returns The configured `<fieldset>` element
 */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-4 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a `<legend>` for a field with variant-driven typography and slot metadata.
 *
 * The rendered element includes `data-slot="field-legend"` and `data-variant` set to the provided `variant`.
 *
 * @param variant - Controls typography: `"legend"` uses base text size, `"label"` uses smaller text
 * @returns A `<legend>` element with appropriate `data-` attributes and merged `className`
 */
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a container div used to group related form fields and control responsive spacing and gaps.
 *
 * The element receives `data-slot="field-group"`, merges caller `className` with the component's layout classes, and forwards all other `div` props.
 *
 * @returns A `div` element configured as the field group container
 */
function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  "group/field flex w-full gap-2 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

/**
 * Renders a field grouping container that coordinates label, content, and state styling.
 *
 * @param orientation - Controls layout orientation: `"vertical"` stacks label above content, `"horizontal"` places them side-by-side, and `"responsive"` switches to horizontal at the medium breakpoint.
 * @returns The rendered field container element with `role="group"` and data attributes for slot and orientation.
 */
function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

/**
 * Renders a field content container that applies default layout and spacing.
 *
 * @returns A <div> element with `data-slot="field-content"` that applies a column flex layout, tight gap and line-height defaults, merges the provided `className`, and forwards remaining props.
 */
function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
        className
      )}
      {...props}
    />
  )
}

/**
 * Label component tailored for use inside Field layouts that applies field-specific layout and state-aware styling.
 *
 * @returns A `Label` element with `data-slot="field-label"` and predefined classes that adapt to parent field state and layout.
 */
function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a field title element used as the label/heading for a Field.
 *
 * Adds `data-slot="field-label"` and applies text size, medium font weight, spacing,
 * and reduced opacity when the parent field is disabled. Merges any caller `className`
 * into the component's classes and forwards remaining div props.
 *
 * @returns The rendered `div` element for the field title
 */
function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a styled paragraph used for a field's descriptive text.
 *
 * Renders a <p> with `data-slot="field-description"` and utility classes that control spacing, typography, link appearance, and responsive layout adjustments.
 *
 * @returns The rendered paragraph element for use as a field description.
 */
function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a horizontal separator with an optional centered label.
 *
 * When `children` is provided, the separator shows a centered content capsule over the line.
 * The root element includes `data-slot="field-separator"` and `data-content` (true when `children` exists).
 *
 * @param children - Optional content to display centered on the separator line.
 * @param className - Additional CSS classes to apply to the root container.
 * @returns A `div` containing a positioned `Separator` and, if present, a centered label wrapper.
 */
function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

/**
 * Render field-level validation messages or provided children.
 *
 * If `children` is provided it is used as the rendered content. Otherwise `errors`
 * (if present) are deduplicated by `message` and rendered: a single unique message
 * is shown as plain text; multiple messages are rendered as a bulleted list.
 *
 * @param children - Custom content to display instead of deriving content from `errors`.
 * @param errors - Optional array of error objects; each object's `message` (if any) is used for display and deduplication.
 * @returns A JSX element containing the error content, or `null` when there is no content to render.
 */
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-sm font-normal text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "../../lib/utils"

const AccordionContext = React.createContext<{
    openValue?: string | string[]
    setOpenValue: (value: string) => void
    type?: "single" | "multiple"
} | null>(null)

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        type?: "single" | "multiple"
        defaultValue?: string | string[]
        collapsible?: boolean
    }
>(({ className, type = "single", defaultValue, children, ...props }, ref) => {
    const [value, setValue] = React.useState<string | string[] | undefined>(defaultValue)

    const handleValueChange = (itemValue: string) => {
        if (type === "single") {
            setValue(prev => prev === itemValue ? undefined : itemValue)
        } else {
            setValue(prev => {
                const current = Array.isArray(prev) ? prev : (prev ? [prev] : [])
                return current.includes(itemValue)
                    ? current.filter(v => v !== itemValue)
                    : [...current, itemValue]
            })
        }
    }

    return (
        <AccordionContext.Provider value={{ openValue: value, setOpenValue: handleValueChange, type }}>
            <div ref={ref} className={cn("space-y-1", className)} {...props}>
                {children}
            </div>
        </AccordionContext.Provider>
    )
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
    return (
        <div ref={ref} className={cn("border-b", className)} data-value={value} {...props}>
            {children}
        </div>
    )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const context = React.useContext(AccordionContext)
    // Logic to determine if open based on context (simplified for custom implementation)
    // In a real radix implementation, this is handled internally. Here we need to check parent.
    // However, simpler is just to let the user click. We need to find the parent value context though.
    // To avoid complex context nesting without radix, we rely on the button onClick.
    // But wait, the Trigger needs to know 'which' item it belongs to.
    // With custom implementation without context for Item, we can't easily do this cleanly like Radix.

    // Re-thinking: A recursive search or context for Item is needed.
    // Let's add ItemContext.
    return (
        <div className="flex">
            <AccordionTriggerButton className={className} ref={ref} {...props}>{children}</AccordionTriggerButton>
        </div>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

// Helper for the actual button inside trigger to capture the item context
const AccordionItemContext = React.createContext<string | null>(null)

// Redefine Item to provide context
const AccordionItemWrapper = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
    return (
        <AccordionItemContext.Provider value={value}>
            <div ref={ref} className={cn("border-b", className)} {...props}>
                {children}
            </div>
        </AccordionItemContext.Provider>
    )
})
AccordionItemWrapper.displayName = "AccordionItem"

const AccordionTriggerButton = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
    const { openValue, setOpenValue, type } = React.useContext(AccordionContext)!
    const value = React.useContext(AccordionItemContext)!

    const isOpen = type === "single"
        ? openValue === value
        : (Array.isArray(openValue) && openValue.includes(value))

    return (
        <button
            ref={ref}
            onClick={(e) => {
                setOpenValue(value)
                onClick?.(e)
            }}
            className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                className
            )}
            data-state={isOpen ? "open" : "closed"}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
        </button>
    )
})
AccordionTriggerButton.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { openValue, type } = React.useContext(AccordionContext)!
    const value = React.useContext(AccordionItemContext)!

    const isOpen = type === "single"
        ? openValue === value
        : (Array.isArray(openValue) && openValue.includes(value))

    if (!isOpen) return null

    return (
        <div
            ref={ref}
            className={cn(
                "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
                className
            )}
            {...props}
        >
            <div className="pb-4 pt-0">{children}</div>
        </div>
    )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItemWrapper as AccordionItem, AccordionTriggerButton as AccordionTrigger, AccordionContent }

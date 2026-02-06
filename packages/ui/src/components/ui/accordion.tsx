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

const AccordionItemContext = React.createContext<string | null>(null)

const AccordionItem = React.forwardRef<
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
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, onClick, ...props }, ref) => {
    const accordionContext = React.useContext(AccordionContext)
    const itemValue = React.useContext(AccordionItemContext)

    if (!accordionContext || itemValue === null) {
        throw new Error("AccordionTrigger must be used within AccordionItem and Accordion")
    }

    const { openValue, setOpenValue, type } = accordionContext

    const isOpen = type === "single"
        ? openValue === itemValue
        : (Array.isArray(openValue) && openValue.includes(itemValue))

    return (
        <div className="flex">
            <button
                ref={ref}
                onClick={(e) => {
                    setOpenValue(itemValue)
                    onClick?.(e)
                }}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 w-full",
                    className
                )}
                data-state={isOpen ? "open" : "closed"}
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
        </div>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const accordionContext = React.useContext(AccordionContext)
    const itemValue = React.useContext(AccordionItemContext)

    if (!accordionContext || itemValue === null) {
        return null
    }

    const { openValue, type } = accordionContext

    const isOpen = type === "single"
        ? openValue === itemValue
        : (Array.isArray(openValue) && openValue.includes(itemValue))

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

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

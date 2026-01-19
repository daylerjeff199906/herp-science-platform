import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Landmark,
    Layers,
    Map,
    PieChart,
    Database,
    Settings2,
    SquareTerminal,
    type LucideIcon,
} from 'lucide-react'

export const iconMap = {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Landmark,
    Layers,
    Map,
    PieChart,
    Database,
    Settings2,
    SquareTerminal,
} as const

export type IconName = keyof typeof iconMap

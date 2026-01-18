export interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
}

export interface HeaderProps {
    transparent?: boolean;
}

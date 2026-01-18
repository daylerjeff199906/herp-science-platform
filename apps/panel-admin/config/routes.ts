export const ROUTES = {
    TAXONOMY: {
        CLASSES: '/taxonomy/classes',
        ORDERS: '/taxonomy/orders',
        FAMILIES: '/taxonomy/families',
        GENERA: '/taxonomy/genera',
        SPECIES: '/taxonomy/species',
        SEXES: '/taxonomy/sexes',
    },
    GEOGRAPHY: {
        COUNTRIES: '/geography/countries',
        DEPARTMENTS: '/geography/departments',
        PROVINCES: '/geography/provinces',
        DISTRICTS: '/geography/districts',
        LOCALITIES: '/geography/localities',
    },
    ENTITIES: {
        INSTITUTIONS: '/entities/institutions',
        MUSEUMS: '/entities/museums',
        COLLECTORS: '/entities/collectors',
        FOREST_TYPES: '/entities/forest-types',
    },
    CORE: {
        INDIVIDUALS: '/core/individuals',
        IDENTIFIERS: '/core/identifiers',
    },
} as const

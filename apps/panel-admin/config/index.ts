export * from './routes'
import { ROUTES } from './routes'

// Helper to generate consistent API endpoints
const createEndpointConfig = (resource: string) => ({
    urlApi: `/${resource}`,
    urlApiAdmin: `/admin/${resource}`,
    changeStatusApi: `/admin/${resource}/status`,
    restoreApi: `/admin/${resource}/restore`,
})

export const ApiUrl = {
    taxonomy: {
        classes: createEndpointConfig('classes'),
        orders: createEndpointConfig('orders'),
        families: createEndpointConfig('families'),
        genera: createEndpointConfig('genera'),
        species: createEndpointConfig('species'),
        sexes: createEndpointConfig('sexes'),
    },
    location: {
        countries: createEndpointConfig('countries'),
        departments: createEndpointConfig('departments'),
        provinces: createEndpointConfig('provinces'),
        districts: createEndpointConfig('districts'),
        localities: createEndpointConfig('localities'),
    },
    entities: {
        institutions: createEndpointConfig('institutions'),
        museums: createEndpointConfig('museums'),
        collectors: createEndpointConfig('collectors'),
        forestTypes: createEndpointConfig('forest-types'),
    },
    core: {
        individuals: createEndpointConfig('individuals'),
        identifiers: createEndpointConfig('identifiers'),
    },
} as const

export const ADMIN_URLS = {
    TAXONOMY: {
        CLASSES: ROUTES.TAXONOMY.CLASSES,
        ORDERS: ROUTES.TAXONOMY.ORDERS,
        FAMILIES: ROUTES.TAXONOMY.FAMILIES,
        GENERA: ROUTES.TAXONOMY.GENERA,
        SPECIES: ROUTES.TAXONOMY.SPECIES,
        SEXES: ROUTES.TAXONOMY.SEXES,
    },
    LOCATIONS: {
        COUNTRIES: ROUTES.GEOGRAPHY.COUNTRIES,
        DEPARTMENTS: ROUTES.GEOGRAPHY.DEPARTMENTS,
        PROVINCES: ROUTES.GEOGRAPHY.PROVINCES,
        DISTRICTS: ROUTES.GEOGRAPHY.DISTRICTS,
        LOCALITIES: ROUTES.GEOGRAPHY.LOCALITIES,
    },
    ENTITIES: {
        INSTITUTIONS: ROUTES.ENTITIES.INSTITUTIONS,
        MUSEUMS: ROUTES.ENTITIES.MUSEUMS,
        COLLECTORS: ROUTES.ENTITIES.COLLECTORS,
        FOREST_TYPES: ROUTES.ENTITIES.FOREST_TYPES,
    },
    CORE: {
        INDIVIDUALS: ROUTES.CORE.INDIVIDUALS,
        IDENTIFIERS: ROUTES.CORE.IDENTIFIERS,
    },
} as const

const route_base = 'dashboard'

export const ROUTES = {
  TAXONOMY: {
    CLASSES: `/${route_base}/taxonomy/classes`,
    ORDERS: `/${route_base}/taxonomy/orders`,
    FAMILIES: `/${route_base}/taxonomy/families`,
    GENERA: `/${route_base}/taxonomy/genera`,
    SPECIES: `/${route_base}/taxonomy/species`,
    SEXES: `/${route_base}/taxonomy/sexes`,
  },
  GEOGRAPHY: {
    COUNTRIES: `/${route_base}/geography/countries`,
    DEPARTMENTS: `/${route_base}/geography/departments`,
    PROVINCES: `/${route_base}/geography/provinces`,
    DISTRICTS: `/${route_base}/geography/districts`,
    LOCALITIES: `/${route_base}/geography/localities`,
  },
  ENTITIES: {
    INSTITUTIONS: `/${route_base}/entities/institutions`,
    MUSEUMS: `/${route_base}/entities/museums`,
    COLLECTORS: `/${route_base}/entities/collectors`,
    FOREST_TYPES: `/${route_base}/entities/forest-types`,
  },
  CORE: {
    INDIVIDUALS: `/${route_base}/core/individuals`,
    IDENTIFIERS: `/${route_base}/core/identifiers`,
  },
} as const

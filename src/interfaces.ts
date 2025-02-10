
export interface SearchParams {
    cabinClass: string,
    adults: string,
    originSkyId: string,
    originEntityId: string,
    destinationSkyId: string,
    destinationEntityId: string,
    date: string
}

export interface SearchResult {
    price: string,
    tags: Array<string>,
    originName: string,
    destinationName: string,
    duration: string,
    stopCount: number,
    departure: string,
    arrival: string,
    carrierName: string,
    carrierLogo: string
}

export interface PlaceOption {
    skyId: string,
    entityId: string,
    placeType: string,
    title: string
}

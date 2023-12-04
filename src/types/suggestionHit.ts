export type SuggestionHit= {
    nb_words: number;
    objectID: string;
    popularity: number;
    products?: Product
    prod_products?: Product
    query: string;
    _highlightResult: {
        query: {
            fullyHighlighted: boolean;
            matchLevel: string;
            matchedWords: string[];
            value: string;
        };
    };
}

export type Product= {
    exact_nb_hits: number;
        facets: {
            analytics: {
                brand: string[];
                category: {
                    attribute: string;
                    operator: string;
                    value: string;
                    count: number;
                }[];
            };
            exact_matches: {
                brand: {
                    value: string;
                    count: number;
                }[];
                category: {
                    value: string;
                    count: number;
                }[];
            };
        };
}

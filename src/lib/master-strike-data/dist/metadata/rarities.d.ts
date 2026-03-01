/**
 * Metadata of a card rarity.
 */
export interface RarityMetadata {
    id: number;
    value: string;
    label: string;
    qtdLabel: string;
}
export interface RarityMetadataMap {
    [key: string]: RarityMetadata;
}
/**
 * Object with the metadata of card rarities.
 */
export declare const rarities: Readonly<RarityMetadataMap>;
/**
 * Array with the metadata of card rarities. The first item corresponds to id one and it represents a common card.
 */
export declare const raritiesArray: Readonly<RarityMetadata[]>;

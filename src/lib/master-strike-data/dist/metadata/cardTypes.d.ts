/**
 * Metadata of a card type.
 */
export interface CardTypeMetadata {
    id: number;
    value: string;
    label: string;
}
export interface CardTypeMetadataMap {
    [key: string]: CardTypeMetadata;
}
/**
 * Object with the metadata of card types.
 */
export declare const cardTypes: Readonly<CardTypeMetadataMap>;
export interface CardSubTypeMetadata {
    id: number;
    label: string;
}
export interface CardSubTypeMetadataMap {
    [key: string]: CardSubTypeMetadata;
}
/**
 * Object with the metadata of card sub-types.
 */
export declare const cardSubTypes: Readonly<CardSubTypeMetadataMap>;

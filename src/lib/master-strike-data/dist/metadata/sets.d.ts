/**
 * Metadata of a card set.
 */
export interface CardSetMetadata {
    id: number;
    value: string;
    label: string;
    initials: string;
    cardTypes: number[];
}
export interface SetMetadataMap {
    [key: string]: CardSetMetadata;
}
/**
 * Object with the metadata of card sets.
 */
export declare const sets: Readonly<SetMetadataMap>;
/**
 * Array with the metadata of card sets. The first item corresponds to id one and it represents the core set.
 */
export declare const setsArray: Readonly<CardSetMetadata[]>;

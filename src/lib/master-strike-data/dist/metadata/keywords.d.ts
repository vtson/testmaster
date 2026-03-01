/**
 * Metadata of a keyword.
 */
export interface KeywordMetadata {
    id: number;
    value: string;
    label: string;
    cardTypes: number[];
}
export interface KeywordMetadataMap {
    [key: string]: KeywordMetadata;
}
/**
 * Object with the metadata of keywords.
 */
export declare const keywords: Readonly<KeywordMetadataMap>;
/**
 * Array with the metadata of keywords. The first item corresponds to id one and it represents the keyword teleport.
 */
export declare const keywordsArray: Readonly<KeywordMetadata[]>;

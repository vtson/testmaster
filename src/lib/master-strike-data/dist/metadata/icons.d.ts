/**
 * Metadata of an icon.
 */
export interface IconMetadata {
    id: number;
    value: string;
    label: string;
}
export interface IconMetadataMap {
    [key: string]: IconMetadata;
}
/**
 * Object with the metadata of icons.
 */
export declare const icons: Readonly<IconMetadataMap>;
/**
 * Array with the metadata of icons. The first item corresponds to id one and it represents the attack icon.
 */
export declare const iconsArray: Readonly<IconMetadata[]>;

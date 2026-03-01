/**
 * Metadata of a hero class.
 */
export interface HeroClassMetadata {
    id: number;
    value: string;
    label: string;
    bgColor: string;
}
export interface HeroClassMetadataMap {
    [key: string]: HeroClassMetadata;
}
/**
 * Object with the metadata of hero classes.
 */
export declare const heroClasses: Readonly<HeroClassMetadataMap>;
/**
 * Array with the metadata of hero classes. The first item corresponds to id zero and it represents no hero class.
 */
export declare const heroClassesArray: Readonly<HeroClassMetadata[]>;

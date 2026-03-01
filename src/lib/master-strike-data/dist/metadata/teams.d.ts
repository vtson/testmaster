/**
 * Metadata of a hero team.
 */
export interface TeamMetadata {
    id: number;
    value: string;
    label: string;
}
export interface TeamMetadataMap {
    [key: string]: TeamMetadata;
}
/**
 * Object with the metadata of hero teams.
 */
export declare const teams: Readonly<TeamMetadataMap>;
/**
 * Array with the metadata of icons. The first item corresponds to id zero and it represents an unaffiliated hero.
 */
export declare const teamsArray: Readonly<TeamMetadata[]>;

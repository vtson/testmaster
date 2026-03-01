/**
 * Metadata of a rule.
 */
export interface RuleMetadata {
    id: number;
    value: string;
    label: string;
    cardTypes: number[];
}
export interface RuleMetadataMap {
    [key: string]: RuleMetadata;
}
/**
 * Object with the metadata of rules.
 */
export declare const rules: Readonly<RuleMetadataMap>;
/**
 * Array with the metadata of rules. The first item corresponds to id one and it represents the shards rules.
 */
export declare const rulesArray: Readonly<RuleMetadata[]>;

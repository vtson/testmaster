import { setsArray } from '../../metadata';
import { processHenchman } from './henchmenProcessor';
import { processHero } from './heroProcessor';
import { processMastermind } from './mastermindProcessor';
import { processScheme } from './schemeProcessor';
import { processVillain } from './villainProcessor';
import { processBystander } from './bystanderProcessor';
import { processWound } from './woundProcessor';
export const processSet = (addCard, set) => {
    set.heroes?.forEach(hero => processHero(addCard, hero, set));
    set.masterminds?.forEach(mm => processMastermind(addCard, mm, set));
    set.henchmen?.forEach(henchman => processHenchman(addCard, henchman, set));
    set.villains?.forEach(villain => processVillain(addCard, villain, set));
    set.schemes?.forEach(scheme => processScheme(addCard, scheme, set));
    set.bystanders?.forEach(bystander => processBystander(addCard, bystander, set));
    set.wounds?.forEach(wound => processWound(addCard, wound, set));
};
export const setIdToLabel = (id) => setsArray[id - 1].label;
export const getSets = (setId, override) => {
    if (!override || typeof override === 'number')
        return [override || setId];
    const ids = override.filter(id => id !== 9 && id != 20); // 3d and ms phase 1 not considered
    return ids;
};
export { processRules } from './rulesProcessor';
//# sourceMappingURL=index.js.map
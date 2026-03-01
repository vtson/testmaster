import { getSets, setIdToLabel } from ".";
import { Subtitles } from "../../utils";
import { CardDetailsType, CardType } from "../cardSearchTypes";
import { toHeroCardDetails } from "./heroProcessor";
import { toVillainCardDetails } from "./villainProcessor";
const vAttack = (card, mm) => (card.vAttack || mm?.vAttack || '') + (card.vAttackAsterisk ? '*' : '');
export const toMastermindCardDetails = (card, detailsType, mm) => {
    const vp = (card.vp || mm?.vp);
    const vpS = vp + '';
    return {
        detailsType,
        vAttack: vAttack(card, mm),
        vp: ((!vp || vpS === '-1') ? '' : vpS),
        tactic: card.tactic,
        epic: card.epic,
        description: card.abilities,
    };
};
export const processMastermind = (addCard, mm, set) => {
    mm.cards?.forEach(card => {
        let details;
        const oopHero = card;
        const oopVillain = card;
        const mmCard = card;
        if (oopHero && oopHero.overrideType === 1) {
            details = {
                ...toHeroCardDetails(oopHero, CardDetailsType.OopHeroDetails),
                vAttack: vAttack(oopHero, mm),
                tactic: oopHero.tactic,
            };
        }
        else if (oopVillain && oopVillain.overrideType === 4) {
            details = {
                ...toVillainCardDetails(oopVillain, CardDetailsType.OopVillainDetails),
                tactic: oopVillain.tactic,
            };
        }
        else {
            details = toMastermindCardDetails(mmCard, CardDetailsType.MastermindCardDetails, mm);
        }
        getSets(set.id, mm.set).forEach(setId => {
            addCard({
                name: card.name,
                subtitle: Subtitles.mastermindSubtitle(card, mm, setId),
                imageUrl: card.imageUrl || '',
                set: setIdToLabel(setId),
                type: details.tactic ? CardType.MastermindTactic : CardType.Mastermind,
                group: mm.name,
                details,
            });
        });
    });
};
//# sourceMappingURL=mastermindProcessor.js.map
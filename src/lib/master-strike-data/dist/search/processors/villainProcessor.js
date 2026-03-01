import { setIdToLabel } from ".";
import { Subtitles } from "../../utils";
import { CardDetailsType, CardType } from "../cardSearchTypes";
import { toHeroCardDetails } from "./heroProcessor";
import { toSchemeCardDetails } from "./schemeProcessor";
const vAttack = (card) => (card.vAttack || '') + (card.vAttackAsterisk ? '*' : '');
export const toVillainCardDetails = (card, detailsType) => {
    const vp = card.vp + '';
    return {
        detailsType,
        qtd: card.qtd,
        vAttack: vAttack(card),
        vp: (!card.vp || vp === '-1' ? '' : vp),
        description: card.abilities,
    };
};
export const processVillain = (addCard, villain, set) => {
    villain.cards?.forEach(card => {
        let details;
        const villainCard = card;
        const oopHero = card;
        const oopScheme = card;
        if (oopHero && oopHero.overrideType === 1) {
            details = {
                ...toHeroCardDetails(oopHero, CardDetailsType.OopHeroDetails),
                vAttack: vAttack(oopHero),
            };
        }
        else if (oopScheme && oopScheme.overrideType === 5) {
            details = {
                ...toSchemeCardDetails(oopScheme, CardDetailsType.OopSchemeDetails),
                ambush: oopScheme.ambush,
            };
        }
        else {
            details = toVillainCardDetails(villainCard, CardDetailsType.VillainCardDetails);
        }
        addCard({
            name: card.name ?? '',
            subtitle: Subtitles.villainSubtitle(card, villain, set.id),
            imageUrl: card.imageUrl || '',
            set: setIdToLabel(set.id),
            type: CardType.Villain,
            group: villain.name,
            details,
        });
    });
};
//# sourceMappingURL=villainProcessor.js.map
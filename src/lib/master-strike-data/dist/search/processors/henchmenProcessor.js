import { getSets, setIdToLabel } from ".";
import { Subtitles } from "../../utils";
import { CardDetailsType, CardType } from "../cardSearchTypes";
import { toHeroCardDetails } from "./heroProcessor";
export const processHenchman = (addCard, henchman, set) => {
    henchman.cards?.forEach(card => {
        let details;
        const oopHero = card;
        const henchmanCard = card;
        const vAttack = (henchman.vAttack || '') + (henchmanCard.vAttackAsterisk ? '*' : '');
        if (oopHero && oopHero.overrideType === 1) {
            details = {
                ...toHeroCardDetails(oopHero, CardDetailsType.OopHeroDetails),
                vAttack,
            };
        }
        else {
            details = {
                detailsType: CardDetailsType.HenchmanCardDetails,
                vAttack,
                vp: henchman.vp + '',
                description: card.abilities,
            };
        }
        getSets(set.id, henchman.set).forEach(setId => {
            addCard({
                name: card.name || henchman.name,
                subtitle: Subtitles.henchmanSubtitle(card, henchman, setId),
                imageUrl: card.imageUrl || henchman.imageUrl || '',
                set: setIdToLabel(setId),
                type: CardType.Henchmen,
                group: henchman.name,
                details,
            });
        });
    });
};
//# sourceMappingURL=henchmenProcessor.js.map
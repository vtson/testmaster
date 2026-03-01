import { getSets, setIdToLabel } from ".";
import { Subtitles } from "../../utils";
import { CardDetailsType, CardType } from "../cardSearchTypes";
import { toHeroCardDetails } from "./heroProcessor";
export const processBystander = (addCard, bystander, set) => {
    bystander.cards?.forEach(card => {
        let details;
        const oopHero = card;
        const bystanderCard = card;
        if (oopHero && oopHero.overrideType === 1) {
            details = toHeroCardDetails(oopHero, CardDetailsType.OopHeroDetails);
        }
        else {
            details = {
                detailsType: CardDetailsType.BystanderCardDetail,
                qtd: bystanderCard.qtd,
                vp: bystander.vp + '',
                description: bystanderCard.abilities,
            };
        }
        getSets(set.id, bystander.set).forEach(setId => {
            addCard({
                name: bystander.name,
                subtitle: Subtitles.bystanderSubtitle(card),
                imageUrl: card.imageUrl || bystander.imageUrl || '',
                set: setIdToLabel(setId),
                type: CardType.Bystander,
                group: 'Bystanders',
                details,
            });
        });
    });
};
//# sourceMappingURL=bystanderProcessor.js.map
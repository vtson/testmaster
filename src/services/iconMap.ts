/**
 * Maps metadata `value` keys to their icon paths in /img/.
 */

const iconFiles: Record<string, string> = {
    // Sets
    '2099': '/img/2099.3a6ddc84.svg',
    '3d': '/img/3d.f971c55b.svg',
    'annihilation': '/img/annihilation.a4a72f8d.svg',
    'antman': '/img/antman.2b63cf07.svg',
    'blackpanther': '/img/blackpanther.93b72246.svg',
    'blackwidow': '/img/blackwidow.354af7c9.svg',
    'captainamerica': '/img/captainamerica.3dc43f1f.svg',
    'champions': '/img/champions.fd4f3c37.svg',
    'civilwar': '/img/civilwar.b341bb83.svg',
    'coreset': '/img/coreset.30a3fadc.svg',
    'darkcity': '/img/darkcity.91c5abf3.svg',
    'deadpool': '/img/deadpool.fbf669e9.svg',
    'dimensions': '/img/dimensions.6f6ddaa9.svg',
    'doctorstrange': '/img/doctorstrange.54df4def.svg',
    'fearitself': '/img/fearitself.2987a153.svg',
    'ff': '/img/ff.8f046b05.svg',
    'gotg': '/img/gotg.f303ed13.svg',
    'heroesofasgard': '/img/heroesofasgard.82a4090e.svg',
    'intothecosmos': '/img/intothecosmos.3e9f1724.svg',
    'marvelstudios': '/img/marvelstudios.e44c5a9e.svg',
    'messiahcomplex': '/img/messiahcomplex.8dac074a.svg',
    'midnightsons': '/img/midnightsons.64f0945b.svg',
    'msaw': '/img/msaw.6816ed0a.svg',
    'msgotg': '/img/msgotg.2bec9ae0.svg',
    'msis': '/img/msis.db0ac471.svg',
    'mswi': '/img/mswi.9dd6937a.svg',
    'newmutants': '/img/newmutants.ac3f573c.svg',
    'noir': '/img/noir.1582f505.svg',
    'promo': '/img/promo.28625c8e.svg',
    'pttr': '/img/pttr.44009840.svg',
    'realmofkings': '/img/realmofkings.6eb7a6b6.svg',
    'revelations': '/img/revelations.4c0e7b1a.svg',
    'shield': '/img/shield.8600ba48.svg',
    'spiderhomecoming': '/img/spiderhomecoming.4f48af30.svg',
    'sw1': '/img/sw1.c853dc75.svg',
    'sw2': '/img/sw2.1b0a697f.svg',
    'venom': '/img/venom.de90e3c6.svg',
    'villains': '/img/villains.9f6f96eb.svg',
    'weaponx': '/img/weaponx.a7b5afd9.svg',
    'wwhulk': '/img/wwhulk.9755d608.svg',
    'xmen': '/img/xmen.465d5c26.svg',

    // Teams (new .team.svg naming)
    'unaffiliated': '/img/unaffiliated.0a852ddb.svg',
    'avengers': '/img/avengers.team.svg',
    'spider-friends': '/img/spider-friends.team.svg',
    'x-men': '/img/x-men.team.svg',
    'fantastic-four': '/img/fantastic-four.team.svg',
    'marvel-knights': '/img/marvel-knights.team.svg',
    'x-force': '/img/x-force.team.svg',
    'crime-syndicate': '/img/crime-syndicate.team.svg',
    'sinister-six': '/img/sinister-six.team.svg',
    'foes-of-asgard': '/img/foes-of-asgard.team.svg',
    'brotherhood': '/img/brotherhood.team.svg',
    'guardians-of-the-galaxy': '/img/guardians-of-the-galaxy.team.svg',
    'hydra': '/img/hydra.team.svg',
    'cabal': '/img/cabal.team.svg',
    'illuminati': '/img/illuminati.team.svg',
    'new-warriors': '/img/new-warriors.team.svg',
    'mercs-for-money': '/img/mercs-for-money.team.svg',
    'warbound': '/img/warbound.team.svg',
    'venomverse': '/img/venomverse.team.svg',
    'heroes-of-asgard': '/img/heroes-of-asgard.team.svg',
    'inhumans': '/img/inhumans.team.svg',
    'x-factor-investigations': '/img/x-factor-investigations.team.svg',
    'heroes-of-wakanda': '/img/heroes-of-wakanda.team.svg',
    'guardians-of-the-multiverse': '/img/guardians-of-the-multiverse.team.svg',
    'champions-team': '/img/champions.team.svg',
    'shield-team': '/img/shield.team.svg',
    'block': '/img/block.team.svg',

    // Hero Classes (new .heroclass.svg naming)
    'covert': '/img/covert.heroclass.svg',
    'instinct': '/img/instinct.heroclass.svg',
    'ranged': '/img/ranged.heroclass.svg',
    'strength': '/img/strength.svg',
    'tech': '/img/tech.heroclass.svg',

    // UI icons
    'attack': '/img/attack.ddf681f3.svg',
    'recruit': '/img/recruit.svg',
    'cost': '/img/cost.ad7d44c6.svg',
    'vp': '/img/vp.298ee87b.svg',
    'piercing': '/img/piercing.529f9b8c.svg',
    'common': '/img/common.219c2d4d.svg',
    'uncommon': '/img/uncommon.svg',
    'rare': '/img/rare.f72e2a77.svg',
    'token': '/img/token.72b9f5d3.svg',
}

/**
 * Get the icon URL for a metadata value key (set, team, or hero class).
 * Returns undefined if no icon is available.
 */
export function getIconUrl(value: string): string | undefined {
    return iconFiles[value]
}


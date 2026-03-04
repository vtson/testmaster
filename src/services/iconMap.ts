/**
 * Maps metadata `value` keys to their hashed SVG icon paths in /img/.
 * These icons were crawled from master-strike.com/img/.
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

    // Teams
    'unaffiliated': '/img/unaffiliated.0a852ddb.svg',
    'avengers': '/img/avengers.c902f54f.svg',
    'spider-friends': '/img/spider-friends.81b5bc1e.svg',
    'x-men': '/img/x-men.55c6c309.svg',
    'fantastic-four': '/img/fantastic-four.64fa7ea8.svg',
    'marvel-knights': '/img/marvel-knights.2c767ffb.svg',
    'x-force': '/img/x-force.fbc7e389.svg',
    'crime-syndicate': '/img/crime-syndicate.7fc683e1.svg',
    'sinister-six': '/img/sinister-six.f7bddb99.svg',
    'foes-of-asgard': '/img/foes-of-asgard.fd484166.svg',
    'brotherhood': '/img/brotherhood.1fe6b381.svg',
    'guardians-of-the-galaxy': '/img/guardians-of-the-galaxy.45fe61dc.svg',
    'hydra': '/img/hydra.05a79141.svg',
    'cabal': '/img/cabal.50366e22.svg',
    'illuminati': '/img/illuminati.e9705c94.svg',
    'new-warriors': '/img/new-warriors.2edbafe2.svg',
    'mercs-for-money': '/img/mercs-for-money.49cd0db0.svg',
    'warbound': '/img/warbound.a1e07bd3.svg',
    'venomverse': '/img/venomverse.90c2484a.svg',
    'heroes-of-asgard': '/img/heroes-of-asgard.e58bd546.svg',
    'inhumans': '/img/inhumans.11dd7edd.svg',
    'x-factor-investigations': '/img/x-factor-investigations.549095e5.svg',
    'heroes-of-wakanda': '/img/heroes-of-wakanda.98e30ec6.svg',
    'guardians-of-the-multiverse': '/img/guardians-of-the-multiverse.6fea1268.svg',

    // UI icons
    'attack': '/img/attack.ddf681f3.svg',
    'recruit': '/img/recruit.79a87efd.svg',
    'cost': '/img/cost.ad7d44c6.svg',
    'vp': '/img/vp.298ee87b.svg',
    'piercing': '/img/piercing.529f9b8c.svg',
    'strength': '/img/strength.0d48ab3c.svg',
    'instinct': '/img/instinct.f5f4050d.svg',
    'covert': '/img/covert.dbc41ed5.svg',
    'tech': '/img/tech.c17c4033.svg',
    'ranged': '/img/ranged.b299a2d9.svg',
    'common': '/img/common.219c2d4d.svg',
    'uncommon': '/img/uncommon.8292a197.svg',
    'rare': '/img/rare.f72e2a77.svg',
    'token': '/img/token.72b9f5d3.svg',
}

/**
 * Get the icon URL for a metadata value key (set or team).
 * Returns undefined if no icon is available.
 */
export function getIconUrl(value: string): string | undefined {
    return iconFiles[value]
}

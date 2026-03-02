export const MarvelStudios = {
    id: 20,
    heroes: [
        {
            id: -1,
            name: "Black Widow",
            set: 20,
            team: 1,
            cards: [
                {
                    name: "Dangerous Rescue",
                    imageUrl: "/CardImages/Heroes/black-widow-03-1.webp",
                    hc: 1,
                    rarity: 1,
                    cost: 3,
                    attack: "2",
                    abilities: [
                        [
                            { hc: 1 },
                            ": You may KO a card from your hand or discard pile. If you do, rescue a Bystander."
                        ]
                    ]
                },
                {
                    name: "Mission Accomplished",
                    imageUrl: "/CardImages/Heroes/black-widow-04-1.webp",
                    hc: 5,
                    rarity: 1,
                    cost: 2,
                    abilities: [
                        "Draw a Card.",
                        [
                            { hc: 5 },
                            ": Rescue a Bystander."
                        ]
                    ]
                },
                {
                    name: "Covert Operation",
                    imageUrl: "/CardImages/Heroes/black-widow-02-1.webp",
                    hc: 1,
                    rarity: 2,
                    cost: 4,
                    attack: "0+",
                    abilities: [
                        [
                            "You get ",
                            { bold: "+1" },
                            { icon: 1 },
                            " for each Bystander in your Victory Pile."
                        ]
                    ]
                },
                {
                    name: "Silent Sniper",
                    imageUrl: "/CardImages/Heroes/black-widow-01-1.webp",
                    hc: 1,
                    rarity: 3,
                    cost: 7,
                    attack: "4",
                    abilities: [
                        [
                            "Defeat a Villain or Mastermind that has a Bystander.",
                        ]
                    ]
                }
            ]
        },
        {
            id: -1,
            name: "Captain America",
            set: 20,
            team: 1,
            cards: [
                {
                    name: "Avengers Assemble!",
                    imageUrl: "/CardImages/Heroes/captain-america-03-1.webp",
                    hc: 2,
                    rarity: 1,
                    cost: 3,
                    recruit: "0+",
                    abilities: [
                        [
                            "You get ",
                            { bold: "+1" },
                            { icon: 2 },
                            " for each color of Hero you have."
                        ]
                    ]
                },
                {
                    name: "Perfect Teamwork",
                    imageUrl: "/CardImages/Heroes/captain-america-04-1.webp",
                    hc: 4,
                    rarity: 1,
                    cost: 4,
                    attack: "0+",
                    abilities: [
                        [
                            "You get ",
                            { bold: "+1" },
                            { icon: 1 },
                            " for each color of Hero you have."
                        ]
                    ]
                },
                {
                    name: "Diving Block",
                    imageUrl: "/CardImages/Heroes/captain-america-02-1.webp",
                    hc: 5,
                    rarity: 2,
                    cost: 6,
                    attack: "4",
                    abilities: [
                        [
                            "If you would gain a Wound, you may reveal this card and draw a card instead."
                        ]
                    ]
                },
                {
                    name: "A Day Unlike Any Other",
                    imageUrl: "/CardImages/Heroes/captain-america-01-1.webp",
                    hc: 1,
                    rarity: 3,
                    cost: 7,
                    attack: "3+",
                    abilities: [
                        [
                            { team: 1 },
                            ": You get ",
                            { bold: "+3" },
                            { icon: 1 },
                            " for each other ",
                            { team: 1 },
                            " you played this turn."
                        ]
                    ]
                }
            ]
        },
        {
            id: -1,
            name: "Hawkeye",
            set: 20,
            team: 1,
            cards: [
                {
                    name: "Quick Draw",
                    imageUrl: "/CardImages/Heroes/hawkeye-03-1.webp",
                    hc: 2,
                    rarity: 1,
                    cost: 3,
                    attack: "1",
                    abilities: [
                        [
                            "Draw a card.",
                        ]
                    ]
                },
                {
                    name: "Team Player",
                    imageUrl: "/CardImages/Heroes/hawkeye-04-1.webp",
                    hc: 5,
                    rarity: 1,
                    cost: 4,
                    attack: "2+",
                    abilities: [
                        [
                            { team: 1 },
                            ": You get ",
                            { bold: "+1" },
                            { icon: 1 },
                            "."
                        ]
                    ]
                },
                {
                    name: "Covering Fire",
                    imageUrl: "/CardImages/Heroes/hawkeye-02-1.webp",
                    hc: 5,
                    rarity: 2,
                    cost: 5,
                    attack: "3",
                    abilities: [
                        [
                            { hc: 5 },
                            ": Choose one: each other player draws a card or each other player discards a card."
                        ]
                    ]
                },
                {
                    name: "Impossible Trick Shot",
                    imageUrl: "/CardImages/Heroes/hawkeye-01-1.webp",
                    hc: 5,
                    rarity: 3,
                    cost: 7,
                    attack: "5",
                    abilities: [
                        [
                            "Whenever you defeat a Villain or Mastermind this turn, rescue three Bystanders.",
                        ]
                    ]
                }
            ]
        },
        {
            id: -1,
            name: "Hulk",
            set: 20,
            team: 1,
            cards: [
                {
                    name: "Growing Anger",
                    imageUrl: "/CardImages/Heroes/hulk-03-1.webp",
                    hc: 4,
                    rarity: 1,
                    cost: 3,
                    attack: "2+",
                    abilities: [
                        [
                            { hc: 4 },
                            ": You get ",
                            { bold: "+1" },
                            { icon: 1 },
                            "."
                        ]
                    ]
                },
                {
                    name: "Unstoppable Hulk",
                    imageUrl: "/CardImages/Heroes/hulk-04-1.webp",
                    hc: 2,
                    rarity: 1,
                    cost: 4,
                    attack: "2+",
                    abilities: [
                        [
                            "You may KO a Wound from your hand or discard pile. If you do, you get ",
                            { bold: "+2" },
                            { icon: 1 },
                            "."
                        ]
                    ]
                },
                {
                    name: "Crazed Rampage",
                    imageUrl: "/CardImages/Heroes/hulk-02-1.webp",
                    hc: 4,
                    rarity: 2,
                    cost: 5,
                    attack: "4",
                    abilities: [
                        [
                            "Each player gains a Wound."
                        ]
                    ]
                },
                {
                    name: "Hulk Smash!",
                    imageUrl: "/CardImages/Heroes/hulk-01-1.webp",
                    hc: 4,
                    rarity: 3,
                    cost: 8,
                    attack: "5+",
                    abilities: [
                        [
                            { hc: 4 },
                            ": You get ",
                            { bold: "+5" },
                            { icon: 1 },
                            "."
                        ]
                    ]
                }
            ]
        },
        {
            id: -1,
            name: "Iron Man",
            set: 20,
            team: 1,
            cards: [
                {
                    name: "Endless Invention",
                    imageUrl: "/CardImages/Heroes/iron-man-04-1.webp",
                    hc: 5,
                    rarity: 1,
                    cost: 3,
                    abilities: [
                        [
                            "Draw a card."
                        ],
                        [
                            { hc: 5 },
                            ": Draw another card."
                        ]
                    ]
                },
                {
                    name: "Repulsor Rays",
                    imageUrl: "/CardImages/Heroes/iron-man-03-1.webp",
                    hc: 3,
                    rarity: 1,
                    cost: 3,
                    attack: "2+",
                    abilities: [
                        [
                            { hc: 3 },
                            ": You get ",
                            { bold: "+1" },
                            { icon: 1 },
                            "."
                        ]
                    ]
                },
                {
                    name: "Arc Reactor",
                    imageUrl: "/CardImages/Heroes/iron-man-02-1.webp",
                    hc: 5,
                    rarity: 2,
                    cost: 5,
                    attack: "3+",
                    abilities: [
                        [
                            { hc: 5 },
                            ": You get ",
                            { bold: "+1" },
                            { icon: 1 },
                            " for each other",
                            { hc: 5 },
                            " Hero you played this turn."
                        ]
                    ]
                },
                {
                    name: "Quantum Breakthrough",
                    imageUrl: "/CardImages/Heroes/iron-man-01-1.webp",
                    hc: 5,
                    rarity: 3,
                    cost: 7,
                    abilities: [
                        "Draw two cards.",
                        [
                            { hc: 5 },
                            ": Draw two more cards."
                        ]
                    ]
                }
            ]
        },
        {
            id: -1,
            name: "Nick Fury",
            set: 20,
            team: 2,
            cards: [
                {
                    name: "Battlefield Promotion",
                    imageUrl: "/CardImages/Heroes/nick-fury-03-2.webp",
                    hc: 1,
                    rarity: 1,
                    cost: 4,
                    abilities: [
                        [
                            "You may KO a ",
                            { team: 2 },
                            " Hero from your hand or discard pile. If you do, you may gain a S.H.I.E.L.D. Officer to your hand."
                        ]
                    ]
                },
                {
                    name: "High-Tech Weaponry",
                    imageUrl: "/CardImages/Heroes/nick-fury-04-2.webp",
                    hc: 5,
                    rarity: 1,
                    cost: 3,
                    attack: "2+",
                    abilities: [
                        [
                            { hc: 5 },
                            ": You get ",
                            { bold: "+1" },
                            { icon: 1 },
                            "."
                        ]
                    ]
                },
                {
                    name: "Legendary Commander",
                    imageUrl: "/CardImages/Heroes/nick-fury-02-2.webp",
                    hc: 4,
                    rarity: 2,
                    cost: 6,
                    attack: "1+",
                    abilities: [
                        [
                            "You get ",
                            { bold: "+1" },
                            { icon: 1 },
                            " for each other",
                            { team: 2 },
                            " Hero you played this turn."
                        ]
                    ]
                },
                {
                    name: "Pure Fury",
                    imageUrl: "/CardImages/Heroes/nick-fury-01-2.webp",
                    hc: 5,
                    rarity: 3,
                    cost: 8,
                    abilities: [
                        [
                            "Defeat any Villain or Mastermind whose ",
                            { icon: 1 },
                            " is less than the number of ",
                            { team: 2 },
                            " Heroes in the KO pile."
                        ]
                    ]
                }
            ]
        },
        {
            id: -1,
            name: "Thor",
            set: 20,
            team: 1,
            cards: [
                {
                    name: "Odinson",
                    imageUrl: "/CardImages/Heroes/thor-03-1.webp",
                    hc: 4,
                    rarity: 1,
                    cost: 3,
                    recruit: "2+",
                    abilities: [
                        [
                            { hc: 4 },
                            ": You get ",
                            { bold: "+2" },
                            { icon: 2 },
                            "."
                        ]
                    ]
                },
                {
                    name: "Surge of Power",
                    imageUrl: "/CardImages/Heroes/thor-04-1.webp",
                    hc: 3,
                    rarity: 1,
                    cost: 4,
                    recruit: "2",
                    attack: "0+",
                    abilities: [
                        [
                            "If you made ",
                            { bold: "8" },
                            " or more ",
                            { icon: 2 },
                            " this turn, you get ",
                            { bold: "+3" },
                            { icon: 1 },
                            "."
                        ]
                    ]
                },
                {
                    name: "Call Lightning",
                    imageUrl: "/CardImages/Heroes/thor-02-1.webp",
                    hc: 3,
                    rarity: 2,
                    cost: 6,
                    attack: "3+",
                    abilities: [
                        [
                            { hc: 3 },
                            ": You get ",
                            { bold: "+3" },
                            { icon: 1 },
                            "."
                        ]
                    ]
                },
                {
                    name: "God of Thunder",
                    imageUrl: "/CardImages/Heroes/thor-01-1.webp",
                    hc: 3,
                    rarity: 3,
                    cost: 8,
                    recruit: "5",
                    attack: "0+",
                    abilities: [
                        [
                            "You can use ",
                            { icon: 2 },
                            " as ",
                            { icon: 1 },
                            " this turn."
                        ]
                    ]
                }
            ]
        },
    ],
    masterminds: [
        {
            id: 56,
            name: "Iron Monger",
            vAttack: "9",
            vp: 5,
            cards: [
                {
                    name: "Iron Monger",
                    imageUrl: "/CardImages/Masterminds/iron-monger-01.webp",
                    vAttack: "9+",
                    abilities: [
                        [
                            { keyword: 49, text: "Bank Conqueror 4" }
                        ],
                        [
                            { bold: "Always Leads" },
                            ": Iron Foes"
                        ],
                        [
                            { bold: "Master Strike" },
                            ": If there is a Villain in the Bank, each player gains a Wound. Otherwise, put this Master Strike into the Bank as a ",
                            { bold: "6" },
                            { icon: 1 },
                            " “StaneTech Weaponry” Villain worth 4VP."
                        ]
                    ]
                },
                {
                    name: "Hostile Takeover",
                    imageUrl: "/CardImages/Masterminds/iron-monger-02.webp",
                    tactic: true,
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": If there are no Villains in the bank, reveal the top card of the Villain Deck. If it’s a Villain, it enters the Bank."
                        ]
                    ]
                },
                {
                    name: "Overloaded Arsenal",
                    imageUrl: "/CardImages/Masterminds/iron-monger-05.webp",
                    tactic: true,
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": Each other player reveals a ",
                            { hc: 5 },
                            " Hero or gains a Wound. Then each other player reveals a ",
                            { hc: 3 },
                            " Hero or gains a Wound."
                        ]
                    ]
                },
                {
                    name: "Sonic Stunner",
                    imageUrl: "/CardImages/Masterminds/iron-monger-04.webp",
                    tactic: true,
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": Each other player reveals a ",
                            { hc: 5 },
                            " Hero or discards down to 4 cards."
                        ]
                    ]
                },
                {
                    name: "Unexpected Betrayal",
                    imageUrl: "/CardImages/Masterminds/iron-monger-03.webp",
                    tactic: true,
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": If the Bank is empty, the player on your right chooses a Villain from their Victory Pile. That Villain enters the Bank."
                        ]
                    ]
                }
            ]
        },
        {
            id: -1,
            name: "Loki",
            set: 20,
            vAttack: "10",
            vp: 5,
            cards: [
                {
                    name: "Loki",
                    imageUrl: "/CardImages/Masterminds/loki-01-2.webp",
                    abilities: [
                        [
                            { bold: "Always Leads" },
                            ": Enemies of Asgard"
                        ],
                        [
                            { bold: "Master Strike" },
                            ": Each player reveals a ",
                            { hc: 4 },
                            " Hero or gains a Wound."
                        ]
                    ]
                },
                {
                    name: "Cruel Ruler",
                    imageUrl: "/CardImages/Masterminds/loki-04-2.webp",
                    tactic: true,
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": Defeat a Villain in the City for free."
                        ]
                    ]
                },
                {
                    name: "Maniacal Tyrant",
                    imageUrl: "/CardImages/Masterminds/loki-03-2.webp",
                    tactic: true,
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": KO up to four cards from your discard pile."
                        ]
                    ]
                },
                {
                    name: "Vanishing Illusions",
                    imageUrl: "/CardImages/Masterminds/loki-02-2.webp",
                    tactic: true,
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": Each other player KOs a Villain from their Victory Pile."
                        ]
                    ]
                },
                {
                    name: "Whispers and Lies",
                    imageUrl: "/CardImages/Masterminds/loki-05-1.webp",
                    tactic: true,
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": Each other player KOs two Bystanders from their Victory Pile."
                        ]
                    ]
                }
            ]
        },
        {
            id: -1,
            name: "Red Skull",
            set: 20,
            vAttack: "7",
            vp: 5,
            cards: [
                {
                    name: "Red Skull",
                    imageUrl: "/CardImages/Masterminds/red-skull-01-1.webp",
                    abilities: [
                        [
                            { bold: "Always Leads" },
                            ": HYDRA"
                        ],
                        [
                            { bold: "Master Strike" },
                            ": Each player KOs a Hero from their hand."
                        ]
                    ]
                },
                {
                    name: "Endless Resources",
                    imageUrl: "/CardImages/Masterminds/red-skull-05-1.webp",
                    tactic: true,
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": You get ",
                            { bold: "+4" },
                            { icon: 2 },
                            "."
                        ]
                    ]
                },
                {
                    name: "HYDRA Conspiracy",
                    imageUrl: "/CardImages/Masterminds/red-skull-03-1.webp",
                    tactic: true,
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": Draw two cards. Then draw another card for each HYDRA Villain in your Victory Pile."
                        ]
                    ]
                },
                {
                    name: "Negablast Grenades",
                    imageUrl: "/CardImages/Masterminds/red-skull-02-1.webp",
                    tactic: true,
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": You get ",
                            { bold: "+3" },
                            { icon: 1 },
                            "."
                        ]
                    ]
                },
                {
                    name: "Ruthless Dictator",
                    imageUrl: "/CardImages/Masterminds/red-skull-04-1.webp",
                    tactic: true,
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": Look at the top three cards of your deck. KO one, discard one and put one back on top of your deck."
                        ]
                    ]
                }
            ]
        }
    ],
    henchmen: [
        {
            id: 29,
            name: "Hammer Drone Army",
            imageUrl: "/CardImages/Henchmen/hammer-drone-army.webp",
            vAttack: "3",
            vp: 1,
            cards: [
                {
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": Look at the top two cards of your deck. KO one of them and put the other back."
                        ]
                    ]
                },
            ]
        },
        {
            id: 30,
            name: "HYDRA Pilots",
            imageUrl: "/CardImages/Henchmen/hydra-pilots.webp",
            vAttack: "3",
            vp: 1,
            cards: [
                {
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": You get ",
                            { bold: "+1" },
                            { icon: 2 },
                            "."
                        ]
                    ]
                },
            ]
        },
        {
            id: 31,
            name: "HYDRA Spies",
            imageUrl: "/CardImages/Henchmen/hydra-spies.webp",
            vAttack: "3",
            vp: 1,
            cards: [
                {
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": When you draw a new hand of cards at the end of this turn, draw an extra card."
                        ]
                    ]
                },
            ]
        },
        {
            id: 32,
            name: "Ten Rings Fanatics",
            imageUrl: "/CardImages/Henchmen/ten-rings-fanatics.webp",
            vAttack: "3",
            vp: 1,
            cards: [
                {
                    abilities: [
                        [
                            { bold: "Fight" },
                            ": KO one of your Heroes."
                        ]
                    ]
                },
            ]
        },
    ],
    villains: [
        {
            id: 71,
            name: "Chitauri",
            cards: [
                {
                    name: "Chitauri Soldier",
                    imageUrl: "/CardImages/Villains/chitauri-03.webp",
                    qtd: 2,
                    vp: "2",
                    vAttack: "3+",
                    abilities: [
                        { keyword: 49, text: "Rooftops Conqueror 2" },
                        [
                            {
                                bold: "Ambush"
                            },
                            ": Chitauri Soldier captures a Bystander."
                        ]
                    ]
                },
                {
                    name: "Chitauri Commander",
                    imageUrl: "/CardImages/Villains/chitauri-04.webp",
                    qtd: 2,
                    vp: "2",
                    vAttack: "3+",
                    abilities: [
                        { keyword: 49, text: "Rooftops Conqueror 2" },
                        [
                            {
                                bold: "Ambush"
                            },
                            ": ",
                            { italic: "(After this enters the city)" },
                            " If the Rooftops are empty, reveal the top card of the Villain Deck. If it's a Villain, that Villain enters the Rooftops."
                        ]
                    ]
                },
                {
                    name: "Chitauri Leviathan",
                    imageUrl: "/CardImages/Villains/chitauri-01.webp",
                    qtd: 2,
                    vp: "4",
                    vAttack: "5+",
                    abilities: [
                        { keyword: 49, text: "Rooftops Conqueror 2" },
                        [
                            {
                                bold: "Fight"
                            },
                            ": Each player with no Bystanders in their Victory Pile gains a Wound."
                        ],
                        [
                            {
                                bold: "Escape"
                            },
                            ": Same effect."
                        ]
                    ]
                },
                {
                    name: "Chitauri Chariot",
                    imageUrl: "/CardImages/Villains/chitauri-02.webp",
                    qtd: 2,
                    vp: "3",
                    vAttack: "4+",
                    abilities: [
                        { keyword: 49, text: "Rooftops Conqueror 2" },
                        [
                            {
                                bold: "Ambush"
                            },
                            ": ",
                            { italic: "(After this enters the city)" },
                            " If the Rooftops are empty, move this Villain there."
                        ]
                    ]
                }
            ]
        },
        {
            id: 72,
            name: "Gamma Hunters",
            cards: [
                {
                    name: "Sonic Cannon",
                    imageUrl: "/CardImages/Villains/gamma-hunters-01.webp",
                    qtd: 2,
                    vp: "2",
                    vAttack: "4",
                    abilities: [
                        [
                            {
                                bold: "Ambush"
                            },
                            ": Each Player discards two cards, then draws a card."
                        ],
                        [
                            {
                                bold: "Escape"
                            },
                            ": Same Effect"
                        ]
                    ]
                },
                {
                    name: "Lt. Gen “Thunderbolt“ Ross",
                    imageUrl: "/CardImages/Villains/gamma-hunters-03.webp",
                    qtd: 2,
                    vp: "3",
                    vAttack: "5",
                    abilities: [
                        [
                            {
                                bold: "Ambush"
                            },
                            ": Each Player reveals their hand. Each player with any ",
                            { hc: 4 },
                            " cards must discard one of them or gain a Wound."
                        ],
                        [
                            {
                                bold: "Escape"
                            },
                            ": Same effect."
                        ]
                    ]
                },
                {
                    name: "Abomination, Raging Monster",
                    imageUrl: "/CardImages/Villains/gamma-hunters-04.webp",
                    qtd: 2,
                    vp: "4",
                    vAttack: "4+",
                    abilities: [
                        { keyword: 49, text: "Streets Conqueror 3" },
                        [
                            {
                                bold: "Ambush"
                            },
                            ": ",
                            { italic: "(After this enters the city)" },
                            " If the Streets are empty, move another Villain from any city space to the Streets."
                        ]
                    ]
                },
                {
                    name: "Fighter Jet",
                    imageUrl: "/CardImages/Villains/gamma-hunters-02.webp",
                    qtd: 2,
                    vp: "2",
                    vAttack: "3+",
                    abilities: [
                        { keyword: 49, text: "Streets Conqueror 2" },
                        [
                            {
                                bold: "Fight"
                            },
                            ": KO one of your heroes."
                        ]
                    ]
                }
            ]
        },
        {
            id: 73,
            name: "Enemies of Asgard",
            filterName: "Enemies of Asgard (Marvel Studios)",
            cards: [
                {
                    name: "Destroyer",
                    imageUrl: "/CardImages/Villains/enemies-of-asgard-02-1.webp",
                    qtd: 1,
                    vp: "5",
                    vAttack: "7",
                    abilities: [
                        [
                            {
                                bold: "Fight"
                            },
                            ": KO all your ",
                            { team: 2 },
                            " Heroes."
                        ],
                        [
                            {
                                bold: "Escape"
                            },
                            ": Each player KOs two of their Heroes."
                        ]
                    ]
                },
                {
                    name: "Enslaved Hawkeye",
                    imageUrl: "/CardImages/Villains/enemies-of-asgard-04-1.webp",
                    qtd: 2,
                    vp: "4",
                    vAttack: "6",
                    abilities: [
                        [
                            {
                                bold: "Fight"
                            },
                            ": Draw three cards"
                        ]
                    ]
                },
                {
                    name: "Frost Giant",
                    imageUrl: "/CardImages/Villains/enemies-of-asgard-03-1.webp",
                    qtd: 3,
                    vp: "2",
                    vAttack: "4",
                    abilities: [
                        [
                            {
                                bold: "Fight"
                            },
                            ": Each player reveals a ",
                            { hc: 3 },
                            " Hero or gains a Wound."
                        ],
                        [
                            {
                                bold: "Escape"
                            },
                            ": Same effect."
                        ]
                    ]
                },
                {
                    name: "Laufey, Frost Giant King",
                    imageUrl: "/CardImages/Villains/enemies-of-asgard-01-1.webp",
                    qtd: 2,
                    vp: "4",
                    vAttack: "6",
                    abilities: [
                        [
                            {
                                bold: "Ambush"
                            },
                            ": Each player reveals a ",
                            { hc: 3 },
                            " Hero or gains a Wound."
                        ],
                        [
                            {
                                bold: "Fight"
                            },
                            ": Choose a player. That player KOs any number of Wounds from their hand and discard pile."
                        ]
                    ]
                }
            ]
        },
        {
            id: 74,
            name: "HYDRA",
            filterName: "HYDRA (Marvel Studios)",
            cards: [
                {
                    name: "Endless Armies of HYDRA",
                    imageUrl: "/CardImages/Villains/hydra-03-1.webp",
                    qtd: 3,
                    vp: "3",
                    vAttack: "4",
                    abilities: [
                        [
                            {
                                bold: "Fight"
                            },
                            ": Play the top two cards of the Villain Deck."
                        ]
                    ]
                },
                {
                    name: "HYDRA Motorcycle Squad",
                    imageUrl: "/CardImages/Villains/hydra-04-1.webp",
                    qtd: 3,
                    vp: "1",
                    vAttack: "3",
                    abilities: [
                        [
                            {
                                bold: "Fight"
                            },
                            ": You may gain a S.H.I.E.L.D. Officer."
                        ]
                    ]
                },
                {
                    name: "Arnim Zola",
                    imageUrl: "/CardImages/Villains/hydra-01-1.webp",
                    qtd: 1,
                    vp: "3+",
                    vAttack: "6",
                    abilities: [
                        [
                            "Arnim Zola is worth ",
                            { bold: "+3" },
                            { icon: 4 },
                            " for each other HYDRA Villain in your Victory Pile."
                        ]
                    ]
                },
                {
                    name: "HYDRA Tank",
                    imageUrl: "/CardImages/Villains/hydra-02-1.webp",
                    qtd: 1,
                    vp: "3",
                    vAttack: "5",
                    abilities: [
                        [
                            {
                                bold: "Fight"
                            },
                            ": Each player without another HYDRA Villain in their Victory Pile gains a Wound."
                        ],
                        [
                            {
                                bold: "Escape"
                            },
                            ": Same effect."
                        ]
                    ]
                }
            ]
        },
        {
            id: 75,
            name: "Iron Foes",
            cards: [
                {
                    name: "Hammer Drone Marine",
                    imageUrl: "/CardImages/Villains/iron-foes-01.webp",
                    qtd: 2,
                    vp: "2",
                    vAttack: "4",
                    abilities: [
                        [
                            {
                                bold: "Fight"
                            },
                            ": Look at the top three cards of your deck. KO one of them and put the rest back in any order."
                        ]
                    ]
                },
                {
                    name: "Raza, Ten Rings Leader",
                    imageUrl: "/CardImages/Villains/iron-foes-02.webp",
                    qtd: 2,
                    vp: "3",
                    vAttack: "4+",
                    abilities: [
                        [
                            "Raza gets ",
                            { bold: "+1" },
                            { icon: 1 },
                            " for each Bystander he has."
                        ],
                        [
                            {
                                bold: "Ambush"
                            },
                            ": Raza captures a Bystander from the Bystander Stack and a random Bystander from each player's Victory Pile."
                        ]
                    ]
                },
                {
                    name: "Whiplash",
                    imageUrl: "/CardImages/Villains/iron-foes-03.webp",
                    qtd: 2,
                    vp: "4",
                    vAttack: "6",
                    abilities: [
                        [
                            {
                                bold: "Fight"
                            },
                            ": Each player reveals a ",
                            { hc: 5 },
                            " hero or gains a Wound."
                        ],
                        [
                            {
                                bold: "Escape"
                            },
                            ": Same effect."
                        ]
                    ]
                },
                {
                    name: "Justin Hammer",
                    imageUrl: "/CardImages/Villains/iron-foes-04.webp",
                    qtd: 2,
                    vp: "2",
                    vAttack: "3+",
                    abilities: [
                        { keyword: 49, text: "Bank Conqueror 2" },
                        [
                            {
                                bold: "Fight"
                            },
                            ": You get ",
                            { bold: "+2" },
                            { icon: 2 },
                            " usable only to recruit heroes in the HQ space under the Bank."
                        ]
                    ]
                }
            ]
        }
    ],
    schemes: [
        {
            id: 100,
            name: "Asgard Under Siege",
            imageUrl: "/CardImages/Schemes/scheme-03-11.webp",
            cards: [
                {
                    abilities: [
                        [
                            { bold: "Setup" },
                            ": 8 Twists. Add an extra Henchman group to the Villain Deck."
                        ],
                        [
                            { bold: "Twist" },
                            ": Play the top 2 cards of the Villain Deck."
                        ],
                        [
                            { bold: "Evil Wins" },
                            ": If 12 Villains escape."
                        ],
                    ]
                },
            ]
        },
        {
            id: 101,
            name: "Destroy the Cities of Earth!",
            imageUrl: "/CardImages/Schemes/scheme-02-11.webp",
            cards: [
                {
                    abilities: [
                        [
                            { bold: "Setup" },
                            ": 8 Twists. 12 Bystanders in the Villain Deck."
                        ],
                        [
                            { bold: "Special Rules" },
                            ": Each Villain gets ",
                            { bold: "+1" },
                            { icon: 1 },
                            " for each Bystander it has."
                        ],
                        [
                            { bold: "Twist" },
                            ": Any Villain in the Bank captures 2 Bystanders. Then play the top card of the Villain Deck."
                        ],
                        [
                            { bold: "Evil Wins" },
                            ": When 8 Bystanders are carried away by escaping Villains."
                        ],
                    ]
                },
            ]
        },
        {
            id: 102,
            name: "Enslave Minds with the Chitauri Scepter",
            imageUrl: "/CardImages/Schemes/scheme-06-5.webp",
            cards: [
                {
                    abilities: [
                        [
                            { bold: "Setup" },
                            ": 8 Twists. 6 Heroes. Chitauri Villain Group required. Shuffle 12 random Heroes from the Hero Deck into the Villain Deck."
                        ],
                        [
                            { bold: "Special Rules" },
                            ": Heroes in the Villain Deck count as “Enslaved“ Villains with ",
                            { icon: 1 },
                            " equal to the Hero's ",
                            { icon: 3 },
                            { bold: "+2" },
                            ". If you defeat that Hero, you gain it."
                        ],
                        [
                            { bold: "Twist" },
                            ": The highest-cost Hero from the HQ moves into the Sewers as an “Enslaved“ Villain as above."
                        ],
                        [
                            { bold: "Evil Wins" },
                            ": If 6 Heroes get into the Escaped Villains pile."
                        ],
                    ]
                },
            ]
        },
        {
            id: 103,
            name: "Invade Asgard",
            imageUrl: "/CardImages/Schemes/scheme-07-5.webp",
            cards: [
                {
                    abilities: [
                        [
                            { bold: "Setup" },
                            ": 7 Twists. Each Twist is a Dark Portal."
                        ],
                        [
                            { bold: "Twist 1" },
                            ": Put the Dark Portal above the Mastermind. The Mastermind gets ",
                            { bold: "+1" },
                            { icon: 1 },
                            "."
                        ],
                        [
                            { bold: "Twists 2-6" },
                            ": Put the Dark Portal in the leftmost city space that doesn't yet have a Dark Portal. Villains in that city space get ",
                            { bold: "+1" },
                            { icon: 1 },
                            "."
                        ],
                        [
                            { bold: "Twist 7" },
                            ": Evil Wins!"
                        ],
                    ]
                },
            ]
        },
        {
            id: 104,
            name: "Radioactive Palladium Poisoning",
            imageUrl: "/CardImages/Schemes/scheme-01-11.webp",
            cards: [
                {
                    abilities: [
                        [
                            { bold: "Setup" },
                            ": 8 Twists. Wound stack holds 6 Wounds per player."
                        ],
                        [
                            { bold: "Twist" },
                            ": Each player reveals a ",
                            { hc: 5 },
                            " Hero or gains a Wound."
                        ],
                        [
                            { bold: "Evil Wins" },
                            ": If the Wound stack runs out."
                        ],
                    ]
                },
            ]
        },
        {
            id: 105,
            name: "Replace Earth's Leaders with HYDRA",
            imageUrl: "/CardImages/Schemes/scheme-05-5.webp",
            cards: [
                {
                    abilities: [
                        [
                            { bold: "Setup" },
                            ": 5 Twists. 3 additional Twists next to this Scheme. 18 total Bystanders in the Villain Deck."
                        ],
                        [
                            { bold: "Special Rules" },
                            ": Bystanders in the Villain Deck count as “Infiltrator“ Villains, with ",
                            { icon: 1 },
                            " equal to the number of Twists next to this Scheme."
                        ],
                        [
                            { bold: "Twist" },
                            ": Put the Twist next to this Scheme."
                        ],
                        [
                            { bold: "Evil Wins" },
                            ": If 5 “Infiltrators“ escape."
                        ],
                    ]
                },
            ]
        },
        {
            id: -1,
            set: 20,
            name: "Super Hero Civil War",
            imageUrl: "/CardImages/Schemes/scheme-04-11.webp",
            cards: [
                {
                    abilities: [
                        [
                            { bold: "Setup" },
                            ": For 2-3 players, use 8 Twists. For 4-5 players, use 5 Twists. If only 2 players, use only 4 Heroes in the Hero Deck."
                        ],
                        [
                            { bold: "Twist" },
                            ": KO all the Heroes in the HQ."
                        ],
                        [
                            { bold: "Evil Wins" },
                            ": If the Hero Deck runs out."
                        ],
                    ]
                },
            ]
        },
        {
            id: -1,
            set: 20,
            name: "Unleash the Power of the Cosmic Cube",
            imageUrl: "/CardImages/Schemes/scheme-08-5.webp",
            cards: [
                {
                    abilities: [
                        [
                            { bold: "Setup" },
                            ": 8 Twists."
                        ],
                        [
                            { bold: "Twist" },
                            ": Put the Twist next to this Scheme."
                        ],
                        [
                            { bold: "Twist 5-6" },
                            ": Each player gains a Wound."
                        ],
                        [
                            { bold: "Twist 7" },
                            ": Each player gains 3 Wounds."
                        ],
                        [
                            { bold: "Twist 8" },
                            ": Evil Wins!"
                        ],
                    ]
                },
            ]
        },
    ],
    bystanders: [
        {
            id: 37,
            name: "Bystander",
            imageUrl: "/CardImages/Bystanders/bystanders-01.webp",
            vp: 1,
            cards: [
                {
                    qtd: 30,
                    abilities: []
                }
            ]
        },
        {
            id: 38,
            name: "Happy Hogan",
            imageUrl: "/CardImages/Bystanders/bystander-happy-hogan.webp",
            vp: 1,
            cards: [
                {
                    qtd: 3,
                    abilities: [
                        [
                            "When you rescue this Bystander, you may KO a Wound from your hand or from any player's discard pile.",
                        ]
                    ]
                }
            ]
        },
        {
            id: 39,
            name: "Jane Foster",
            imageUrl: "/CardImages/Bystanders/bystyander-jane-foster.webp",
            vp: 1,
            cards: [
                {
                    qtd: 3,
                    abilities: [
                        [
                            "When you rescue this Bystander, you may KO one of your Heroes or a Hero from your discard pile.",
                        ]
                    ]
                }
            ]
        },
        {
            id: 40,
            name: "Peggy Carter",
            imageUrl: "/CardImages/Bystanders/bystander-peggy-carter.webp",
            vp: 1,
            cards: [
                {
                    qtd: 3,
                    abilities: [
                        [
                            "When you rescue this Bystander, draw a card.",
                        ]
                    ]
                }
            ]
        },
        {
            id: 41,
            name: "Pepper Potts",
            imageUrl: "/CardImages/Bystanders/bystander-pepper-potts.webp",
            vp: 1,
            cards: [
                {
                    qtd: 3,
                    abilities: [
                        [
                            "When you rescue this Bystander, you get ",
                            { bold: "+2" },
                            { icon: 2 },
                            ", usable only to recruit Heroes in the HQ space under the Bank.",
                        ]
                    ]
                }
            ]
        },
    ],
    wounds: [
        {
            id: 10,
            name: "Wound",
            filterName: "Wound (MS)",
            imageUrl: "/CardImages/Wounds/wound-1.webp",
            set: 20,
            cards: [
                {
                    qtd: 30,
                    abilities: [
                        [
                            { bold: "Healing" },
                            ": If you don't recruit any Heroes or defeat any Villains or Masterminds on your turn, you may KO all the Wounds from your hand.",
                        ],
                    ]
                }
            ]
        }
    ]
};
//# sourceMappingURL=marvelstudios.js.map
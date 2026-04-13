'use strict';

/**
 * openings.js – Chess Opening Database
 * Moves are stored as SAN strings in play order (alternating White / Black).
 */

const OPENINGS = [

  // ─── AGGRESSIVE ──────────────────────────────────────────────────────────

  {
    name: "King's Gambit",
    eco: "C30",
    style: "aggressive",
    moves: ["e4","e5","f4"],
    description: "White sacrifices the f-pawn for rapid development and a kingside attack. One of the oldest and sharpest weapons — beloved by Morphy, Spassky and Tal."
  },
  {
    name: "Danish Gambit",
    eco: "C21",
    style: "aggressive",
    moves: ["e4","e5","d4","exd4","c3","dxc3","Bc4","cxb2","Bxb2"],
    description: "White sacrifices two pawns for devastating piece activity and open lines. A favourite of attacking club players — extremely tactical."
  },
  {
    name: "Evans Gambit",
    eco: "C51",
    style: "aggressive",
    moves: ["e4","e5","Nf3","Nc6","Bc4","Bc5","b4"],
    description: "White sacrifices the b-pawn to gain rapid central control and initiative. Kasparov revived this 19th-century weapon against Anand in 1995."
  },
  {
    name: "Fried Liver Attack",
    eco: "C58",
    style: "aggressive",
    moves: ["e4","e5","Nf3","Nc6","Bc4","Nf6","Ng5","d5","exd5","Nxd5","Nxf7"],
    description: "White sacrifices a knight on f7 for a ferocious attack against the exposed Black king. Pure tactical chaos — one of the most exciting lines in chess."
  },
  {
    name: "Scotch Gambit",
    eco: "C44",
    style: "aggressive",
    moves: ["e4","e5","Nf3","Nc6","d4","exd4","Bc4"],
    description: "White declines to recapture on d4, instead using the tempo for rapid piece development. Leads to sharp, open positions with early attacking chances."
  },
  {
    name: "Vienna Gambit",
    eco: "C28",
    style: "aggressive",
    moves: ["e4","e5","Nc3","Nf6","f4"],
    description: "A delayed King's Gambit with added support from the c3-knight. White grabs kingside space and prepares a central break, leading to wild tactical play."
  },
  {
    name: "Smith-Morra Gambit",
    eco: "B21",
    style: "aggressive",
    moves: ["e4","c5","d4","cxd4","c3","dxc3","Nxc3"],
    description: "Against the Sicilian, White sacrifices a pawn for a lead in development and rapid piece play. A fearsome weapon favoured by attacking players at all levels."
  },
  {
    name: "Latvian Gambit",
    eco: "C40",
    style: "aggressive",
    moves: ["e4","e5","Nf3","f5"],
    description: "Black immediately counterattacks with the risky 2...f5. Highly provocative and extremely sharp — not for the faint-hearted, but can catch White off guard."
  },
  {
    name: "Budapest Gambit",
    eco: "A51",
    style: "aggressive",
    moves: ["d4","Nf6","c4","e5","dxe5","Ng4"],
    description: "Black immediately counterattacks White's pawn with a piece sacrifice, leading to very active play and quick kingside pressure."
  },
  {
    name: "Benko Gambit",
    eco: "A57",
    style: "aggressive",
    moves: ["d4","Nf6","c4","c5","d5","b5","cxb5","a6"],
    description: "Black sacrifices a pawn for long-term queenside pressure and open files. The resulting endgame pressure is notoriously difficult to handle."
  },
  {
    name: "Sicilian Dragon",
    eco: "B70",
    style: "aggressive",
    moves: ["e4","c5","Nf3","d6","d4","cxd4","Nxd4","Nf6","Nc3","g6"],
    description: "Black fianchettoes the dark-squared bishop, building a powerful 'dragon' diagonal. Leads to mutual kingside attacks and razor-sharp tactical battles."
  },
  {
    name: "Sicilian Najdorf",
    eco: "B90",
    style: "aggressive",
    moves: ["e4","c5","Nf3","d6","d4","cxd4","Nxd4","Nf6","Nc3","a6"],
    description: "The most popular response to 1.e4 at top level. Black prevents Nb5 and prepares queenside expansion. Fischer's and Kasparov's weapon of choice."
  },
  {
    name: "Sicilian Scheveningen",
    eco: "B80",
    style: "aggressive",
    moves: ["e4","c5","Nf3","d6","d4","cxd4","Nxd4","Nf6","Nc3","e6"],
    description: "A dynamic Sicilian setup combining solid structure with flexible counterplay on both wings. Leads to complex middlegames with unbalanced positions."
  },
  {
    name: "King's Indian Defense",
    eco: "E60",
    style: "aggressive",
    moves: ["d4","Nf6","c4","g6","Nc3","Bg7","e4","d6","Nf3","O-O","Be2","e5"],
    description: "Black allows White a big center and then launches a ferocious kingside attack. Wild positions where both sides race to attack on opposite wings."
  },
  {
    name: "Grünfeld Defense",
    eco: "D80",
    style: "aggressive",
    moves: ["d4","Nf6","c4","g6","Nc3","d5","cxd5","Nxd5","e4","Nxc3","bxc3","Bg7"],
    description: "Black allows White a massive center and then counterattacks with pieces. The resulting tension is extreme — one of Fischer and Kasparov's favourites."
  },
  {
    name: "Benoni Defense",
    eco: "A60",
    style: "aggressive",
    moves: ["d4","Nf6","c4","c5","d5","e6","Nc3","exd5","cxd5","d6"],
    description: "Black concedes the center for dynamic counterplay on both wings. Very rich fighting chess with long-term structural imbalances."
  },
  {
    name: "French Winawer",
    eco: "C15",
    style: "aggressive",
    moves: ["e4","e6","d4","d5","Nc3","Bb4"],
    description: "Black pins the c3-knight and prepares to disrupt White's center. Leads to highly unbalanced pawn structures and mutual wing attacks."
  },
  {
    name: "Dutch Defense",
    eco: "A80",
    style: "aggressive",
    moves: ["d4","f5"],
    description: "Black seizes kingside space immediately. Leads to rich attacking games — Tal and Botvinnik were famous proponents of this bold response."
  },
  {
    name: "Alekhine's Defense",
    eco: "B02",
    style: "aggressive",
    moves: ["e4","Nf6","e5","Nd5","d4","d6"],
    description: "Black provokes White to advance the center pawns and then attacks them with pieces. A hypermodern classic invented by World Champion Alekhine."
  },
  {
    name: "Trompowsky Attack",
    eco: "A45",
    style: "aggressive",
    moves: ["d4","Nf6","Bg5"],
    description: "White immediately pins or trades Black's best-developed piece, leading to original, unbalanced positions that sidestep a lot of mainstream theory."
  },

  // ─── PASSIVE / SOLID ─────────────────────────────────────────────────────

  {
    name: "London System",
    eco: "D02",
    style: "passive",
    moves: ["d4","d5","Nf3","Nf6","Bf4","e6","e3","Be7","Bd3"],
    description: "A solid, system-based approach. White develops harmoniously without committing the center. Reliable and low-risk — a favourite of Magnus Carlsen."
  },
  {
    name: "Colle System",
    eco: "D05",
    style: "passive",
    moves: ["d4","d5","Nf3","Nf6","e3","e6","Bd3","c5"],
    description: "White develops solidly and plans a later e3-e4 pawn break. Very reliable for players who prefer a positional, step-by-step approach."
  },
  {
    name: "Reti Opening",
    eco: "A09",
    style: "passive",
    moves: ["Nf3","d5","c4","dxc4","e3","Nf6","Bxc4"],
    description: "A hypermodern opening where White controls the center from a distance with pieces rather than pawns. Named after the great endgame artist Richard Réti."
  },
  {
    name: "English Opening",
    eco: "A10",
    style: "passive",
    moves: ["c4","e5","Nc3","Nf6","g3","d5","cxd5","Nxd5","Bg2"],
    description: "A flexible, hypermodern opening. White avoids 1.e4 and 1.d4 commitments and builds a slow strategic game. Favoured by Karpov and Botvinnik."
  },
  {
    name: "King's Indian Attack",
    eco: "A07",
    style: "passive",
    moves: ["Nf3","d5","g3","Nf6","Bg2","e6","O-O","Be7","d3"],
    description: "White builds a solid kingside setup regardless of Black's choice. Fischer used this system repeatedly as White, then slowly built up a kingside attack."
  },
  {
    name: "Torre Attack",
    eco: "A46",
    style: "passive",
    moves: ["d4","Nf6","Nf3","e6","Bg5","c5","e3","Be7"],
    description: "White places early pressure on Black's knight with Bg5, developing solidly. A simple system that avoids most mainstream theory while keeping positional pressure."
  },
  {
    name: "Caro-Kann Defense",
    eco: "B10",
    style: "passive",
    moves: ["e4","c6","d4","d5"],
    description: "Black challenges the center with the solid 1...c6. The positions tend to be sound and durable — Petrosian and Karpov were devoted exponents."
  },
  {
    name: "Petroff Defense",
    eco: "C42",
    style: "passive",
    moves: ["e4","e5","Nf3","Nf6"],
    description: "Black mirrors White's knight move for symmetrical, solid play. Extremely resilient — popular at top level for avoiding early theoretical landmines."
  },
  {
    name: "Berlin Defense",
    eco: "C65",
    style: "passive",
    moves: ["e4","e5","Nf3","Nc6","Bb5","Nf6","O-O","Nxe4","d4","Nd6","Bxc6","dxc6","dxe5","Nf5"],
    description: "The 'Berlin Wall'. Dubbed drawish and endgame-focused, yet devastatingly effective. Vladimir Kramnik used it to completely neutralise Kasparov's attacks in 2000."
  },
  {
    name: "French Exchange",
    eco: "C01",
    style: "passive",
    moves: ["e4","e6","d4","d5","exd5","exd5"],
    description: "White simplifies the center early, leading to a symmetrical pawn structure. Very solid and drawish — often used to steer the game into quiet positional waters."
  },
  {
    name: "Queen's Gambit Declined",
    eco: "D30",
    style: "passive",
    moves: ["d4","d5","c4","e6","Nc3","Nf6","Bg5","Be7","e3","O-O"],
    description: "One of the oldest and most respected responses to 1.d4. Black builds a solid center and develops harmoniously. A cornerstone of classical and modern chess."
  },
  {
    name: "Slav Defense",
    eco: "D10",
    style: "passive",
    moves: ["d4","d5","c4","c6","Nf3","Nf6","Nc3","dxc4"],
    description: "Black supports d5 with c6, keeping the c8-bishop mobile unlike in the QGD. Solid and theoretically rich — Anand and Kramnik are major advocates."
  },
  {
    name: "Nimzo-Indian Defense",
    eco: "E20",
    style: "passive",
    moves: ["d4","Nf6","c4","e6","Nc3","Bb4"],
    description: "Black pins White's knight, controlling the center through piece pressure rather than pawns. A deep, strategic opening invented by hypermodern pioneer Nimzowitsch."
  },
  {
    name: "Modern Defense",
    eco: "B06",
    style: "passive",
    moves: ["e4","g6","d4","Bg7","Nc3","d6"],
    description: "Black adopts a flexible setup, delaying central commitment and inviting White to potentially overextend. Works well as a universal system against 1.e4."
  },
  {
    name: "Pirc Defense",
    eco: "B07",
    style: "passive",
    moves: ["e4","d6","d4","Nf6","Nc3","g6","f4","Bg7"],
    description: "Black allows White a big center and fianchettoes the bishop, planning to undermine the center from the flanks. A solid hypermodern system."
  }
];

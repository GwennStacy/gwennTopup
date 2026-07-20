export interface GameConfig {
  id: string; // The URL slug (e.g. /game/mlbb)
  name: string;
  publisher: string;
  image: string;
  requiresZoneId: boolean;
  g2bulkCode: string; // The specific game code expected by G2Bulk API
}

export const games: GameConfig[] = [
  {
    id: "mlbb",
    name: "Mobile Legends",
    publisher: "Moonton",
    image: "/game/mlbb1.jpg",
    requiresZoneId: true,
    g2bulkCode: "mlbb",
  },
  {
    id: "freefire",
    name: "Free Fire",
    publisher: "Garena",
    image: "/game/freefire-cover.jpg",
    requiresZoneId: false,
    g2bulkCode: "freefire_sg",
  },
  {
    id: "pubgm",
    name: "PUBG Mobile",
    publisher: "Tencent Games",
    image: "/game/pubg.jpg",
    requiresZoneId: false,
    g2bulkCode: "pubgm",
  },
  {
    id: "hok",
    name: "Honor of Kings",
    publisher: "Tencent Games",
    image: "/game/hok2c.jpg",
    requiresZoneId: false,
    g2bulkCode: "hok",
  },
  {
    id: "magicchess",
    name: "Magic Chess Go Go",
    publisher: "Moonton",
    image: "/game/mlbb.jpg",
    requiresZoneId: true,
    g2bulkCode: "magic_chess_gogo",
  },
  {
    id: "valorant",
    name: "Valorant",
    publisher: "Riot Games",
    image: "/game/Val.jpg",
    requiresZoneId: false,
    g2bulkCode: "valorant",
  },
];

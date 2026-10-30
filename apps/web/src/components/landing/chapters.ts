import { BookOpen, CalendarDays, Leaf, ShoppingBasket } from "lucide-react";

export const chapters = [
  {
    id: "vault",
    number: "01",
    name: "The Royal Vault",
    short: "Your pantry",
    cover: "The Royal",
    subtitle: "Vault",
    icon: Leaf,
    image: "vegetables",
    heading: "Good things deserve a little care.",
    description:
      "Give every ingredient a home. Know what’s fresh, what’s waiting, and what needs a little love before it’s forgotten.",
    note: "A home for every little treasure",
    href: "/royal-vault",
  },
  {
    id: "cookbook",
    number: "02",
    name: "The Ancient Cookbook",
    short: "Your recipes",
    cover: "The Ancient",
    subtitle: "Cookbook",
    icon: BookOpen,
    image: "soup",
    heading: "Your next great meal is already here.",
    description:
      "Discover recipes made for the ingredients in your vault. Find your favorites, gather what’s missing, and make something wonderful.",
    note: "Possibilities, hiding in plain sight",
    href: "/ancient-cookbook",
  },
  {
    id: "market",
    number: "03",
    name: "Market Quests",
    short: "Your shopping",
    cover: "The Market",
    subtitle: "Quest",
    icon: ShoppingBasket,
    image: "ingredients",
    heading: "A little intention. A better basket.",
    description:
      "Turn missing ingredients into a thoughtful shopping list. Gather only what you need, and leave the guesswork at the village gate.",
    note: "A small adventure with a purpose",
    href: "/market-quest",
  },
  {
    id: "feast",
    number: "04",
    name: "The Royal Feast",
    short: "Your week",
    cover: "The Royal",
    subtitle: "Feast",
    icon: CalendarDays,
    image: "roast",
    heading: "Make a little room around the table.",
    description:
      "A slow breakfast. A comforting lunch. A dinner to look forward to. Plan a delicious week without making it another chore.",
    note: "Something lovely to look forward to",
    href: "/royal-feast",
  },
] as const;

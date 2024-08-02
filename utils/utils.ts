import { createAvatar } from "@dicebear/core"
import { lorelei, croodles, notionists } from "@dicebear/collection"

const getRandomAvatar = () => {
  const avatars = [lorelei, notionists, croodles]
  const avatar = avatars[Math.floor(Math.random() * avatars.length)]

  const avatarVariants = [
    "Muffin",
    "Milo",
    "Pumpkin",
    "Rascal",
    "Mimi",
    "Peanut",
    "Sam",
    "Midnight",
    "Simon",
    "Oliver",
    "Tigger",
    "Max",
    "Snickers",
    "Jasmine",
    "Simba",
    "Bella",
    "Miss kitty",
    "Whiskers",
    "Cuddles",
    "Bubba",
    "Felix",
    "Aneka",
  ]

  const styles = {
    seed: avatarVariants[Math.floor(Math.random() * avatarVariants.length)],
    backgroundColor: ["FFBF69"],
    earringsProbability: 50,
    glassesProbability: 50,
    mustacheProbability: 50,
    frecklesProbability: 50,
    beardProbability: 35,
    hairAccessoriesProbability: 50,
    gestureProbability: 30,
    scale: 125,
  }

  const generatedAvatar = createAvatar(avatar, styles)

  return generatedAvatar.toDataUri()
}

export { getRandomAvatar }

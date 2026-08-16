/**
 * Purrfect Match — gift catalogue for the Phase 2 reveal.
 *
 * Local mock data. The app has no backend. Each gift lists the trait tags it
 * answers. `pickGifts` in this file scores a gift against the tags that the
 * accepted traits unlocked, so the sheet shows the best matches first.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'

/**
 * A name from the icon set the theme resolves by default. The union makes a
 * typo a compile error — a wrong name renders an empty box at run time.
 */
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name']

export interface Gift {
  /** Stable id. Also the React key and the detail-route parameter. */
  id: string
  /** Product name. */
  name: string
  /** One line that says what the gift does. */
  tagline: string
  /** Two or three sentences for the Phase 3 detail view. */
  description: string
  /** Price in whole US dollars. */
  price: number
  /** Icon for the list thumbnail. */
  icon: IconName
  /**
   * A hex color that stands for the product. Phase 3 seeds the detail view
   * palette from it. It is product art, not a theme role, so it is a literal
   * here and never read as a color token.
   */
  swatch: string
  /** Trait tags this gift answers. `pickGifts` scores against these. */
  tags: string[]
}

export const GIFTS: Gift[] = [
  {
    id: 'sisal-post',
    name: 'Sisal Rope Post',
    tagline: 'Saves the sofa arm.',
    description:
      'A tall post wrapped in natural sisal rope. The vertical shape lets a cat stretch to full length, which is what a sofa arm gives it today. The weighted base does not tip.',
    price: 48,
    icon: 'tower-fire',
    swatch: '#A9773F',
    tags: ['scratching', 'furniture'],
  },
  {
    id: 'cat-tower',
    name: 'Canopy Cat Tower',
    tagline: 'A high seat with a view.',
    description:
      'Five levels of platforms that end in a covered top bed. A climber gets the height it wants, and the top platform is above human head level, which is the seat a cat picks first.',
    price: 165,
    icon: 'stairs-up',
    swatch: '#6E5A48',
    tags: ['climbing', 'furniture', 'comfort'],
  },
  {
    id: 'wand-teaser',
    name: 'Feather Wand Teaser',
    tagline: 'Runs the 3 a.m. energy down.',
    description:
      'A flexible rod with a feather lure on a long string. You control the speed, so you can make the lure act like prey — it moves away from the cat, never toward it. The lure clips off for a replacement.',
    price: 14,
    icon: 'feather',
    swatch: '#B25C43',
    tags: ['energy', 'toys', 'play'],
  },
  {
    id: 'puzzle-feeder',
    name: 'Slow Puzzle Feeder',
    tagline: 'Makes dinner a hunt.',
    description:
      'A tray of channels and cups that holds dry food. The cat must work each piece out with a paw, which slows the meal and gives a hunter a job. It comes apart for the dishwasher.',
    price: 32,
    icon: 'puzzle-outline',
    swatch: '#4F7A6B',
    tags: ['feeding', 'enrichment', 'play'],
  },
  {
    id: 'water-fountain',
    name: 'Circulating Fountain',
    tagline: 'The tap, always on.',
    description:
      'A ceramic fountain that keeps a moving stream all day. A cat that drinks from the tap wants moving water, not a still bowl. The pump runs quietly and the filter lasts a month.',
    price: 55,
    icon: 'water-outline',
    swatch: '#4A7186',
    tags: ['feeding', 'enrichment'],
  },
  {
    id: 'donut-bed',
    name: 'Calming Donut Bed',
    tagline: 'A lap that is always free.',
    description:
      'A deep round bed in long faux fur. The raised rim supports the head the way your arm does, so a lap cat has a second choice when you stand up. The cover washes cold.',
    price: 39,
    icon: 'sleep',
    swatch: '#9C6A76',
    tags: ['comfort', 'bedding'],
  },
  {
    id: 'cardboard-lounge',
    name: 'Cardboard Hideaway',
    tagline: 'The good box, by design.',
    description:
      'A curved lounger cut from thick recycled cardboard. The surface doubles as a scratch pad, and the shape gives the enclosed feeling a cat looks for in a delivery box.',
    price: 26,
    icon: 'package-variant-closed',
    swatch: '#96703F',
    tags: ['hideaway', 'comfort', 'scratching'],
  },
  {
    id: 'lion-outfit',
    name: 'Lion Mane Outfit',
    tagline: 'For the cat that answers back.',
    description:
      'A soft knitted mane that fastens under the chin. It fits over the head in one motion and comes off as fast, which matters. A talker will tell you what it thinks of it.',
    price: 18,
    icon: 'crown-outline',
    swatch: '#C08A2E',
    tags: ['play', 'enrichment'],
  },
  {
    id: 'window-perch',
    name: 'Window Sill Perch',
    tagline: 'Front row for the birds.',
    description:
      'A padded shelf that mounts to the glass with four suction cups. It holds a large cat and gives a climber a high seat in a room with no shelf to reach.',
    price: 34,
    icon: 'window-closed-variant',
    swatch: '#5E7C82',
    tags: ['climbing', 'comfort', 'enrichment'],
  },
  {
    id: 'tunnel-set',
    name: 'Crinkle Tunnel Set',
    tagline: 'Three ways to disappear.',
    description:
      'Three collapsible tubes that join into a Y. The lining crinkles under a paw, which holds attention longer than a quiet tunnel. It folds flat when the zoomies stop.',
    price: 29,
    icon: 'tunnel',
    swatch: '#7A5E86',
    tags: ['energy', 'hideaway', 'play'],
  },
]

/** A gift and the reason it was picked. The sheet renders both. */
export interface GiftMatch {
  gift: Gift
  /**
   * Number of accepted trait tags this gift answers. Always 1 or more for a
   * result of `pickGifts`.
   */
  score: number
  /**
   * `score` as a percentage of the accepted traits, from 1 to 100. This is
   * the number the app shows, because a bare count means nothing without the
   * total: "3" is a strong match out of 4 traits and a weak one out of 9.
   */
  matchPercent: number
  /** The trait labels that matched, for the "because ..." line. */
  reasons: string[]
}

/**
 * Scores every gift against the accepted traits and returns the matches.
 *
 * A gift matches when it shares a tag with an accepted trait. The score is the
 * number of distinct traits it answers, so a gift that covers three answers
 * ranks above one that covers a single answer. A tie keeps catalogue order,
 * which keeps the list stable between runs.
 *
 * `matchPercent` scales the score against the number of accepted traits, so a
 * gift that answers every trait reads as 100%. The percentage is the app's
 * unit: the whole flow is a profile matched against a catalogue.
 *
 * Returns an empty array when no trait was accepted. The caller shows its own
 * empty state — this function does not invent a fallback gift.
 */
export function pickGifts(
  accepted: Array<{ label: string; giftTags: string[] }>,
): GiftMatch[] {
  if (accepted.length === 0) return []

  const matches: GiftMatch[] = []

  for (const gift of GIFTS) {
    const reasons = accepted
      .filter((trait) => trait.giftTags.some((tag) => gift.tags.includes(tag)))
      .map((trait) => trait.label)

    if (reasons.length > 0) {
      matches.push({
        gift,
        score: reasons.length,
        matchPercent: Math.round((reasons.length / accepted.length) * 100),
        reasons,
      })
    }
  }

  // `sort` is stable in every JS engine the app targets, so equal scores keep
  // catalogue order.
  return matches.sort((a, b) => b.score - a.score)
}

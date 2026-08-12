/**
 * Purrfect Match — behavioral traits for the Phase 1 deck.
 *
 * Local mock data. The app has no backend. Each "Yes" answer adds its
 * `giftTags` to the profile that Phase 2 reads to pick gifts.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { ComponentProps } from 'react'

/**
 * A name from the icon set the theme resolves by default. The union makes a
 * typo a compile error — a wrong name renders an empty box at run time.
 */
type IconName = ComponentProps<typeof MaterialCommunityIcons>['name']

export interface Trait {
  /** Stable id. Also the React key for the card. */
  id: string
  /** Short name for the trait. The summary and the gift tags use it. */
  label: string
  /** The question the card asks the owner. */
  question: string
  /** One line of supporting text below the question. */
  detail: string
  /** Icon for the trait badge. */
  icon: IconName
  /** Gift categories that a "Yes" answer unlocks in Phase 2. */
  giftTags: string[]
}

export const TRAITS: Trait[] = [
  {
    id: 'zoomies',
    label: 'Zoomies',
    question: 'Does your cat run at 3 a.m.?',
    detail: 'The night sprint down the hallway, every night.',
    icon: 'run-fast',
    giftTags: ['energy', 'toys'],
  },
  {
    id: 'scratcher',
    label: 'Scratcher',
    question: 'Does your cat scratch the furniture?',
    detail: 'The sofa arm is the favourite target.',
    icon: 'sofa-outline',
    giftTags: ['scratching', 'furniture'],
  },
  {
    id: 'lap-cat',
    label: 'Lap cat',
    question: 'Does your cat sleep on you?',
    detail: 'It finds your lap the moment you sit down.',
    icon: 'sleep',
    giftTags: ['comfort', 'bedding'],
  },
  {
    id: 'hunter',
    label: 'Hunter',
    question: 'Does your cat hunt its toys?',
    detail: 'It stalks the toy first, then it attacks.',
    icon: 'target',
    giftTags: ['toys', 'play'],
  },
  {
    id: 'climber',
    label: 'Climber',
    question: 'Does your cat climb to high places?',
    detail: 'The top shelf is the preferred seat.',
    icon: 'stairs-up',
    giftTags: ['climbing', 'furniture'],
  },
  {
    id: 'box-lover',
    label: 'Box lover',
    question: 'Does your cat sit in every box?',
    detail: 'An empty box becomes a bed in one second.',
    icon: 'package-variant-closed',
    giftTags: ['comfort', 'hideaway'],
  },
  {
    id: 'talker',
    label: 'Talker',
    question: 'Does your cat answer you?',
    detail: 'You speak, and it replies with a long meow.',
    icon: 'chat-outline',
    giftTags: ['play', 'enrichment'],
  },
  {
    id: 'water-watcher',
    label: 'Water watcher',
    question: 'Does your cat watch the tap?',
    detail: 'It drinks from the tap, not from the bowl.',
    icon: 'water-outline',
    giftTags: ['feeding', 'enrichment'],
  },
]

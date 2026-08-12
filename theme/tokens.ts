/**
 * Purrfect Match — custom design tokens.
 *
 * These sit next to the MD3 roles on the theme object, under the `purrfect`
 * key. Read them with `useTheme<PurrfectTheme>()`.
 */

/** Warm ginger-cat orange. The seed for the whole MD3 palette. */
export const SEED_COLOR = '#E07A3F'

/** Rounded display face. Headlines and numbers. */
export const FONT_DISPLAY = 'Baloo2'

/** Neutral body face. Paragraphs, labels, and captions. */
export const FONT_BODY = 'NunitoSans'

/** Corner-radius multiplier. Cards read as rounded pebbles, not rectangles. */
export const ROUNDNESS = 1.6

/** Decision colors for the swipe deck. */
export interface SwipeDecisionColors {
  /** Fill for the decision badge and the card edge glow. */
  color: string
  /** Text and icon color that sits on `color`. */
  on: string
  /** Low-emphasis fill behind the badge. */
  container: string
  /** Text and icon color that sits on `container`. */
  onContainer: string
}

/** Geometry for the layered card stack. */
export interface CardStackTokens {
  /**
   * Vertical offset in px between one card and the card below it.
   *
   * A scaled-down card is centred, so `scaleStep` already pulls its bottom
   * edge up by `scaleStep * cardHeight / 2`. `offsetY` must be larger than
   * that, or the card behind hides completely behind the top card.
   */
  offsetY: number
  /** Scale step between one card and the card below it. */
  scaleStep: number
  /** Rotation in degrees at the full swipe threshold. */
  maxRotation: number
  /** Horizontal travel in px that counts as a committed swipe. */
  swipeThreshold: number
  /** Number of cards drawn behind the top card. */
  visibleDepth: number
}

export interface PurrfectTokens {
  /** "Yes" swipe — sage green. */
  yes: SwipeDecisionColors
  /** "No" swipe — dusty rose. */
  no: SwipeDecisionColors
  /** Accent for paw-print and whisker decoration. */
  paw: string
  /** Opacity for the background paw pattern. */
  pawOpacity: number
  cardStack: CardStackTokens
}

const cardStack: CardStackTokens = {
  // At the ~610 px card height of a phone, a 0.04 step insets the card behind
  // by about 12 px, so a 24 px offset leaves a 12 px sliver showing.
  offsetY: 24,
  scaleStep: 0.04,
  maxRotation: 12,
  swipeThreshold: 110,
  visibleDepth: 3,
}

/** Light-mode custom tokens. */
export const purrfectLight: PurrfectTokens = {
  yes: {
    color: '#4F6B4A',
    on: '#FFFFFF',
    container: '#D2E7CB',
    onContainer: '#0E2110',
  },
  no: {
    color: '#A63E51',
    on: '#FFFFFF',
    container: '#FFD9DE',
    onContainer: '#400013',
  },
  paw: '#B98A63',
  pawOpacity: 0.06,
  cardStack,
}

/** Dark-mode custom tokens. Dark mode is the primary showcase mode. */
export const purrfectDark: PurrfectTokens = {
  yes: {
    color: '#B7CFAF',
    on: '#213620',
    container: '#374D34',
    onContainer: '#D2E7CB',
  },
  no: {
    color: '#FFB2BD',
    on: '#650024',
    container: '#8B2739',
    onContainer: '#FFD9DE',
  },
  paw: '#8C6A4E',
  pawOpacity: 0.08,
  cardStack,
}

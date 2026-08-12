/**
 * Purrfect Match — "Warm Cattery" theme.
 *
 * The palette starts from one ginger-cat seed color and the MD3 `expressive`
 * variant. Hand overrides then replace the roles that must carry a specific
 * meaning: `tertiary` for a "Yes" swipe, `error` for a "No" swipe, and the
 * surface ramp for warm cream and warm charcoal-brown.
 *
 * Import `lightTheme` or `darkTheme` from this module only. Do not import the
 * stock themes from `@rootnative/core`, and do not write a hex value inside a
 * component.
 */
import { defineTheme } from '@rootnative/core'
import { createMaterialTheme } from '@rootnative/core/create-theme'
import type { Theme } from '@rootnative/core'

import {
  FONT_BODY,
  FONT_DISPLAY,
  ROUNDNESS,
  SEED_COLOR,
  purrfectDark,
  purrfectLight,
} from './tokens'
import type { PurrfectTokens } from './tokens'

export * from './tokens'

/** The MD3 theme plus the project tokens. Use this type with `useTheme()`. */
export interface PurrfectTheme extends Theme {
  purrfect: PurrfectTokens
}

// `fidelity` is the variant that holds the seed hue. It returns the ginger
// seed itself as `primaryContainer`. The `expressive` variant rotates the hue
// far enough to come back blue-violet, which the design brief rules out.
const base = createMaterialTheme(SEED_COLOR, {
  variant: 'fidelity',
  roundness: ROUNDNESS,
  contrastLevel: 'standard',
  fontFamily: FONT_BODY,
})

/**
 * Sage green. Replaces the generated `tertiary` ramp so a "Yes" swipe reads as
 * calm and positive against the ginger primary.
 */
const sageLight = {
  tertiary: '#4F6B4A',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#D2E7CB',
  onTertiaryContainer: '#0E2110',
  tertiaryFixed: '#D2E7CB',
  onTertiaryFixed: '#0E2110',
  tertiaryFixedDim: '#B7CFAF',
  onTertiaryFixedVariant: '#374D34',
}

const sageDark = {
  tertiary: '#B7CFAF',
  onTertiary: '#213620',
  tertiaryContainer: '#374D34',
  onTertiaryContainer: '#D2E7CB',
  tertiaryFixed: '#D2E7CB',
  onTertiaryFixed: '#0E2110',
  tertiaryFixedDim: '#B7CFAF',
  onTertiaryFixedVariant: '#374D34',
}

/**
 * Dusty rose. Replaces the MD3 default red so a "No" swipe reads as a soft
 * decline, not a system failure.
 */
const roseLight = {
  error: '#A63E51',
  onError: '#FFFFFF',
  errorContainer: '#FFD9DE',
  onErrorContainer: '#400013',
}

const roseDark = {
  error: '#FFB2BD',
  onError: '#650024',
  errorContainer: '#8B2739',
  onErrorContainer: '#FFD9DE',
}

/** Warm cream surfaces. No pure white. */
const creamSurfaces = {
  background: '#FCF6F0',
  onBackground: '#231A14',
  surface: '#FCF6F0',
  onSurface: '#231A14',
  surfaceDim: '#E7DCD3',
  surfaceBright: '#FFFBF7',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F8F0E8',
  surfaceContainer: '#F2EAE1',
  surfaceContainerHigh: '#ECE3DA',
  surfaceContainerHighest: '#E6DDD3',
  surfaceVariant: '#F0E0D2',
  onSurfaceVariant: '#51443A',
  outline: '#847568',
  outlineVariant: '#D6C4B4',
}

/**
 * `fidelity` pins `primaryContainer` to the seed in both modes. In dark mode
 * that leaves a light container with dark `on` text, which breaks the ramp.
 * These values restore the normal dark-mode container relationship.
 */
const gingerContainerDark = {
  primaryContainer: '#7C3400',
  onPrimaryContainer: '#FFDBCA',
}

/** Warm charcoal-brown surfaces. No pure black, no neutral grey. */
const charcoalSurfaces = {
  background: '#1A120C',
  onBackground: '#F0E2D7',
  surface: '#1A120C',
  onSurface: '#F0E2D7',
  surfaceDim: '#1A120C',
  surfaceBright: '#423429',
  surfaceContainerLowest: '#140D07',
  surfaceContainerLow: '#231A14',
  surfaceContainer: '#281E17',
  surfaceContainerHigh: '#332821',
  surfaceContainerHighest: '#3F332B',
  surfaceVariant: '#51443A',
  onSurfaceVariant: '#D6C4B4',
  outline: '#9E8D7F',
  outlineVariant: '#51443A',
}

/**
 * Applies the rounded display face to the headline and display scales. Body,
 * title, and label scales keep the neutral face from `createMaterialTheme`.
 */
function withDisplayFont(typography: Theme['typography']): Theme['typography'] {
  const next = { ...typography }
  for (const key of Object.keys(next) as Array<keyof Theme['typography']>) {
    if (key.startsWith('display') || key.startsWith('headline')) {
      next[key] = { ...next[key], fontFamily: FONT_DISPLAY }
    }
  }
  return next
}

export const lightTheme = defineTheme<PurrfectTheme>({
  ...base.lightTheme,
  colors: {
    ...base.lightTheme.colors,
    ...creamSurfaces,
    ...sageLight,
    ...roseLight,
  },
  typography: withDisplayFont(base.lightTheme.typography),
  purrfect: purrfectLight,
})

export const darkTheme = defineTheme<PurrfectTheme>({
  ...base.darkTheme,
  colors: {
    ...base.darkTheme.colors,
    ...charcoalSurfaces,
    ...gingerContainerDark,
    ...sageDark,
    ...roseDark,
  },
  typography: withDisplayFont(base.darkTheme.typography),
  purrfect: purrfectDark,
})

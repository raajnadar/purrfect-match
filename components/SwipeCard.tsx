/**
 * One card in the behavior deck.
 *
 * Three nested `Motion.View` layers, each owning exactly one transform source.
 * They must stay separate: a React Native `transform` is a single style key,
 * so two transform styles in one array do not merge — the last one wins and
 * the first is dropped.
 *
 *   1. depth    — the resting place in the stack (translateY + scale)
 *   2. button   — the fly-off for a decision made with a button, not a swipe
 *   3. drag     — the live finger position and the swipe exit
 *                 (`useSwipe().animatedStyle`)
 *   4. rotate   — rotation, opacity, and rim color, all mapped from `swipeX`
 *
 * A swiped card exits through the hook: `onCommit` returns the exit transition
 * on the UI thread, and `onSwipeEnd` reports when the card is gone. A button
 * press has no gesture to continue, so layer 2 animates that case instead.
 */
import { useTheme } from '@rootnative/core'
import { Motion, useInterpolatedStyle } from '@rootnative/inertia'
import { useSwipe, type SwipeDirection } from '@rootnative/inertia-gestures'
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { StyleSheet } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'

import type { Trait } from '../data/traits'
import type { PurrfectTheme } from '../theme'
import { DecisionBadge } from './DecisionBadge'
import { TraitCard } from './TraitCard'

/** How far the card travels before it leaves the widest capped card width. */
const FLY_DISTANCE = 700

/** Thickness of the decision rim drawn around the card. */
const RIM_WIDTH = 2

/**
 * Card opacity at the far end of the drag range. The card fades as it leaves
 * the centre, which reads as the card letting go. It stays readable at the
 * commit threshold — that point is only 40% of the way along the range.
 */
const DRAG_MIN_OPACITY = 0.5

export interface SwipeCardHandle {
  /** Commits the card from a button press, a key press, or a screen reader. */
  commit: (direction: SwipeDirection) => void
}

interface SwipeCardProps {
  trait: Trait
  imageUri?: string
  /** True while the Cat API request is still running. */
  imagesLoading?: boolean
  /** `0` is the top card. Higher numbers sit further back in the stack. */
  depth: number
  /** Only the top card takes input. */
  active: boolean
  /** Fires once the card has left the screen. */
  onDecide: (trait: Trait, accepted: boolean) => void
}

export const SwipeCard = forwardRef<SwipeCardHandle, SwipeCardProps>(
  function SwipeCard(
    { trait, imageUri, imagesLoading, depth, active, onDecide },
    ref,
  ) {
    const theme = useTheme<PurrfectTheme>()
    const { colors, motion, purrfect, shape } = theme
    const { cardStack } = purrfect

    const [buttonFlyTo, setButtonFlyTo] = useState(0)

    // A ref, not state, so a second decision cannot land while the first
    // exit is still running.
    const decidedRef = useRef(false)

    const settle = useCallback(
      (direction: SwipeDirection) => {
        onDecide(trait, direction === 'right')
      },
      [onDecide, trait],
    )

    const swipe = useSwipe({
      directions: ['left', 'right'],
      distanceThreshold: cardStack.swipeThreshold,
      onCommit: (direction, info) => {
        'worklet'
        // The committed card continues past the edge instead of snapping
        // back. The release velocity carries into the spring, so a hard
        // flick leaves faster than a slow drag.
        return {
          x: {
            type: 'spring',
            ...motion.springFastSpatial,
            to: direction === 'right' ? FLY_DISTANCE : -FLY_DISTANCE,
            velocity: info.velocity.x,
          },
        }
      },
      onSwipe: () => {
        decidedRef.current = true
      },
      onSwipeEnd: (direction) => {
        // The exit ran, so the card is off screen and the deck can advance.
        if (!decidedRef.current) return
        settle(direction)
      },
    })

    const commit = useCallback(
      (direction: SwipeDirection) => {
        if (decidedRef.current) return
        if (direction !== 'left' && direction !== 'right') return
        decidedRef.current = true
        setButtonFlyTo(direction === 'right' ? FLY_DISTANCE : -FLY_DISTANCE)
      },
      [],
    )

    useImperativeHandle(ref, () => ({ commit }), [commit])

    // Rotation reaches its maximum well past the commit threshold, so the card
    // is still fairly level at the moment it decides.
    const rotationRange = cardStack.swipeThreshold * 2.5

    const tiltStyle = useInterpolatedStyle(
      swipe.swipeX,
      {
        rotate: [-cardStack.maxRotation, 0, cardStack.maxRotation],
        opacity: [DRAG_MIN_OPACITY, 1, DRAG_MIN_OPACITY],
        borderColor: [purrfect.no.color, colors.outlineVariant, purrfect.yes.color],
      },
      { inputRange: [-rotationRange, 0, rotationRange] },
    )

    const spatial = { type: 'spring', ...motion.springDefaultSpatial } as const
    const restingScale = 1 - depth * cardStack.scaleStep
    const restingOffset = depth * cardStack.offsetY

    return (
      <Motion.View
        // A card behind the top one must not take a touch that lands on the
        // sliver of it showing below the top card.
        pointerEvents={active ? 'auto' : 'none'}
        style={styles.layer}
        initial={{ translateY: restingOffset, scale: restingScale }}
        animate={{ translateY: restingOffset, scale: restingScale }}
        transition={spatial}
        accessibilityElementsHidden={!active}
        importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}
      >
        <Motion.View
          style={styles.layer}
          animate={{ translateX: buttonFlyTo }}
          transition={{ type: 'spring', ...motion.springFastSpatial }}
          onAnimationEnd={(info) => {
            // A transform group reports once, under the 'transform' sentinel.
            if (buttonFlyTo === 0 || info.key !== 'transform') return
            settle(buttonFlyTo > 0 ? 'right' : 'left')
          }}
        >
          <GestureDetector gesture={swipe.gesture}>
            <Motion.View style={[styles.layer, swipe.animatedStyle]}>
              <Motion.View
                style={[
                  styles.layer,
                  styles.rim,
                  // The rim sits outside the card, so its radius is the card
                  // radius plus its own width. That keeps the two curves flush.
                  { borderRadius: shape.cornerExtraLarge + RIM_WIDTH },
                  tiltStyle,
                ]}
              >
                <TraitCard
                  trait={trait}
                  imageUri={imageUri}
                  imagesLoading={imagesLoading}
                />

                <DecisionBadge
                  decision="yes"
                  progress={swipe.swipeX}
                  threshold={cardStack.swipeThreshold}
                />
                <DecisionBadge
                  decision="no"
                  progress={swipe.swipeX}
                  threshold={cardStack.swipeThreshold}
                />
              </Motion.View>
            </Motion.View>
          </GestureDetector>
        </Motion.View>
      </Motion.View>
    )
  },
)

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
  rim: {
    borderWidth: RIM_WIDTH,
  },
})

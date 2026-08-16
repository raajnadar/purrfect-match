/**
 * Phase 2 — the gift reveal.
 *
 * A draggable bottom sheet slides up when the deck ends. The rows inside
 * cascade in once the sheet settles at a snap point, not on mount. That order
 * matters: a stagger that runs while the sheet is still travelling reads as two
 * competing animations.
 *
 * `BottomSheet` owns the drag, the snap points, and the scrim. It needs a
 * `PortalHost` at the app root — see `app/_layout.tsx`.
 */
import { BottomSheet } from '@rootnative/components/bottom-sheet'
import { Button } from '@rootnative/components/button'
import { Column, Row } from '@rootnative/components/layout'
import { Typography } from '@rootnative/components/typography'
import { useBreakpointValue, useTheme } from '@rootnative/core'
import { Motion } from '@rootnative/inertia'
import { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { pickGifts } from '../data/gifts'
import type { Trait } from '../data/traits'
import type { PurrfectTheme } from '../theme'
import { GiftListItem } from './GiftListItem'

/**
 * Delay between the sheet opening and the first row entering. The sheet's own
 * travel needs to be visibly under way before the cascade starts, or the two
 * animations read as one confused move.
 */
const REVEAL_DELAY_MS = 220

interface GiftSheetProps {
  visible: boolean
  /** The traits the user said yes to. Drives the recommendation. */
  accepted: Trait[]
  onDismiss: () => void
  onSelectGift: (giftId: string) => void
  onRestart: () => void
}

export function GiftSheet({
  visible,
  accepted,
  onDismiss,
  onSelectGift,
  onRestart,
}: GiftSheetProps) {
  const theme = useTheme<PurrfectTheme>()
  const { colors, motion } = theme

  const [revealed, setRevealed] = useState(false)

  const matches = pickGifts(accepted)

  // On a wide window the sheet's own width is capped by the host, so the
  // content column is what needs the cap. The list must not run edge to edge
  // across a desktop browser.
  const contentWidth = useBreakpointValue({
    compact: undefined,
    medium: 520,
    expanded: 600,
  })

  useEffect(() => {
    if (!visible) {
      setRevealed(false)
      return
    }
    const timer = setTimeout(() => setRevealed(true), REVEAL_DELAY_MS)
    return () => clearTimeout(timer)
  }, [visible])

  // A drag to a taller snap point must not replay the cascade. Once the rows
  // are in, they stay in.
  const handleSnapIndexChange = useCallback(() => {
    setRevealed(true)
  }, [])

  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoints={['55%', '92%']}
      onSnapIndexChange={handleSnapIndexChange}
      containerColor={colors.surfaceContainerLow}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { maxWidth: contentWidth }]}
        showsVerticalScrollIndicator={false}
      >
        <Column gap="md" style={styles.column}>
          {/* The header leads the cascade at index 0, so the rows read as
              following it rather than racing it. */}
          <Motion.View
            initial={{ opacity: 0, translateY: 20 }}
            animate={
              revealed
                ? { opacity: 1, translateY: 0 }
                : { opacity: 0, translateY: 20 }
            }
            transition={{ type: 'spring', ...motion.springDefaultSpatial }}
          >
            <Column gap="xs">
              <Typography
                variant="headlineSmallEmphasized"
                color={colors.primary}
              >
                Gifts for your cat
              </Typography>
              <Typography variant="bodyMedium" color={colors.onSurfaceVariant}>
                {matches.length > 0
                  ? `${matches.length} matches from ${accepted.length} traits. The best fit is first.`
                  : 'You said no to every trait, so there is nothing to match yet.'}
              </Typography>
            </Column>
          </Motion.View>

          {matches.length > 0 ? (
            <Column gap="sm">
              {matches.map((match, index) => (
                <GiftListItem
                  key={match.gift.id}
                  match={match}
                  // The header holds slot 0, so the first row starts at 1.
                  index={index + 1}
                  revealed={revealed}
                  onPress={onSelectGift}
                />
              ))}
            </Column>
          ) : null}

          <Row gap="sm" style={styles.actions}>
            <Button
              variant="tonal"
              leadingIcon="restart"
              style={styles.action}
              onPress={onRestart}
            >
              Start again
            </Button>
          </Row>
        </Column>
      </ScrollView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    // Centres the column once `maxWidth` caps it on a wide window.
    width: '100%',
    alignSelf: 'center',
  },
  column: {
    width: '100%',
  },
  actions: {
    width: '100%',
  },
  action: {
    flex: 1,
  },
})

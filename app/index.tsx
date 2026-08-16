/**
 * Phase 1 — the behavior deck.
 *
 * A stack of cards asks one behavioral question each. The user swipes right
 * for "Yes" and left for "No", or presses the two buttons below the deck. The
 * buttons are the pointer, keyboard, and screen-reader path; the gesture alone
 * does not reach a keyboard.
 *
 * This screen runs full-bleed behind the status bar, so it uses `immersive`
 * and applies the safe-area insets to the content column itself.
 */
import { Button } from '@rootnative/components/button'
import { Box, Column, Layout, Row } from '@rootnative/components/layout'
import { LinearProgress } from '@rootnative/components/progress'
import { Typography } from '@rootnative/components/typography'
import { useBreakpointValue, useTheme } from '@rootnative/core'
import { router } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { DeckSummary } from '../components/DeckSummary'
import { GiftSheet } from '../components/GiftSheet'
import { PawPattern } from '../components/PawPattern'
import { SwipeCard, type SwipeCardHandle } from '../components/SwipeCard'
import { TRAITS, type Trait } from '../data/traits'
import { useCatImages } from '../hooks/useCatImages'
import type { PurrfectTheme } from '../theme'

export default function DeckScreen() {
  const theme = useTheme<PurrfectTheme>()
  const { colors, purrfect } = theme
  const { cardStack } = purrfect

  const insets = useSafeAreaInsets()
  const { urls, loading, failed, reload } = useCatImages(TRAITS.length)

  const [index, setIndex] = useState(0)
  const [acceptedIds, setAcceptedIds] = useState<string[]>([])
  const [sheetOpen, setSheetOpen] = useState(false)
  const topCard = useRef<SwipeCardHandle>(null)

  // A phone is `compact`. A tablet, a split view, and a browser window are
  // not, so the deck is capped and centred instead of filling the width.
  const deckWidth = useBreakpointValue({
    compact: 400,
    medium: 440,
    expanded: 460,
  })

  const done = index >= TRAITS.length
  const visible = TRAITS.slice(index, index + cardStack.visibleDepth)

  const accepted = useMemo(
    () => TRAITS.filter((trait) => acceptedIds.includes(trait.id)),
    [acceptedIds],
  )

  const handleDecide = useCallback((trait: Trait, isAccepted: boolean) => {
    if (isAccepted) setAcceptedIds((ids) => [...ids, trait.id])
    setIndex((current) => current + 1)
  }, [])

  const restart = useCallback(() => {
    setSheetOpen(false)
    setAcceptedIds([])
    setIndex(0)
  }, [])

  const openSheet = useCallback(() => setSheetOpen(true), [])

  const handleSelectGift = useCallback((giftId: string) => {
    router.push(`/gift/${giftId}`)
  }, [])

  // The last card has to finish its fly-off before the sheet arrives. The
  // sheet is the reward for completing the deck, so it opens on its own.
  useEffect(() => {
    if (!done) return
    const timer = setTimeout(() => setSheetOpen(true), 420)
    return () => clearTimeout(timer)
  }, [done])

  return (
    <Layout immersive style={[styles.root, { backgroundColor: colors.background }]}>
      <PawPattern />

      <Column
        gap="md"
        style={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <Column gap="sm" style={[styles.column, { maxWidth: deckWidth }]}>
          <Row align="center" style={styles.titleRow}>
            <Column style={styles.titleText}>
              <Typography variant="headlineSmallEmphasized" color={colors.primary}>
                Purrfect Match
              </Typography>
              <Typography variant="bodySmall" color={colors.onSurfaceVariant}>
                {done
                  ? 'Every trait answered.'
                  : `Trait ${index + 1} of ${TRAITS.length}`}
              </Typography>
            </Column>

            {failed ? (
              <Button variant="text" leadingIcon="refresh" onPress={reload}>
                Photos
              </Button>
            ) : null}
          </Row>

          <LinearProgress
            progress={index / TRAITS.length}
            contentColor={colors.primary}
            containerColor={colors.surfaceContainerHigh}
          />
        </Column>

        <Box style={styles.deckArea}>
          {done ? (
            <Box style={[styles.column, { maxWidth: deckWidth }]}>
              <DeckSummary
                accepted={accepted}
                total={TRAITS.length}
                onRestart={restart}
                onShowGifts={openSheet}
              />
            </Box>
          ) : (
            <Box style={[styles.stack, { maxWidth: deckWidth }]}>
              {/* Reversed so the top card is the last sibling and paints above
                  the rest. `depth` counts back from the top card at 0. */}
              {[...visible].reverse().map((trait, position) => {
                const depth = visible.length - 1 - position
                return (
                  <SwipeCard
                    key={trait.id}
                    ref={depth === 0 ? topCard : undefined}
                    trait={trait}
                    imageUri={urls[index + depth]}
                    imagesLoading={loading}
                    depth={depth}
                    active={depth === 0}
                    onDecide={handleDecide}
                  />
                )
              })}
            </Box>
          )}
        </Box>

        {done ? null : (
          <Row gap="sm" style={[styles.column, { maxWidth: deckWidth }]}>
            <Button
              variant="tonal"
              size="l"
              leadingIcon="close"
              containerColor={purrfect.no.container}
              contentColor={purrfect.no.onContainer}
              style={styles.action}
              onPress={() => topCard.current?.commit('left')}
            >
              No
            </Button>
            <Button
              variant="filled"
              size="l"
              leadingIcon="heart"
              containerColor={purrfect.yes.color}
              contentColor={purrfect.yes.on}
              style={styles.action}
              onPress={() => topCard.current?.commit('right')}
            >
              Yes
            </Button>
          </Row>
        )}
      </Column>

      <GiftSheet
        visible={sheetOpen}
        accepted={accepted}
        onDismiss={() => setSheetOpen(false)}
        onSelectGift={handleSelectGift}
        onRestart={restart}
      />
    </Layout>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  column: {
    width: '100%',
  },
  titleRow: {
    width: '100%',
    justifyContent: 'space-between',
  },
  titleText: {
    flexShrink: 1,
  },
  deckArea: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stack: {
    flex: 1,
    width: '100%',
  },
  action: {
    flex: 1,
  },
})

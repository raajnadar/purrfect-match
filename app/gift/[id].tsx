/**
 * The gift detail view.
 *
 * Phase 2 routes here from a row in the gift sheet. The screen pairs the
 * thumbnail's `layoutId`, so Inertia already FLIPs the small square into the
 * hero block. Phase 3 takes this further: a full-bleed hero image and a palette
 * extracted from the product art.
 */
import { Button } from '@rootnative/components/button'
import { Chip } from '@rootnative/components/chip'
import { Column, Layout, Row } from '@rootnative/components/layout'
import { Typography } from '@rootnative/components/typography'
import { useBreakpointValue, useTheme } from '@rootnative/core'
import { Motion } from '@rootnative/inertia'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { ScrollView, StyleSheet } from 'react-native'

import { GIFTS } from '../../data/gifts'
import type { PurrfectTheme } from '../../theme'

/** Height of the hero block. The shared element grows into it. */
const HERO_HEIGHT = 240

export default function GiftDetailScreen() {
  const theme = useTheme<PurrfectTheme>()
  const { colors, motion, purrfect, shape } = theme

  const { id, match } = useLocalSearchParams<{ id: string; match?: string }>()
  const gift = GIFTS.find((item) => item.id === id)

  // The sheet passes the score on the route. A gift opened by a direct link
  // has no profile behind it, so the badge simply does not render.
  const matchPercent = Number.parseInt(match ?? '', 10)
  const hasMatch = Number.isFinite(matchPercent)

  const contentWidth = useBreakpointValue({
    compact: undefined,
    medium: 560,
    expanded: 640,
  })

  if (!gift) {
    return (
      <Layout edges={['top', 'bottom']} style={styles.missing}>
        <Column gap="md" align="center">
          <Typography variant="titleLarge" color={colors.onSurface}>
            That gift is not in the catalogue.
          </Typography>
          <Button variant="tonal" leadingIcon="arrow-left" onPress={router.back}>
            Go back
          </Button>
        </Column>
      </Layout>
    )
  }

  return (
    <Layout edges={['top', 'bottom']} style={{ backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { maxWidth: contentWidth }]}
        showsVerticalScrollIndicator={false}
      >
        <Column gap="md" style={styles.column}>
          <Row>
            <Button variant="text" leadingIcon="arrow-left" onPress={router.back}>
              Back
            </Button>
          </Row>

          {/* Same `layoutId` as the list thumbnail. Inertia measures both and
              interpolates the rect between them. */}
          <Motion.View
            layoutId={`gift-thumb-${gift.id}`}
            style={[
              styles.hero,
              {
                borderRadius: shape.cornerExtraLarge,
                backgroundColor: gift.swatch,
              },
            ]}
          >
            <MaterialCommunityIcons
              name={gift.icon}
              size={96}
              color={colors.surfaceContainerLowest}
            />
          </Motion.View>

          <Motion.View
            initial={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', ...motion.springDefaultSpatial, delay: 120 }}
          >
            <Column gap="sm">
              <Row align="center" style={styles.titleRow}>
                <Typography
                  variant="headlineMediumEmphasized"
                  color={colors.onSurface}
                  style={styles.name}
                >
                  {gift.name}
                </Typography>
                <Typography variant="titleLargeEmphasized" color={colors.primary}>
                  {`$${gift.price}`}
                </Typography>
              </Row>

              {hasMatch ? (
                <Row gap="xs" align="center">
                  <MaterialCommunityIcons
                    name="heart"
                    size={18}
                    color={purrfect.yes.color}
                  />
                  <Typography
                    variant="titleMediumEmphasized"
                    color={purrfect.yes.color}
                  >
                    {`${matchPercent}% match for your cat`}
                  </Typography>
                </Row>
              ) : null}

              <Typography variant="titleMedium" color={colors.onSurfaceVariant}>
                {gift.tagline}
              </Typography>

              <Typography variant="bodyLarge" color={colors.onSurface}>
                {gift.description}
              </Typography>

              <Row gap="xs" wrap>
                {gift.tags.map((tag) => (
                  <Chip key={tag} variant="assist">
                    {tag}
                  </Chip>
                ))}
              </Row>
            </Column>
          </Motion.View>
        </Column>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    width: '100%',
    alignSelf: 'center',
  },
  column: {
    width: '100%',
  },
  hero: {
    width: '100%',
    height: HERO_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titleRow: {
    justifyContent: 'space-between',
    gap: 12,
  },
  name: {
    flexShrink: 1,
  },
})

/**
 * What the deck shows once every trait is answered.
 *
 * The Phase 2 gift sheet opens over this panel on its own. The panel stays
 * behind it, so a user who dismisses the sheet still sees the result and has a
 * way back to the gifts.
 */
import { Button } from '@rootnative/components/button'
import { Card } from '@rootnative/components/card'
import { Chip } from '@rootnative/components/chip'
import { Column, Row } from '@rootnative/components/layout'
import { Typography } from '@rootnative/components/typography'
import { useTheme } from '@rootnative/core'
import { Motion } from '@rootnative/inertia'
import { StyleSheet } from 'react-native'

import type { Trait } from '../data/traits'
import type { PurrfectTheme } from '../theme'

interface DeckSummaryProps {
  accepted: Trait[]
  total: number
  onRestart: () => void
  /** Reopens the gift sheet after the user dismisses it. */
  onShowGifts: () => void
}

export function DeckSummary({
  accepted,
  total,
  onRestart,
  onShowGifts,
}: DeckSummaryProps) {
  const theme = useTheme<PurrfectTheme>()
  const { colors, motion, purrfect } = theme

  return (
    <Motion.View
      style={styles.root}
      initial={{ opacity: 0, scale: 0.92, translateY: 24 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', ...motion.springDefaultSpatial }}
    >
      <Card variant="filled" containerColor={colors.surfaceContainer}>
        <Card.Content>
          <Column gap="sm">
            <Typography variant="headlineSmallEmphasized" color={colors.primary}>
              Profile complete
            </Typography>
            <Typography variant="bodyLarge" color={colors.onSurfaceVariant}>
              {`Your cat matches ${accepted.length} of ${total} traits.`}
            </Typography>

            {accepted.length > 0 ? (
              <Row gap="xs" wrap>
                {accepted.map((trait) => (
                  <Chip
                    key={trait.id}
                    variant="assist"
                    leadingIcon={trait.icon}
                    containerColor={purrfect.yes.container}
                    contentColor={purrfect.yes.onContainer}
                  >
                    {trait.label}
                  </Chip>
                ))}
              </Row>
            ) : (
              <Typography variant="bodyMedium" color={colors.onSurfaceVariant}>
                You said no to every trait. Run the deck again to change an
                answer.
              </Typography>
            )}

            <Typography variant="bodySmall" color={colors.onSurfaceVariant}>
              {accepted.length > 0
                ? 'Open the gift list to see what matches these traits.'
                : 'Gifts need at least one yes.'}
            </Typography>
          </Column>
        </Card.Content>
        <Card.Actions align="end">
          <Button variant="text" leadingIcon="restart" onPress={onRestart}>
            Start again
          </Button>
          {accepted.length > 0 ? (
            <Button variant="filled" leadingIcon="gift-outline" onPress={onShowGifts}>
              Gifts
            </Button>
          ) : null}
        </Card.Actions>
      </Card>
    </Motion.View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
})

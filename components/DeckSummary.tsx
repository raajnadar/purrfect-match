/**
 * What the deck shows once every trait is answered.
 *
 * Phase 2 replaces this panel with the gift-reveal bottom sheet. It stands in
 * for now so the deck has a real end state and the swipe data is visible.
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
}

export function DeckSummary({ accepted, total, onRestart }: DeckSummaryProps) {
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
              Phase 2 turns these traits into gift recommendations.
            </Typography>
          </Column>
        </Card.Content>
        <Card.Actions align="end">
          <Button variant="tonal" leadingIcon="restart" onPress={onRestart}>
            Start again
          </Button>
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

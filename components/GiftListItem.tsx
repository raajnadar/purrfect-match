/**
 * One gift row in the Phase 2 reveal sheet.
 *
 * The row animates its own entrance but does not time it. The `<Stagger>` in
 * `GiftSheet` owns the cascade and hands each row its delay, so a filtered or
 * reordered list re-derives the order on its own.
 */
import { Card } from '@rootnative/components/card'
import { Chip } from '@rootnative/components/chip'
import { Column, Row } from '@rootnative/components/layout'
import { Typography } from '@rootnative/components/typography'
import { useTheme } from '@rootnative/core'
import { Motion } from '@rootnative/inertia'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'

import type { GiftMatch } from '../data/gifts'
import type { PurrfectTheme } from '../theme'
import { MatchRing } from './MatchRing'

/** How far each row travels up as it enters. */
const RISE_PX = 28

/** Side of the square thumbnail. */
const THUMB_SIZE = 56

interface GiftListItemProps {
  match: GiftMatch
  /** True once the sheet settled. The rows wait for it. */
  revealed: boolean
  onPress: (giftId: string, matchPercent: number) => void
}

export function GiftListItem({ match, revealed, onPress }: GiftListItemProps) {
  const theme = useTheme<PurrfectTheme>()
  const { colors, motion, purrfect } = theme
  const { gift, reasons, matchPercent } = match

  return (
    <Motion.View
      style={styles.root}
      initial={{ opacity: 0, translateY: RISE_PX, scale: 0.96 }}
      animate={
        revealed
          ? { opacity: 1, translateY: 0, scale: 1 }
          : { opacity: 0, translateY: RISE_PX, scale: 0.96 }
      }
      transition={{ type: 'spring', ...motion.springDefaultSpatial }}
    >
      <Card
        variant="filled"
        containerColor={colors.surfaceContainerHigh}
        onPress={() => onPress(gift.id, matchPercent)}
        accessibilityLabel={`${gift.name}. ${matchPercent} percent match, ${gift.price} dollars. ${gift.tagline}`}
      >
        <Card.Content>
          <Row gap="md" align="center">
            {/* The thumbnail is the Phase 3 shared-element source, so the
                `layoutId` wrapper stays. The ring inside it carries the match
                strength, and the icon keeps the product swatch so the
                transition still has a color to interpolate. */}
            <Motion.View
              layoutId={`gift-thumb-${gift.id}`}
              style={styles.thumb}
            >
              <MatchRing
                percent={matchPercent}
                size={THUMB_SIZE}
                icon={gift.icon}
                swatch={gift.swatch}
                revealed={revealed}
              />
            </Motion.View>

            <Column gap="xs" style={styles.text}>
              <Row gap="sm" align="center" style={styles.titleRow}>
                <Typography
                  variant="titleMediumEmphasized"
                  color={colors.onSurface}
                  numberOfLines={1}
                  style={styles.name}
                >
                  {gift.name}
                </Typography>
                <Typography variant="titleSmall" color={colors.primary}>
                  {`$${gift.price}`}
                </Typography>
              </Row>

              <Row gap="xs" align="center">
                <Typography variant="labelLarge" color={purrfect.yes.color}>
                  {`${matchPercent}% match`}
                </Typography>
                <Typography
                  variant="bodySmall"
                  color={colors.onSurfaceVariant}
                  numberOfLines={1}
                  style={styles.tagline}
                >
                  {gift.tagline}
                </Typography>
              </Row>

              <Row gap="xs" wrap>
                {reasons.map((reason) => (
                  <Chip
                    key={reason}
                    variant="assist"
                    containerColor={purrfect.yes.container}
                    contentColor={purrfect.yes.onContainer}
                    labelStyle={styles.reasonLabel}
                  >
                    {reason}
                  </Chip>
                ))}
              </Row>
            </Column>

            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.onSurfaceVariant}
            />
          </Row>
        </Card.Content>
      </Card>
    </Motion.View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    flexShrink: 1,
  },
  text: {
    flex: 1,
  },
  titleRow: {
    justifyContent: 'space-between',
  },
  name: {
    flexShrink: 1,
  },
  reasonLabel: {
    fontSize: 11,
  },
})

/**
 * One gift row in the Phase 2 reveal sheet.
 *
 * The row owns its own entrance animation. `index` sets the delay, so a list
 * of rows cascades in order without a parent orchestrator. The delay is on the
 * `transition`, not on a timer, so the animation stays on the UI thread.
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

/** Delay in ms between one row's entrance and the next. */
const STAGGER_MS = 60

/** How far each row travels up as it enters. */
const RISE_PX = 28

/** Side of the square thumbnail. */
const THUMB_SIZE = 56

interface GiftListItemProps {
  match: GiftMatch
  /** Position in the list. Sets the entrance delay. */
  index: number
  /** True once the sheet settled. The rows wait for it. */
  revealed: boolean
  onPress: (giftId: string) => void
}

export function GiftListItem({
  match,
  index,
  revealed,
  onPress,
}: GiftListItemProps) {
  const theme = useTheme<PurrfectTheme>()
  const { colors, motion, shape, purrfect } = theme
  const { gift, reasons } = match

  return (
    <Motion.View
      style={styles.root}
      initial={{ opacity: 0, translateY: RISE_PX, scale: 0.96 }}
      animate={
        revealed
          ? { opacity: 1, translateY: 0, scale: 1 }
          : { opacity: 0, translateY: RISE_PX, scale: 0.96 }
      }
      transition={{
        type: 'spring',
        ...motion.springDefaultSpatial,
        // Only the entrance cascades. A reversed list must not stagger back
        // out, so the delay applies while `revealed` is true.
        delay: revealed ? index * STAGGER_MS : 0,
      }}
    >
      <Card
        variant="filled"
        containerColor={colors.surfaceContainerHigh}
        onPress={() => onPress(gift.id)}
        accessibilityLabel={`${gift.name}, ${gift.price} dollars. ${gift.tagline}`}
      >
        <Card.Content>
          <Row gap="md" align="center">
            {/* The thumbnail is the Phase 3 shared-element source. It keeps
                the product swatch so the transition has a color to carry. */}
            <Motion.View
              layoutId={`gift-thumb-${gift.id}`}
              style={[
                styles.thumb,
                {
                  borderRadius: shape.cornerLarge,
                  backgroundColor: gift.swatch,
                },
              ]}
            >
              <MaterialCommunityIcons
                name={gift.icon}
                size={28}
                color={colors.surfaceContainerLowest}
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

              <Typography
                variant="bodySmall"
                color={colors.onSurfaceVariant}
                numberOfLines={1}
              >
                {gift.tagline}
              </Typography>

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

/**
 * The face of one deck card: a cat photo above the behavioral question.
 *
 * The card owns its own image loading state. Until the photo decodes, a
 * `Skeleton` covers the media region. A failed or missing URL falls back to a
 * paw glyph on a themed surface, so the deck still reads correctly offline.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Card } from '@rootnative/components/card'
import { Box, Column, Row } from '@rootnative/components/layout'
import { Typography } from '@rootnative/components/typography'
import { useTheme } from '@rootnative/core'
import { useState } from 'react'
import { Image, StyleSheet } from 'react-native'

import type { Trait } from '../data/traits'
import type { PurrfectTheme } from '../theme'
import { Skeleton } from './Skeleton'

interface TraitCardProps {
  trait: Trait
  /** Photo URL. Undefined while the Cat API request is in flight or failed. */
  imageUri?: string
  /**
   * True while the Cat API request is still running. Without it an undefined
   * `imageUri` is ambiguous — "not here yet" and "not coming" look the same,
   * and the card shows the no-photo glyph the moment it mounts.
   */
  imagesLoading?: boolean
}

export function TraitCard({
  trait,
  imageUri,
  imagesLoading = false,
}: TraitCardProps) {
  const theme = useTheme<PurrfectTheme>()
  const { colors, purrfect, shape } = theme

  const [loaded, setLoaded] = useState(false)
  const [broken, setBroken] = useState(false)

  const showPhoto = Boolean(imageUri) && !broken
  // The skeleton covers both waits: the URL arriving, and the photo decoding.
  const showSkeleton = imagesLoading || (showPhoto && !loaded)
  // The paw glyph means "no photo is coming", so it waits for the request.
  const showFallback = !imagesLoading && !showPhoto

  return (
    <Card
      variant="elevated"
      style={[styles.card, { borderRadius: shape.cornerExtraLarge }]}
      accessibilityLabel={`${trait.label}. ${trait.question}`}
    >
      <Card.Media style={styles.media}>
        <Box style={styles.mediaInner} bg={colors.surfaceContainerHigh}>
          {showPhoto ? (
            <Image
              // A new URL must reset the loading state, so the URL keys the image.
              key={imageUri}
              source={{ uri: imageUri }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
              onLoad={() => setLoaded(true)}
              onError={() => setBroken(true)}
              accessibilityLabel={`Photo of a cat for ${trait.label}`}
            />
          ) : null}

          {showSkeleton ? <Skeleton style={StyleSheet.absoluteFill} /> : null}

          {showFallback ? (
            <Box style={styles.fallback}>
              <MaterialCommunityIcons
                name="paw"
                size={56}
                color={purrfect.paw}
              />
            </Box>
          ) : null}
        </Box>
      </Card.Media>

      <Card.Content>
        <Row gap="xs" align="center">
          <Box
            px="sm"
            py={6}
            bg={colors.secondaryContainer}
            style={{ borderRadius: shape.cornerFull }}
          >
            <Row gap="xs" align="center">
              <MaterialCommunityIcons
                name={trait.icon}
                size={16}
                color={colors.onSecondaryContainer}
              />
              <Typography
                variant="labelMedium"
                color={colors.onSecondaryContainer}
              >
                {trait.label}
              </Typography>
            </Row>
          </Box>
        </Row>

        <Column gap="xs">
          <Typography variant="headlineSmallEmphasized" color={colors.onSurface}>
            {trait.question}
          </Typography>
          <Typography variant="bodyMedium" color={colors.onSurfaceVariant}>
            {trait.detail}
          </Typography>
        </Column>
      </Card.Content>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    // The media region is a child, so the card must clip it to its own radius.
    overflow: 'hidden',
  },
  media: {
    flex: 1,
  },
  mediaInner: {
    flex: 1,
  },
  fallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

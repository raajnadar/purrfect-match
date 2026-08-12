import { Button } from '@rootnative/components/button'
import { Card } from '@rootnative/components/card'
import { Box, Column, Layout, Row } from '@rootnative/components/layout'
import { Typography } from '@rootnative/components/typography'
import { useBreakpointValue, useTheme } from '@rootnative/core'
import { ScrollView, StyleSheet } from 'react-native'

import type { PurrfectTheme } from '../theme'

/** One color role, drawn as a filled swatch with its own `on*` label. */
function Swatch({
  label,
  color,
  onColor,
}: {
  label: string
  color: string
  onColor: string
}) {
  const theme = useTheme<PurrfectTheme>()

  return (
    <Box
      flex={1}
      p="md"
      bg={color}
      style={{ borderRadius: theme.shape.cornerLarge, minHeight: 72 }}
    >
      <Typography variant="labelLarge" color={onColor}>
        {label}
      </Typography>
      <Typography variant="labelSmall" color={onColor}>
        {color}
      </Typography>
    </Box>
  )
}

export default function ThemePreviewScreen() {
  const theme = useTheme<PurrfectTheme>()
  const { colors, purrfect } = theme

  // Cap the column so the preview does not stretch across a desktop browser.
  const contentWidth = useBreakpointValue({
    compact: 560,
    medium: 640,
    expanded: 720,
  })

  return (
    <Layout
      // `Layout` defaults to the bottom edge only, so the top inset must be
      // named. Without it the title renders under the status bar.
      edges={['top', 'bottom']}
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Column gap="lg" style={[styles.content, { maxWidth: contentWidth }]}>
          <Column gap="xs">
            <Typography variant="displaySmallEmphasized" color={colors.primary}>
              Purrfect Match
            </Typography>
            <Typography variant="bodyLarge" color={colors.onSurfaceVariant}>
              Warm Cattery theme preview. Every color comes from the theme.
            </Typography>
          </Column>

          <Column gap="sm">
            <Typography variant="titleMedium" color={colors.onSurface}>
              Brand roles
            </Typography>
            <Row gap="sm">
              <Swatch
                label="Primary"
                color={colors.primary}
                onColor={colors.onPrimary}
              />
              <Swatch
                label="Secondary"
                color={colors.secondary}
                onColor={colors.onSecondary}
              />
            </Row>
            <Row gap="sm">
              <Swatch
                label="Tertiary"
                color={colors.tertiary}
                onColor={colors.onTertiary}
              />
              <Swatch
                label="Error"
                color={colors.error}
                onColor={colors.onError}
              />
            </Row>
          </Column>

          <Column gap="sm">
            <Typography variant="titleMedium" color={colors.onSurface}>
              Swipe decisions
            </Typography>
            <Row gap="sm">
              <Swatch
                label="Yes — sage"
                color={purrfect.yes.color}
                onColor={purrfect.yes.on}
              />
              <Swatch
                label="No — rose"
                color={purrfect.no.color}
                onColor={purrfect.no.on}
              />
            </Row>
          </Column>

          <Column gap="sm">
            <Typography variant="titleMedium" color={colors.onSurface}>
              Surface ramp
            </Typography>
            <Row gap="sm">
              <Swatch
                label="Container"
                color={colors.surfaceContainer}
                onColor={colors.onSurface}
              />
              <Swatch
                label="High"
                color={colors.surfaceContainerHigh}
                onColor={colors.onSurface}
              />
              <Swatch
                label="Highest"
                color={colors.surfaceContainerHighest}
                onColor={colors.onSurface}
              />
            </Row>
          </Column>

          <Column gap="sm">
            <Typography variant="titleMedium" color={colors.onSurface}>
              Type scale
            </Typography>
            <Card variant="filled">
              <Card.Content>
                <Typography variant="headlineMediumEmphasized">
                  Baloo 2 headline
                </Typography>
                <Typography
                  variant="bodyMedium"
                  color={colors.onSurfaceVariant}
                >
                  Nunito Sans body text. The rounded display face carries the
                  headlines. The neutral face carries everything else.
                </Typography>
              </Card.Content>
              <Card.Actions align="start">
                <Button
                  variant="tonal"
                  containerColor={purrfect.no.container}
                  contentColor={purrfect.no.onContainer}
                  leadingIcon="close"
                >
                  Nope
                </Button>
                <Button
                  variant="filled"
                  containerColor={purrfect.yes.color}
                  contentColor={purrfect.yes.on}
                  leadingIcon="heart"
                >
                  Yes
                </Button>
              </Card.Actions>
            </Card>
          </Column>
        </Column>
      </ScrollView>
    </Layout>
  )
}

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    paddingBottom: 48,
    gap: 16,
    // Centers the capped column on a wide window.
    alignItems: 'center',
  },
  content: {
    width: '100%',
  },
})

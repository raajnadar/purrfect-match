import {
  Baloo2_500Medium,
  Baloo2_600SemiBold,
  Baloo2_700Bold,
} from '@expo-google-fonts/baloo-2'
import {
  NunitoSans_400Regular,
  NunitoSans_500Medium,
  NunitoSans_600SemiBold,
  NunitoSans_700Bold,
} from '@expo-google-fonts/nunito-sans'
import { PortalHost } from '@rootnative/components/portal'
import { ThemeProvider } from '@rootnative/core'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { useColorScheme } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { darkTheme, lightTheme } from '../theme'

SplashScreen.preventAutoHideAsync().catch(() => {
  // The splash screen was already hidden. Nothing to do.
})

export default function RootLayout() {
  const scheme = useColorScheme()
  const theme = scheme === 'light' ? lightTheme : darkTheme

  // The keys map the loaded files to the family names the theme asks for.
  // React Native resolves `fontFamily` by these keys, and it needs one key per
  // weight on Android.
  const [fontsLoaded, fontError] = useFonts({
    Baloo2: Baloo2_600SemiBold,
    Baloo2_500Medium,
    Baloo2_600SemiBold,
    Baloo2_700Bold,
    NunitoSans: NunitoSans_400Regular,
    NunitoSans_400Regular,
    NunitoSans_500Medium,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
  })

  useEffect(() => {
    // Hide the splash screen on an error too. A missing font must not block
    // the app forever.
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {})
    }
  }, [fontsLoaded, fontError])

  if (!fontsLoaded && !fontError) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        {/* The Phase 2 bottom sheet renders through this host, so it has to
            wrap the navigator. A host inside a screen cannot paint above it. */}
        <PortalHost>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: theme.colors.background },
            }}
          />
        </PortalHost>
        <StatusBar style={scheme === 'light' ? 'dark' : 'light'} />
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

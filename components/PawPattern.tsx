/**
 * A repeating paw-print texture for the deck background.
 *
 * The grid is built in code, not with an SVG `<Pattern>`. A plain `<G>` grid
 * renders the same way on web, Android, and iOS, and `preserveAspectRatio`
 * with `slice` makes it cover any window shape.
 */
import { useTheme } from '@rootnative/core'
import { StyleSheet } from 'react-native'
import Svg, { Circle, Ellipse, G } from 'react-native-svg'

import type { PurrfectTheme } from '../theme'

const TILE = 104
const COLUMNS = 7
const ROWS = 11

/** One paw: a large pad and four toes, drawn around the point (20, 24). */
function Paw({ color }: { color: string }) {
  return (
    <G fill={color}>
      <Ellipse cx={20} cy={31} rx={13} ry={11} />
      <Circle cx={6} cy={17} r={5} />
      <Circle cx={15} cy={9} r={5.4} />
      <Circle cx={26} cy={9} r={5.4} />
      <Circle cx={35} cy={17} r={5} />
    </G>
  )
}

/** Every second row is offset by half a tile, so the grid does not read as columns. */
const CELLS = Array.from({ length: ROWS * COLUMNS }, (_, i) => {
  const row = Math.floor(i / COLUMNS)
  const column = i % COLUMNS
  return {
    key: `paw-${i}`,
    x: column * TILE + (row % 2 === 1 ? TILE / 2 : 0),
    y: row * TILE,
    // Four rotations, cycled, so no two neighbours point the same way.
    rotate: (i % 4) * 17 - 26,
  }
})

export function PawPattern() {
  const { purrfect } = useTheme<PurrfectTheme>()

  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      viewBox={`0 0 ${COLUMNS * TILE} ${ROWS * TILE}`}
      preserveAspectRatio="xMidYMid slice"
      opacity={purrfect.pawOpacity}
      pointerEvents="none"
    >
      {CELLS.map((cell) => (
        <G
          key={cell.key}
          transform={`translate(${cell.x}, ${cell.y}) rotate(${cell.rotate}, 20, 24)`}
        >
          <Paw color={purrfect.paw} />
        </G>
      ))}
    </Svg>
  )
}

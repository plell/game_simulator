

export const UNIVERSE_SCALE = 1000

export const DATA_COLOR_PALETTE: Record<string, string> = {
  show: '#FF723C',
  clip: '#FFFF00',
  episode: '#FF7F50',
  guest: '#E066FF',
  topic: '#F8F8FF',
}

export const particleCount = 1000
export const radiusLimit = UNIVERSE_SCALE * 4
export const colorsArray = Object.values(DATA_COLOR_PALETTE).map((color) => color)

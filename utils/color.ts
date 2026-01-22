export const WEEKDAY_COLORS = [
  '#FFB3BA',
  '#FFDFBA',
  '#FFFFBA',
  '#BAE1FF',
  '#C7BAFF',
  '#E0BAFF',
  '#FFBAF3',
]

export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0]
}

export function applyOpacity(hexColor: string, opacity: number): string {
  const [r, g, b] = hexToRgb(hexColor)
  const alpha = Math.min(Math.max(opacity, 0), 1)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

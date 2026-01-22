import { Walk } from '@/domain/entities/walk'
import { WEEKDAY_COLORS } from '@/utils/color'
import { formatDateKey } from '@/utils/date'

export type WalkForMap = Walk & {
  sameDayIndex: number
  sameDayTotal: number
  color: string
  opacity: number
}

export const WalkMapService = {
  enrich(walks: Walk[]): WalkForMap[] {
    const walksByDate = new Map<string, Walk[]>()

    walks.forEach(walk => {
      const key = formatDateKey(walk.startTime)
      if (!walksByDate.has(key)) {
        walksByDate.set(key, [])
      }
      walksByDate.get(key)!.push(walk)
    })

    walksByDate.forEach(dayWalks => {
      dayWalks.sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      )
    })

    return walks.map(walk => {
      const key = formatDateKey(walk.startTime)
      const dayWalks = walksByDate.get(key)!
      const index = dayWalks.findIndex(w => w.walkId === walk.walkId)
      const total = dayWalks.length

      const baseColor = WEEKDAY_COLORS[walk.startTime.getDay()]
      const opacity =
        total > 1 ? Math.max(0.3, 1 - index * 0.12) : 1

      return {
        ...walk,
        sameDayIndex: index,
        sameDayTotal: total,
        color: baseColor,
        opacity,
      }
    })
  },
}

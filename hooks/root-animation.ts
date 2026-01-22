import { useRef, useState, useEffect } from 'react'
import { Animated } from 'react-native'
import MapView from 'react-native-maps'
import { Walk } from '@/domain/entities/walk'

type LatLng = {
  latitude: number
  longitude: number
}

export function useRouteAnimation(mapRef: React.RefObject<MapView | null>) {
  const [animatingWalkId, setAnimatingWalkId] = useState<string | null>(null)
  const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null)

  const animationProgress = useRef(new Animated.Value(0)).current
  const animationTriggered = useRef<string | null>(null)

  // cleanup（listener 多重登録防止）
  useEffect(() => {
    return () => {
      animationProgress.removeAllListeners()
    }
  }, [])

  const startAnimation = (
    walk: Walk,
    animationKey?: string
  ) => {
    if (walk.routePoints.length === 0) return

    const key = animationKey ?? walk.walkId
    if (animationTriggered.current === key) return
    animationTriggered.current = key

    setAnimatingWalkId(walk.walkId)
    animationProgress.setValue(0)

    // Map をルートにフィット
    if (mapRef.current) {
      const coordinates = walk.routePoints.map(p => ({
        latitude: p.latitude,
        longitude: p.longitude,
      }))

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      })
    }

    const totalPoints = walk.routePoints.length

    Animated.timing(animationProgress, {
      toValue: totalPoints - 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        setAnimatingWalkId(null)
        setMarkerPosition(null)
      }, 3000)
    })

    animationProgress.removeAllListeners()
    animationProgress.addListener(({ value }) => {
      const index = Math.floor(value)
      if (index < walk.routePoints.length) {
        setMarkerPosition({
          latitude: walk.routePoints[index].latitude,
          longitude: walk.routePoints[index].longitude,
        })
      }
    })
  }

  return {
    animatingWalkId,
    markerPosition,
    startAnimation,
    resetAnimationKey: () => {
      animationTriggered.current = null
    },
  }
}

import type { Ref } from 'vue-demi'
import type { Measurement } from '~/types/CESession'

const visibleMeasurements: Ref<Measurement[]> = ref([])
const activeMeasurement: Ref<Measurement | null> = ref(null)

function measureAngle(points: Array<number>) {
  const A = {
    x: points[0],
    y: points[1],
  }
  const B = {
    x: points[2],
    y: points[3],
  }
  const C = {
    x: points[4],
    y: points[5],
  }

  const crossProduct = (C.x - B.x) * (B.y - A.y) - (C.y - B.y) * (B.x - A.x)
  const dotProduct = (C.x - B.x) * (B.x - A.x) + (C.y - B.y) * (B.y - A.y)

  return 180 - (Math.atan2(crossProduct, dotProduct) * 180) / Math.PI
}

function measureDistance(points: Array<number>,
  width: number,
  height: number,
  pixelResolution: number) {
  const a = (points[0] - points[2]) * width
  const b = (points[1] - points[3]) * height
  const c = Math.sqrt(a * a + b * b)
  return c * pixelResolution
}

function getIntersectionPoint(points: Array<number>) {
  const a1 = points[3] - points[1]
  const b1 = points[0] - points[2]
  const c1 = a1 * points[0] + b1 * points[1]

  const a2 = points[7] - points[5]
  const b2 = points[4] - points[6]
  const c2 = a2 * points[4] + b2 * points[5]

  const determinant = a1 * b2 - a2 * b1
  if (determinant === 0) {
    return [Number.MAX_VALUE, Number.MAX_VALUE]
  }
  else {
    const x = (b2 * c1 - b1 * c2) / determinant
    const y = (a1 * c2 - a2 * c1) / determinant
    return [x, y]
  }
}

function clearMeasurements() {
  visibleMeasurements.value = []
  activeMeasurement.value = null
}

export default () => {
  return {
    visibleMeasurements,
    activeMeasurement,
    measureAngle,
    measureDistance,
    clearMeasurements,
    getIntersectionPoint,
  }
}

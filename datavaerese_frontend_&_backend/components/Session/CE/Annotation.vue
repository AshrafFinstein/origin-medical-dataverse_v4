<!-- eslint-disable @typescript-eslint/no-use-before-define -->
<script setup lang="ts">
import Konva from 'konva'
import type { PropType, Ref } from 'vue'
import type { ExtractedResourceMetadata } from '~~/models/extractedResource'
import type { Measurement } from '~~/models/cESession'

const props = defineProps({
  imageElement: {
    type: Object as PropType<HTMLImageElement>,
    required: true,
  },
  imageMetadata: {
    type: Object as PropType<ExtractedResourceMetadata>,
    required: true,
  },
  visibleMeasurements: {
    type: Array as PropType<Measurement[]>,
    required: true,
  },
  activeMeasurement: {
    type: null as unknown as PropType<Measurement | null>,

    validator: (v: any) => typeof v === 'object' || v === null,
    required: true,
  },
})

const emit = defineEmits([
  'update:visibleMeasurements',
  'update:activeMeasurement',
])

const { measureDistance, measureAngle, getIntersectionPoint } = useAnnotation()
const { visibleMeasurements, activeMeasurement } = useVModels(props, emit)

const canvasInfo: {
  stage?: Konva.Stage
  layer?: Konva.Layer
  baseWidth?: number
  distance: {
    placeholderDistance: Konva.Line | null
    placeholderMarker: Konva.Shape | null
    appendable: boolean
  }
  angle: {
    placeholderAngle: Konva.Line | null
    placeholderArc: Konva.Arc | null
    lockedPoints: number
    appendable: boolean
  }
  crossAngle: {
    placeholderFirstLine: Konva.Line | null
    placeholderSecondLine: Konva.Line | null
    placeholderArc: Konva.Arc | null
    lockedPoints: number
    appendable: boolean
  }
} = reactive({
  distance: {
    placeholderDistance: null,
    placeholderMarker: null,
    appendable: true,
  },
  angle: {
    placeholderAngle: null,
    placeholderArc: null,
    lockedPoints: 0,
    appendable: true,
  },
  crossAngle: {
    placeholderFirstLine: null,
    placeholderSecondLine: null,
    placeholderArc: null,
    lockedPoints: 0,
    appendable: true,
  },
})

const containerRef: Ref<HTMLDivElement | undefined> = ref()

function drawCanvas() {
  canvasInfo.stage = new Konva.Stage({

    container: containerRef.value!,
    width: props.imageElement.width,
    height: props.imageElement.height,
  })
  canvasInfo.layer = new Konva.Layer()
  canvasInfo.stage.add(canvasInfo.layer)

  canvasInfo.stage.on('click', () => {
    const point = canvasInfo.stage?.getPointerPosition()
    if (!point)
      throw new Error('no point')

    const clickToDrawDistance = (measurement: Measurement) => {
      if (!canvasInfo.distance.placeholderDistance) {
        canvasInfo.distance.placeholderDistance = new Konva.Line({
          fill: 'yellow',
          stroke: 'yellow',
          dash: [5],
          strokeWidth: 2,
          points: [point.x, point.y],
        })
        canvasInfo.distance.placeholderMarker = new Konva.Shape({
          x: point.x,
          y: point.y,
          fill: 'yellow',
          stroke: 'yellow',
          strokeWidth: 2,
          sceneFunc: (context, shape) => {
            context.beginPath()
            context.moveTo(0, 0 - 5)
            context.lineTo(0, 5 / 3)
            context.moveTo(0, 5 / 3)
            context.lineTo(0, 5)
            context.moveTo(-5, 0)
            context.lineTo(-5 / 3, 0)
            context.moveTo(5 / 3, 0)
            context.lineTo(5, 0)
            context.closePath()

            context.fillStrokeShape(shape)
          },
        })
        canvasInfo.layer?.add(canvasInfo.distance.placeholderMarker)
        canvasInfo.layer?.add(canvasInfo.distance.placeholderDistance)
      }
      else {
        measurement.points = [
          canvasInfo.distance.placeholderDistance.points()[0]
            / canvasInfo.stage!.width(),
          canvasInfo.distance.placeholderDistance.points()[1]
            / canvasInfo.stage!.height(),
          canvasInfo.distance.placeholderDistance.points()[2]
            / canvasInfo.stage!.width(),
          canvasInfo.distance.placeholderDistance.points()[3]
            / canvasInfo.stage!.height(),
        ]
        measurement.value = measureDistance(
          measurement.points,
          props.imageMetadata.width,
          props.imageMetadata.height,
          props.imageMetadata.pixelResolution,
        )
        if (!visibleMeasurements.value.includes(measurement))
          visibleMeasurements.value.push(measurement)
        canvasInfo.distance.placeholderDistance = null
        canvasInfo.distance.placeholderMarker = null
      }
    }

    const clickToDrawAngle = (measurement: Measurement) => {
      canvasInfo.angle.lockedPoints += 2
      if (!canvasInfo.angle.placeholderAngle) {
        canvasInfo.angle.placeholderAngle = new Konva.Line({
          stroke: 'yellow',
          strokeWidth: 1,
          points: [point.x, point.y],
        })
        canvasInfo.layer?.add(canvasInfo.angle.placeholderAngle)
      }
      else if (canvasInfo.angle.lockedPoints === 4) {
        canvasInfo.angle.placeholderArc = new Konva.Arc({
          x: canvasInfo.angle.placeholderAngle.points()[2],
          y: canvasInfo.angle.placeholderAngle.points()[3],
          innerRadius: 0,
          outerRadius: 0,
          stroke: 'yellow',
          strokeWidth: 1,
          angle: 0,
        })
        canvasInfo.layer?.add(canvasInfo.angle.placeholderArc)
      }
      else if (canvasInfo.angle.lockedPoints === 6) {
        measurement.points = [
          canvasInfo.angle.placeholderAngle.points()[0]
            / canvasInfo.stage!.width(),
          canvasInfo.angle.placeholderAngle.points()[1]
            / canvasInfo.stage!.height(),
          canvasInfo.angle.placeholderAngle.points()[2]
            / canvasInfo.stage!.width(),
          canvasInfo.angle.placeholderAngle.points()[3]
            / canvasInfo.stage!.height(),
          canvasInfo.angle.placeholderAngle.points()[4]
            / canvasInfo.stage!.width(),
          canvasInfo.angle.placeholderAngle.points()[5]
            / canvasInfo.stage!.height(),
        ]
        measurement.value = measureAngle(measurement.points)
        if (!visibleMeasurements.value.includes(measurement))
          visibleMeasurements.value.push(measurement)
        canvasInfo.angle.placeholderAngle = null
        canvasInfo.angle.placeholderArc = null
        canvasInfo.angle.lockedPoints = 0
      }
    }

    const clickToDrawCrossAngle = (measurement: Measurement) => {
      canvasInfo.crossAngle.lockedPoints += 2
      if (
        !canvasInfo.crossAngle.placeholderFirstLine
        && canvasInfo.crossAngle.lockedPoints === 2
      ) {
        canvasInfo.crossAngle.placeholderFirstLine = new Konva.Line({
          stroke: 'yellow',
          strokeWidth: 1,
          points: [point.x, point.y],
        })
        canvasInfo.layer?.add(canvasInfo.crossAngle.placeholderFirstLine)
      }
      else if (
        canvasInfo.crossAngle.placeholderFirstLine
        && canvasInfo.crossAngle.lockedPoints === 6
      ) {
        canvasInfo.crossAngle.placeholderSecondLine = new Konva.Line({
          stroke: 'yellow',
          strokeWidth: 1,
          points: [point.x, point.y],
        })
        canvasInfo.crossAngle.placeholderArc = new Konva.Arc({
          x: canvasInfo.crossAngle.placeholderFirstLine.points()[2],
          y: canvasInfo.crossAngle.placeholderFirstLine.points()[3],
          innerRadius: 0,
          outerRadius: 0,
          stroke: 'yellow',
          strokeWidth: 1,
          angle: 0,
        })
        canvasInfo.layer?.add(canvasInfo.crossAngle.placeholderSecondLine)
        canvasInfo.layer?.add(canvasInfo.crossAngle.placeholderArc)
      }
      else if (
        canvasInfo.crossAngle.placeholderFirstLine
        && canvasInfo.crossAngle.placeholderSecondLine
      ) {
        measurement.points = [
          canvasInfo.crossAngle.placeholderFirstLine.points()[0]
            / canvasInfo.stage!.width(),
          canvasInfo.crossAngle.placeholderFirstLine.points()[1]
            / canvasInfo.stage!.height(),
          canvasInfo.crossAngle.placeholderFirstLine.points()[2]
            / canvasInfo.stage!.width(),
          canvasInfo.crossAngle.placeholderFirstLine.points()[3]
            / canvasInfo.stage!.height(),
          canvasInfo.crossAngle.placeholderSecondLine.points()[0]
            / canvasInfo.stage!.width(),
          canvasInfo.crossAngle.placeholderSecondLine.points()[1]
            / canvasInfo.stage!.height(),
          canvasInfo.crossAngle.placeholderSecondLine.points()[2]
            / canvasInfo.stage!.width(),
          canvasInfo.crossAngle.placeholderSecondLine.points()[3]
            / canvasInfo.stage!.height(),
        ]

        const midPoint = getIntersectionPoint(measurement.points)

        measurement.value = measureAngle([
          measurement.points[0],
          measurement.points[1],
          midPoint[0],
          midPoint[1],
          measurement.points[6],
          measurement.points[7],
        ])

        if (!visibleMeasurements.value.includes(measurement))
          visibleMeasurements.value.push(measurement)
        canvasInfo.crossAngle.placeholderFirstLine = null
        canvasInfo.crossAngle.placeholderSecondLine = null
        canvasInfo.crossAngle.placeholderArc = null
        canvasInfo.angle.lockedPoints = 0
      }
    }

    if (activeMeasurement.value) {
      if (
        activeMeasurement.value.type === 'distance'
        && !activeMeasurement.value.points
        && !activeMeasurement.value.value
        && canvasInfo.distance.appendable
      )
        clickToDrawDistance(activeMeasurement.value)

      if (
        activeMeasurement.value.type === 'angle'
        && !activeMeasurement.value.points
        && !activeMeasurement.value.value
        && canvasInfo.angle.appendable
      )
        clickToDrawAngle(activeMeasurement.value)
      if (
        activeMeasurement.value.type === 'crossAngle'
        && !activeMeasurement.value.points
        && !activeMeasurement.value.value
        && canvasInfo.crossAngle.appendable
      )
        clickToDrawCrossAngle(activeMeasurement.value)
    }
  })

  canvasInfo.stage.on('mousemove touchmove', () => {
    const posEnd = canvasInfo.stage?.getPointerPosition()

    if (!posEnd)
      throw new Error('posEnd is null')

    const hoverToDrawPlaceholderDistance = () => {
      if (!canvasInfo.distance.placeholderDistance)
        return
      canvasInfo.distance.placeholderDistance.points([
        canvasInfo.distance.placeholderDistance.points()[0],
        canvasInfo.distance.placeholderDistance.points()[1],
        posEnd.x,
        posEnd.y,
      ])
    }

    const hoverToDrawPlaceholderAngle = () => {
      if (!canvasInfo.angle.placeholderAngle)
        return
      if (
        canvasInfo.angle.lockedPoints === 4
        && canvasInfo.angle.placeholderArc
      ) {
        const angle = measureAngle([
          canvasInfo.angle.placeholderAngle.points()[0],
          canvasInfo.angle.placeholderAngle.points()[1],
          canvasInfo.angle.placeholderAngle.points()[2],
          canvasInfo.angle.placeholderAngle.points()[3],
          posEnd.x,
          posEnd.y,
        ])
        const rotation = measureAngle([
          canvasInfo.stage!.width(),
          canvasInfo.angle.placeholderAngle.points()[3],
          canvasInfo.angle.placeholderAngle.points()[2],
          canvasInfo.angle.placeholderAngle.points()[3],
          canvasInfo.angle.placeholderAngle.points()[0],
          canvasInfo.angle.placeholderAngle.points()[1],
        ])

        canvasInfo.angle.placeholderArc.setAttrs({
          innerRadius: 20,
          outerRadius: 20,
          clockwise: angle > 180,
          angle,
          rotation,
        })
      }
      canvasInfo.angle.placeholderAngle.points([
        ...canvasInfo.angle.placeholderAngle
          .points()
          .slice(0, canvasInfo.angle.lockedPoints),
        posEnd.x,
        posEnd.y,
      ])
    }

    const hoverToDrawPlaceholderCrossAngle = () => {
      if (
        canvasInfo.crossAngle.placeholderFirstLine
        && canvasInfo.crossAngle.lockedPoints === 2
      ) {
        canvasInfo.crossAngle.placeholderFirstLine.points([
          ...canvasInfo.crossAngle.placeholderFirstLine.points().slice(0, 2),
          posEnd.x,
          posEnd.y,
        ])
      }
      else if (
        canvasInfo.crossAngle.placeholderFirstLine
        && canvasInfo.crossAngle.placeholderSecondLine
        && canvasInfo.crossAngle.placeholderArc
        && canvasInfo.crossAngle.lockedPoints === 6
      ) {
        const midPoint = getIntersectionPoint([
          canvasInfo.crossAngle.placeholderFirstLine.points()[0],
          canvasInfo.crossAngle.placeholderFirstLine.points()[1],
          canvasInfo.crossAngle.placeholderFirstLine.points()[2],
          canvasInfo.crossAngle.placeholderFirstLine.points()[3],
          canvasInfo.crossAngle.placeholderSecondLine.points()[0],
          canvasInfo.crossAngle.placeholderSecondLine.points()[1],
          canvasInfo.crossAngle.placeholderSecondLine.points()[2],
          canvasInfo.crossAngle.placeholderSecondLine.points()[3],
        ])
        const angle = measureAngle([
          canvasInfo.crossAngle.placeholderFirstLine.points()[0],
          canvasInfo.crossAngle.placeholderFirstLine.points()[1],
          midPoint[0],
          midPoint[1],
          posEnd.x,
          posEnd.y,
        ])
        const rotation = measureAngle([
          canvasInfo.stage!.width(),
          midPoint[1],
          midPoint[0],
          midPoint[1],
          canvasInfo.crossAngle.placeholderFirstLine.points()[0],
          canvasInfo.crossAngle.placeholderFirstLine.points()[1],
        ])
        canvasInfo.crossAngle.placeholderArc.setAttrs({
          x: midPoint[0],
          y: midPoint[1],
          innerRadius: 20,
          outerRadius: 20,
          clockwise: angle > 180,
          angle,
          rotation,
        })
        canvasInfo.crossAngle.placeholderSecondLine.points([
          ...canvasInfo.crossAngle.placeholderSecondLine.points().slice(0, 2),
          posEnd.x,
          posEnd.y,
        ])
      }
    }

    if (activeMeasurement.value?.type === 'distance')
      hoverToDrawPlaceholderDistance()
    else if (activeMeasurement.value?.type === 'angle')
      hoverToDrawPlaceholderAngle()
    else if (activeMeasurement.value?.type === 'crossAngle')
      hoverToDrawPlaceholderCrossAngle()
  })
}

function buildDistanceMarker(x: number,
  y: number,
  updateDistanceFunction: () => void,
  saveDistanceFunction: () => void,
  measurement: Measurement) {
  const marker = new Konva.Shape({
    x,
    y,
    strokeWidth: 2,
    draggable: activeMeasurement.value === measurement,
    sceneFunc: (context, shape) => {
      context.beginPath()
      context.moveTo(0, 0 - 5)
      context.lineTo(0, 5 / 3)
      context.moveTo(0, 5 / 3)
      context.lineTo(0, 5)
      context.moveTo(-5, 0)
      context.lineTo(-5 / 3, 0)
      context.moveTo(5 / 3, 0)
      context.lineTo(5, 0)
      context.closePath()

      context.fillStrokeShape(shape)
    },
    hitFunc: (context, shape) => {
      context.beginPath()
      context.arc(0, 0, 10, 0, Math.PI * 2, true)
      context.closePath()

      context.fillStrokeShape(shape)
    },
  })
  canvasInfo.layer?.add(marker)
  if (activeMeasurement.value === measurement) {
    marker.on('mouseenter', () => {
      canvasInfo.distance.appendable = false
      canvasInfo.stage!.container().style.cursor = 'grab'
    })

    marker.on('mouseleave', () => {
      canvasInfo.distance.appendable = true
      canvasInfo.stage!.container().style.cursor = 'default'
    })
    marker.on('dragstart', () => {
      canvasInfo.stage!.container().style.cursor = 'grabbing'
    })
    marker.on('dragmove', () => {
      canvasInfo.stage!.container().style.cursor = 'grabbing'
      updateDistanceFunction()
    })
    marker.on('dragend', () => {
      canvasInfo.stage!.container().style.cursor = 'grab'
      saveDistanceFunction()
    })
  }
  return marker
}

function buildText(x: number,
  y: number,
  value: string,
  measurement: Measurement) {
  const text = new Konva.Text({
    x,
    y,
    fontSize: 14,
    fontFamily: 'Calibri',
    strokeEnabled: false,
    text: ['angle', 'crossAngle'].includes(measurement.type)
      ? `${value}°`
      : `${value}mm`,
  })
  canvasInfo.layer?.add(text)
  return text
}

function buildAngleAnchor(x: number,
  y: number,
  updateAngleFunction: () => void,
  saveAngleFunction: () => void,
  measurement: Measurement) {
  const anchor = new Konva.Circle({
    x,
    y,
    radius: 10,
    visible: activeMeasurement.value === measurement,
    draggable: true,
  })

  canvasInfo.layer!.add(anchor)

  if (activeMeasurement.value === measurement) {
    anchor.on('mouseenter', () => {
      canvasInfo.angle.appendable = false
      canvasInfo.stage!.container().style.cursor = 'grab'
    })

    anchor.on('mouseleave', () => {
      canvasInfo.angle.appendable = true
      canvasInfo.stage!.container().style.cursor = 'default'
    })
    anchor.on('dragstart', () => {
      canvasInfo.stage!.container().style.cursor = 'grabbing'
    })
    anchor.on('dragmove', () => {
      canvasInfo.stage!.container().style.cursor = 'grabbing'
      updateAngleFunction()
    })
    anchor.on('dragend', () => {
      canvasInfo.stage!.container().style.cursor = 'grab'
      saveAngleFunction()
    })
  }
  return anchor
}

function drawAnnotation() {
  for (let i = 0; i < visibleMeasurements.value.length; i++) {
    if (
      visibleMeasurements.value[i].points
      && visibleMeasurements.value[i].value
    ) {
      switch (visibleMeasurements.value[i].type) {
        case 'distance': {
          const distance = new Konva.Line({
            dash: [5],
            strokeWidth: 2,
            points: [
              (visibleMeasurements.value[i].points![0]
                * props.imageElement.width)
                / canvasInfo.stage!.scaleX(),
              (visibleMeasurements.value[i].points![1]
                * props.imageElement.height)
                / canvasInfo.stage!.scaleY(),
              (visibleMeasurements.value[i].points![2]
                * props.imageElement.width)
                / canvasInfo.stage!.scaleX(),
              (visibleMeasurements.value[i].points![3]
                * props.imageElement.height)
                / canvasInfo.stage!.scaleY(),
            ],
          })
          const updateDistance = () => {
            distance.points([
              markers.A.x(),
              markers.A.y(),
              markers.B.x(),
              markers.B.y(),
            ])

            let textCoords = {
              x: markers.A.x(),
              y: markers.A.y(),
            }
            if (markers.B.x() > markers.A.x()) {
              textCoords = {
                x: markers.B.x(),
                y: markers.B.y(),
              }
            }

            text.setAttrs({
              x: textCoords.x + 10,
              y: textCoords.y,
              text: measureDistance(
                [
                  (distance.points()[0] / canvasInfo.stage!.width())
                    * canvasInfo.stage!.scaleX(),
                  (distance.points()[1] / canvasInfo.stage!.height())
                    * canvasInfo.stage!.scaleY(),
                  (distance.points()[2] / canvasInfo.stage!.width())
                    * canvasInfo.stage!.scaleX(),
                  (distance.points()[3] / canvasInfo.stage!.height())
                    * canvasInfo.stage!.scaleY(),
                ],
                props.imageMetadata.width,
                props.imageMetadata.height,
                props.imageMetadata.pixelResolution,
              ).toFixed(2),
            })
          }

          const saveDistance = () => {
            visibleMeasurements.value[i].points = [
              (distance.points()[0] / canvasInfo.stage!.width())
                * canvasInfo.stage!.scaleX(),
              (distance.points()[1] / canvasInfo.stage!.height())
                * canvasInfo.stage!.scaleY(),
              (distance.points()[2] / canvasInfo.stage!.width())
                * canvasInfo.stage!.scaleX(),
              (distance.points()[3] / canvasInfo.stage!.height())
                * canvasInfo.stage!.scaleY(),
            ]
            visibleMeasurements.value[i].value = measureDistance(
              visibleMeasurements.value[i].points!,
              props.imageMetadata.width,
              props.imageMetadata.height,
              props.imageMetadata.pixelResolution,
            )
          }

          const markers = {
            A: buildDistanceMarker(
              distance.points()[0],
              distance.points()[1],
              updateDistance,
              saveDistance,
              visibleMeasurements.value[i],
            ),
            B: buildDistanceMarker(
              distance.points()[2],
              distance.points()[3],
              updateDistance,
              saveDistance,
              visibleMeasurements.value[i],
            ),
          }

          let textCoords = {
            x: markers.A.x(),
            y: markers.A.y(),
          }
          if (markers.B.x() > markers.A.x()) {
            textCoords = {
              x: markers.B.x(),
              y: markers.B.y(),
            }
          }

          const text = buildText(
            textCoords.x + 10,
            textCoords.y,
            measureDistance(
              [
                (distance.points()[0] / canvasInfo.stage!.width())
                  * canvasInfo.stage!.scaleX(),
                (distance.points()[1] / canvasInfo.stage!.height())
                  * canvasInfo.stage!.scaleY(),
                (distance.points()[2] / canvasInfo.stage!.width())
                  * canvasInfo.stage!.scaleX(),
                (distance.points()[3] / canvasInfo.stage!.height())
                  * canvasInfo.stage!.scaleY(),
              ],
              props.imageMetadata.width,
              props.imageMetadata.height,
              props.imageMetadata.pixelResolution,
            ).toFixed(2),
            visibleMeasurements.value[i],
          )

          if (activeMeasurement.value === visibleMeasurements.value[i]) {
            distance.fill('red')
            distance.stroke('red')
            markers.A.stroke('red')
            markers.B.stroke('red')
            text.fill('red')
          }
          else {
            distance.fill('yellow')
            distance.stroke('yellow')
            markers.A.stroke('yellow')
            markers.B.stroke('yellow')
            text.fill('yellow')
          }

          distance.off(
            'mouseenter mousedown dragstart dragmove dragend transformend mouseleave',
          )
          canvasInfo.layer?.add(distance)
          break
        }
        case 'angle': {
          const angle = new Konva.Line({
            strokeWidth: 1,
            points: [
              (visibleMeasurements.value[i].points![0]
                * props.imageElement.width)
                / canvasInfo.stage!.scaleX(),
              (visibleMeasurements.value[i].points![1]
                * props.imageElement.height)
                / canvasInfo.stage!.scaleY(),
              (visibleMeasurements.value[i].points![2]
                * props.imageElement.width)
                / canvasInfo.stage!.scaleX(),
              (visibleMeasurements.value[i].points![3]
                * props.imageElement.height)
                / canvasInfo.stage!.scaleY(),
              (visibleMeasurements.value[i].points![4]
                * props.imageElement.width)
                / canvasInfo.stage!.scaleX(),
              (visibleMeasurements.value[i].points![5]
                * props.imageElement.height)
                / canvasInfo.stage!.scaleY(),
            ],
          })

          const updateAngle = () => {
            angle.points([
              anchorPoints.A.x(),
              anchorPoints.A.y(),
              anchorPoints.B.x(),
              anchorPoints.B.y(),
              anchorPoints.C.x(),
              anchorPoints.C.y(),
            ])

            const angleBetween = measureAngle([
              anchorPoints.A.x(),
              anchorPoints.A.y(),
              anchorPoints.B.x(),
              anchorPoints.B.y(),
              anchorPoints.C.x(),
              anchorPoints.C.y(),
            ])

            arc.setAttrs({
              x: anchorPoints.B.x(),
              y: anchorPoints.B.y(),
              clockwise: angleBetween > 180,
              angle: angleBetween,
              rotation: measureAngle([
                canvasInfo.stage!.width(),
                anchorPoints.B.y(),
                anchorPoints.B.x(),
                anchorPoints.B.y(),
                anchorPoints.A.x(),
                anchorPoints.A.y(),
              ]),
            })

            let textCoords = {
              x: anchorPoints.A.x(),
              y: anchorPoints.A.y(),
            }
            if (
              anchorPoints.B.x() > anchorPoints.A.x()
              && anchorPoints.B.x() > anchorPoints.C.x()
            ) {
              textCoords = {
                x: anchorPoints.B.x(),
                y: anchorPoints.B.y(),
              }
            }
            else if (
              anchorPoints.C.x() > anchorPoints.B.x()
              && anchorPoints.C.x() > anchorPoints.A.x()
            ) {
              textCoords = {
                x: anchorPoints.C.x(),
                y: anchorPoints.C.y(),
              }
            }

            text.setAttrs({
              x: textCoords.x,
              y: textCoords.y,
              text:
                `${angleBetween < 180
                  ? angleBetween.toFixed(2)
                  : (360 - angleBetween).toFixed(2)}°`,
            })
          }

          const saveAngle = () => {
            visibleMeasurements.value[i].points = [
              (angle.points()[0] / canvasInfo.stage!.width())
                * canvasInfo.stage!.scaleX(),
              (angle.points()[1] / canvasInfo.stage!.height())
                * canvasInfo.stage!.scaleY(),
              (angle.points()[2] / canvasInfo.stage!.width())
                * canvasInfo.stage!.scaleX(),
              (angle.points()[3] / canvasInfo.stage!.height())
                * canvasInfo.stage!.scaleY(),
              (angle.points()[4] / canvasInfo.stage!.width())
                * canvasInfo.stage!.scaleX(),
              (angle.points()[5] / canvasInfo.stage!.height())
                * canvasInfo.stage!.scaleY(),
            ]
            visibleMeasurements.value[i].value = measureAngle(angle.points())
          }

          const anchorPoints = {
            A: buildAngleAnchor(
              angle.points()[0],
              angle.points()[1],
              updateAngle,
              saveAngle,
              visibleMeasurements.value[i],
            ),
            B: buildAngleAnchor(
              angle.points()[2],
              angle.points()[3],
              updateAngle,
              saveAngle,
              visibleMeasurements.value[i],
            ),
            C: buildAngleAnchor(
              angle.points()[4],
              angle.points()[5],
              updateAngle,
              saveAngle,
              visibleMeasurements.value[i],
            ),
          }

          const angleBetween = measureAngle([
            anchorPoints.A.x(),
            anchorPoints.A.y(),
            anchorPoints.B.x(),
            anchorPoints.B.y(),
            anchorPoints.C.x(),
            anchorPoints.C.y(),
          ])

          let textCoords = {
            x: anchorPoints.A.x(),
            y: anchorPoints.A.y(),
          }
          if (
            anchorPoints.B.x() > anchorPoints.A.x()
            && anchorPoints.B.x() > anchorPoints.C.x()
          ) {
            textCoords = {
              x: anchorPoints.B.x(),
              y: anchorPoints.B.y(),
            }
          }
          else if (
            anchorPoints.C.x() > anchorPoints.B.x()
            && anchorPoints.C.x() > anchorPoints.A.x()
          ) {
            textCoords = {
              x: anchorPoints.C.x(),
              y: anchorPoints.C.y(),
            }
          }

          const text = buildText(
            textCoords.x,
            textCoords.y,
            angleBetween < 180
              ? angleBetween.toFixed(2)
              : (360 - angleBetween).toFixed(2),
            visibleMeasurements.value[i],
          )

          const arc = new Konva.Arc({
            x: anchorPoints.B.x(),
            y: anchorPoints.B.y(),
            innerRadius: 20,
            outerRadius: 20,
            stroke: 'yellow',
            strokeWidth: 1,
            clockwise: angleBetween > 180,
            angle: angleBetween,
            rotation: measureAngle([
              canvasInfo.stage!.width(),
              anchorPoints.B.y(),
              anchorPoints.B.x(),
              anchorPoints.B.y(),
              anchorPoints.A.x(),
              anchorPoints.A.y(),
            ]),
          })

          if (activeMeasurement.value === visibleMeasurements.value[i]) {
            angle.stroke('red')
            arc.stroke('red')
            text.fill('red')
          }
          else {
            angle.stroke('yellow')
            arc.stroke('yellow')
            text.fill('yellow')
          }

          angle.off(
            'mouseenter mousedown dragstart dragmove dragend transformend mouseleave',
          )

          canvasInfo.layer?.add(angle, arc)
          break
        }
        case 'crossAngle': {
          const firstLine = new Konva.Line({
            strokeWidth: 1,
            points: [
              (visibleMeasurements.value[i].points![0]
                * props.imageElement.width)
                / canvasInfo.stage!.scaleX(),
              (visibleMeasurements.value[i].points![1]
                * props.imageElement.height)
                / canvasInfo.stage!.scaleY(),
              (visibleMeasurements.value[i].points![2]
                * props.imageElement.width)
                / canvasInfo.stage!.scaleX(),
              (visibleMeasurements.value[i].points![3]
                * props.imageElement.height)
                / canvasInfo.stage!.scaleY(),
            ],
          })

          const secondLine = new Konva.Line({
            strokeWidth: 1,
            points: [
              (visibleMeasurements.value[i].points![4]
                * props.imageElement.width)
                / canvasInfo.stage!.scaleX(),
              (visibleMeasurements.value[i].points![5]
                * props.imageElement.height)
                / canvasInfo.stage!.scaleY(),
              (visibleMeasurements.value[i].points![6]
                * props.imageElement.width)
                / canvasInfo.stage!.scaleX(),
              (visibleMeasurements.value[i].points![7]
                * props.imageElement.height)
                / canvasInfo.stage!.scaleY(),
            ],
          })

          const updateCrossAngle = () => {
            firstLine.points([
              anchorPoints.A.x(),
              anchorPoints.A.y(),
              anchorPoints.B.x(),
              anchorPoints.B.y(),
            ])

            secondLine.points([
              anchorPoints.C.x(),
              anchorPoints.C.y(),
              anchorPoints.D.x(),
              anchorPoints.D.y(),
            ])

            midPoint = getIntersectionPoint([
              anchorPoints.A.x(),
              anchorPoints.A.y(),
              anchorPoints.B.x(),
              anchorPoints.B.y(),
              anchorPoints.C.x(),
              anchorPoints.C.y(),
              anchorPoints.D.x(),
              anchorPoints.D.y(),
            ])

            const angleBetween = measureAngle([
              anchorPoints.A.x(),
              anchorPoints.A.y(),
              midPoint[0],
              midPoint[1],
              anchorPoints.D.x(),
              anchorPoints.D.y(),
            ])

            arc.setAttrs({
              x: midPoint[0],
              y: midPoint[1],
              clockwise: angleBetween > 180,
              angle: angleBetween,
              rotation: measureAngle([
                canvasInfo.stage!.width(),
                midPoint[1],
                midPoint[0],
                midPoint[1],
                anchorPoints.A.x(),
                anchorPoints.A.y(),
              ]),
            })

            let textCoords = {
              x: anchorPoints.A.x(),
              y: anchorPoints.A.y(),
            }
            if (
              midPoint[0] > anchorPoints.A.x()
              && midPoint[0] > anchorPoints.D.x()
            ) {
              textCoords = {
                x: midPoint[0],
                y: midPoint[1],
              }
            }
            else if (
              anchorPoints.D.x() > midPoint[0]
              && anchorPoints.D.x() > anchorPoints.A.x()
            ) {
              textCoords = {
                x: anchorPoints.D.x(),
                y: anchorPoints.D.y(),
              }
            }

            text.setAttrs({
              x: textCoords.x,
              y: textCoords.y,
              text:
                `${angleBetween < 180
                  ? angleBetween.toFixed(2)
                  : (360 - angleBetween).toFixed(2)}°`,
            })
          }

          const saveCrossAngle = () => {
            visibleMeasurements.value[i].points = [
              (firstLine.points()[0] / canvasInfo.stage!.width())
                * canvasInfo.stage!.scaleX(),
              (firstLine.points()[1] / canvasInfo.stage!.height())
                * canvasInfo.stage!.scaleY(),
              (firstLine.points()[2] / canvasInfo.stage!.width())
                * canvasInfo.stage!.scaleX(),
              (firstLine.points()[3] / canvasInfo.stage!.height())
                * canvasInfo.stage!.scaleY(),
              (secondLine.points()[0] / canvasInfo.stage!.width())
                * canvasInfo.stage!.scaleX(),
              (secondLine.points()[1] / canvasInfo.stage!.height())
                * canvasInfo.stage!.scaleY(),
              (secondLine.points()[2] / canvasInfo.stage!.width())
                * canvasInfo.stage!.scaleX(),
              (secondLine.points()[3] / canvasInfo.stage!.height())
                * canvasInfo.stage!.scaleY(),
            ]

            midPoint = getIntersectionPoint(
              visibleMeasurements.value[i].points!,
            )

            visibleMeasurements.value[i].value = measureAngle([
              visibleMeasurements.value[i].points![0],
              visibleMeasurements.value[i].points![1],
              midPoint[0],
              midPoint[1],
              visibleMeasurements.value[i].points![6],
              visibleMeasurements.value[i].points![7],
            ])
          }

          const anchorPoints = {
            A: buildAngleAnchor(
              firstLine.points()[0],
              firstLine.points()[1],
              updateCrossAngle,
              saveCrossAngle,
              visibleMeasurements.value[i],
            ),
            B: buildAngleAnchor(
              firstLine.points()[2],
              firstLine.points()[3],
              updateCrossAngle,
              saveCrossAngle,
              visibleMeasurements.value[i],
            ),
            C: buildAngleAnchor(
              secondLine.points()[0],
              secondLine.points()[1],
              updateCrossAngle,
              saveCrossAngle,
              visibleMeasurements.value[i],
            ),
            D: buildAngleAnchor(
              secondLine.points()[2],
              secondLine.points()[3],
              updateCrossAngle,
              saveCrossAngle,
              visibleMeasurements.value[i],
            ),
          }

          let midPoint = getIntersectionPoint([
            anchorPoints.A.x(),
            anchorPoints.A.y(),
            anchorPoints.B.x(),
            anchorPoints.B.y(),
            anchorPoints.C.x(),
            anchorPoints.C.y(),
            anchorPoints.D.x(),
            anchorPoints.D.y(),
          ])

          const angleBetween = measureAngle([
            anchorPoints.A.x(),
            anchorPoints.A.y(),
            midPoint[0],
            midPoint[1],
            anchorPoints.D.x(),
            anchorPoints.D.y(),
          ])

          let textCoords = {
            x: anchorPoints.A.x(),
            y: anchorPoints.A.y(),
          }
          if (
            midPoint[0] > anchorPoints.A.x()
            && midPoint[1] > anchorPoints.D.x()
          ) {
            textCoords = {
              x: midPoint[0],
              y: midPoint[1],
            }
          }
          else if (
            anchorPoints.D.x() > midPoint[0]
            && anchorPoints.D.x() > anchorPoints.A.x()
          ) {
            textCoords = {
              x: anchorPoints.D.x(),
              y: anchorPoints.D.y(),
            }
          }

          const text = buildText(
            textCoords.x,
            textCoords.y,
            angleBetween < 180
              ? angleBetween.toFixed(2)
              : (360 - angleBetween).toFixed(2),
            visibleMeasurements.value[i],
          )

          const arc = new Konva.Arc({
            x: midPoint[0],
            y: midPoint[1],
            innerRadius: 20,
            outerRadius: 20,
            stroke: 'yellow',
            strokeWidth: 1,
            clockwise: angleBetween > 180,
            angle: angleBetween,
            rotation: measureAngle([
              canvasInfo.stage!.width(),
              midPoint[1],
              midPoint[0],
              midPoint[1],
              anchorPoints.A.x(),
              anchorPoints.A.y(),
            ]),
          })

          if (activeMeasurement.value === visibleMeasurements.value[i]) {
            firstLine.stroke('red')
            secondLine.stroke('red')
            arc.stroke('red')
            text.fill('red')
          }
          else {
            firstLine.stroke('yellow')
            secondLine.stroke('yellow')
            arc.stroke('yellow')
            text.fill('yellow')
          }

          firstLine.off(
            'mouseenter mousedown dragstart dragmove dragend transformend mouseleave',
          )
          secondLine.off(
            'mouseenter mousedown dragstart dragmove dragend transformend mouseleave',
          )

          canvasInfo.layer?.add(firstLine, secondLine, arc)
          break
        }
      }
    }
  }
}
onMounted(() => {
  drawCanvas()

  canvasInfo.baseWidth = toRaw(props.imageElement.width)

  new ResizeObserver(() => {
    canvasInfo.stage!.width(props.imageElement.width)
    canvasInfo.stage!.height(props.imageElement.height)

    const scale = props.imageElement.width / canvasInfo.baseWidth!

    canvasInfo.stage?.scale({
      x: scale,
      y: scale,
    })
  }).observe(props.imageElement)

  drawAnnotation()
})

watch(
  () => [props.activeMeasurement, props.visibleMeasurements],
  () => {
    canvasInfo.layer?.destroyChildren()

    drawAnnotation()
  },
  { deep: true },
)

onBeforeUnmount(() => {
  canvasInfo.stage?.destroy()
})
</script>

<template>
  <div ref="containerRef" class="w-full h-full" />
</template>

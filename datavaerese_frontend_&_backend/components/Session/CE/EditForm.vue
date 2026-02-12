<script setup lang="ts">
import type { PropType } from 'vue'
import type { Measurement, Result } from '~~/models/cESession'

const props = defineProps({
  result: {
    type: Object as PropType<Result>,
    required: true,
  },
  comment: {
    type: String,
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

const { comment, visibleMeasurements, activeMeasurement } = useVModels(
  props,
  emit,
)

function toggleMeasurement(measurement: Measurement) {
  activeMeasurement.value
    = activeMeasurement.value === measurement ? null : measurement
}

function clearMeasurement(measurement: Measurement) {
  measurement.points = undefined
  measurement.value = undefined
}
</script>

<template>
  <form id="dataEditForm" data-testid="ce-edit-form">
    <fieldset
      v-for="section in result.sections"
      :key="`section-${section.index}`"
      class="border border-neutral-300 px-2 mb-4"
    >
      <legend class="ml-4 flex flex-row items-center gap-2 px-2" :data-testid="`ce-section-legend-${section.index}`">
        <h3>{{ section.name }}</h3>
        <label
          v-if="section.measurements"
          class="flex-none visibility-checkbox"
        >
          <input
            :data-testid="`ce-section-visibility-checkbox-${section.index}`"
            :id="`${section.index}-all-measurements-visibility`"
            type="checkbox"
            :checked="
              section.measurements.every((measurement) =>
                visibleMeasurements.includes(measurement),
              )
            "
            @change="(event: any) => {
              if (event.target.checked) {
                visibleMeasurements = visibleMeasurements.concat(
                  section.measurements,
                );
              }
              else {
                visibleMeasurements = visibleMeasurements.filter(
                  (measurement: Measurement) =>
                    !section.measurements.includes(measurement),
                );
              }
            }"
          >
          <div
            class="i-ph-eye-slash visibility-unchecked text-[1.25em] text-neutral-300 hover:text-neutral-100 cursor-pointer"
          />
          <div
            class="i-ph-eye visibility-checked text-[1.25em] text-neutral-300 hover:text-neutral-100 cursor-pointer"
          />
        </label>
      </legend>
      <div
        v-for="measurement in section.measurements"
        :key="`measurement-${section.index}-${measurement.index}`"
        class="grid grid-cols-12 space-x-2 py-2 last:border-0 border-b border-neutral-500 items-center"
      >
        <div class="col-span-6 inline-flex items-center gap-2 break-words">
          <div
            class="i-ph-ruler flex-none text-[1.25em] text-neutral-300 hover:text-neutral-100 cursor-pointer"
            :class="{
              'text-primary-700': activeMeasurement === measurement,
              'hover:text-primary-500': activeMeasurement === measurement,
            }"
            :data-testid="`ce-measurement-toggle-${section.index}-${measurement.index}`"
            @click="toggleMeasurement(measurement)"
          />
          <label class="flex-none visibility-checkbox">
            <input
              :data-testid="`ce-measurement-visibility-${section.index}-${measurement.index}`"
              :id="`measurement-${section.index}-${measurement.index}-visibility`"
              v-model="visibleMeasurements"
              type="checkbox"
              :value="measurement"
            >
            <div
              class="i-ph-eye-slash visibility-unchecked text-[1.25em] text-neutral-300 hover:text-neutral-100 cursor-pointer"
            />
            <div
              class="i-ph-eye visibility-checked text-[1.25em] text-neutral-300 hover:text-neutral-100 cursor-pointer"
            />
          </label>
          <h4 class="font-bold text-neutral-500">
            {{ measurement.name }}
          </h4>
        </div>
        <div class="col-span-3">
          <div
            v-if="measurement.value"
            class="inline-flex justify-start items-center gap-1"
          >
            <span v-if="measurement.value && measurement.type === 'angle'">{{
              `${
                measurement.value > 180
                  ? (360 - measurement.value).toFixed(2)
                  : measurement.value.toFixed(2)
              }°`
            }}</span>
            <span
              v-else-if="measurement.value && measurement.type === 'crossAngle'"
            >{{
              `${
                measurement.value > 180
                  ? (360 - measurement.value).toFixed(2)
                  : measurement.value.toFixed(2)
              }°`
            }}</span>
            <span
              v-else-if="measurement.value && measurement.type === 'distance'"
            >{{ `${measurement.value.toFixed(2)}mm` }}</span>
            <div
              class="i-ph-eraser flex-none text-[1.25em] text-error-700 hover:text-error-500 cursor-pointer"
              @click="clearMeasurement(measurement)"
            />
          </div>
        </div>
        <div class="col-span-3 inline-flex items-center gap-2">
          <input
            :data-testid="`ce-measurement-unreliable-${section.index}-${measurement.index}`"
            :id="`measurement-${section.index}-${measurement.index}-reliability`"
            v-model="measurement.isReliable"
            class="accent-primary-700 border h-4 w-4 cursor-pointer"
            type="checkbox"
            :name="`measurement-${section.index}-${measurement.index}-reliability`"
            :false-value="true"
            :true-value="false"
          >
          <label
            :for="`measurement-${section.index}-${measurement.index}-reliability`"
          >Unreliable</label>
        </div>
      </div>
      <div
        v-for="assessment in section.assessments"
        :key="`assessment-${section.index}-${assessment.index}`"
        class="grid grid-cols-12 space-x-2 py-2 last:border-0 border-b border-neutral-500 items-center"
      >
        <div class="col-span-3 break-words">
          <h4 class="text-neutral-500">
            {{ assessment.name }}
          </h4>
        </div>
        <div
          v-for="(name, value) of assessment.options"
          :key="`assessment-${section.index}-${assessment.index}-${name}-type`"
          class="col-span-3 inline-flex items-center gap-2"
        >
          <input
            :data-testid="`ce-assessment-option-${section.index}-${assessment.index}-${name}`"
            :id="`assessment-${section.index}-${assessment.index}-${name}-radio`"
            v-model="assessment.value"
            class="accent-primary-700 border h-4 w-4 cursor-pointer"
            type="radio"
            :name="`assessment-${section.index}-${assessment.index}-${name}-radio`"
            :value="value"
          >
          <label
            :for="`assessment-${section.index}-${assessment.index}-${name}-radio`"
          >{{ name }}</label>
        </div>
      </div>
    </fieldset>
    <textarea
      id="comment"
      data-testid="ce-comment-textarea"
      v-model="comment"
      placeholder="Comment"
      rows="5"
      class="bg-neutral-800 px-2 py-1 placeholder-neutral-500 text-neutral-100 w-full border border-neutral-300 outline-none"
    />
  </form>
</template>

<style scoped>
.visibility-checkbox input[type="checkbox"],
.active-checkbox input[type="checkbox"],
.visibility-checkbox .visibility-checked,
.active-checkbox .active-checked {
  display: none;
}

.visibility-checkbox input[type="checkbox"]:checked ~ .visibility-checked,
.active-checkbox input[type="checkbox"]:checked ~ .active-checked {
  display: inline-block;
}

.visibility-checkbox input[type="checkbox"]:checked ~ .visibility-unchecked,
.active-checkbox input[type="checkbox"]:checked ~ .active-unchecked {
  display: none;
}
</style>

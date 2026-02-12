<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'
import { NConfigProvider, NGlobalStyle, NNotificationProvider, darkTheme } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    fontFamily: '"Roboto", sans-serif',
    bodyColor: '#282828',
    primaryColor: '#459EED',
    primaryColorHover: '#76BAF6',
    successColor: '#61BE87',
    successColorHover: '#79D99F',
    successColorPressed: '#169D77',
    errorColor: '#F87777',
    errorColorHover: '#EF5A5A',
    errorColorPressed: '#D64545',
  },
  Button: {
    textColor: '#FCF9F6',
    textColorPrimary: '#459EED',
    textColorHoverPrimary: '#FCF9F6',
    textColorPressedPrimary: '#FCF9F6',
    colorHoverPrimary: '#76BAF6',
    colorPressedPrimary: '#76BAF6',
    textColorSuccess: '#61BE87',
    textColorHoverSuccess: '#FCF9F6',
    textColorPressedSuccess: '#FCF9F6',
    textColorError: '#EF5A5A',
    textColorHoverError: '#FCF9F6',
    textColorPressedError: '#FCF9F6',
    colorSecondary: '#459EED',
    colorSecondaryHover: '#76BAF6',
  },
  Card: {
    color: 'black',
  },
  DataTable: {
    thColor: '#393836',
    tdColor: '#393836',
  },
}
</script>

<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides" preflight-style-disabled>
    <NGlobalStyle />
    <NNotificationProvider>
      <NuxtLayout>
        <CustomLoadingIndicator />
        <NuxtPage />
      </NuxtLayout>
    </NNotificationProvider>
  </NConfigProvider>
</template>

<style>
@import url(//fonts.googleapis.com/css?family=Roboto:400,400italic,500,500italic,700,700italic,900,900italic,300italic,300,100italic,100);

html {
  @apply flex flex-row h-full w-full;
}

body {
  @apply h-full w-full subpixel-antialiased;
}

/*Chrome*/
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  input[type="range"] {
    @apply appearance-none h-[6px] bg-neutral-500;
  }

  input[type="range"]::-webkit-slider-thumb {
    @apply appearance-none h-4 w-4 bg-primary-700 rounded-full cursor-pointer;
  }
}

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
  /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  /* Position the tooltip text - see examples below! */
  position: absolute;
  z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
  visibility: visible;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.n-button.n-button--disabled {
  background-color: transparent !important;
  border: none !important;
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  color: #efefef !important;
}

.n-form-item-label__asterisk{
  align-self: center !important;
}

</style>

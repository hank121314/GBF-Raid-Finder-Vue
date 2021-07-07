<template>
  <div class="fixed right-6 bottom-6 w-12 h-12 flex justify-center items-center">
    <button
      v-wave
      class="rounded-full focus:outline-none w-full h-full bg-gray-700 flex justify-center items-center hover:bg-gray-500"
    >
      <adjustments-icon class="h-8 w-8 text-white" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AdjustmentsIcon } from '@heroicons/vue/solid';

export default defineComponent({
  name: "FAB",
  components: { AdjustmentsIcon },
  setup() {


    return {}
  }
})
</script>

<style scoped>
</style>
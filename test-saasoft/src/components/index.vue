<script setup lang="ts">
import UserBlock from './blocks/UserBlock.vue'
defineProps<{
  msg: string
}>()
</script>

<template>
  <div>
    <UserBlock/>
  </div>
</template>

<style scoped>
</style>

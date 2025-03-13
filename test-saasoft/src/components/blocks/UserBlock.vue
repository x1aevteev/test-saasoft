<script setup lang="ts">
import { VBtn } from 'vuetify/components'
import HintUserBlock from './HintUserBlock.vue'
import FormBlock from './FormBlock.vue';

import {useMainStore} from '@/stores/index'
const store = useMainStore()

</script>
<template>
    <div class="flex gap-4 items-center">
        <h1 class="text-xl">Учетные записи</h1>
        <VBtn
        text="+"
        @click="store.addEmptyUser()"
        />
    </div>
    <HintUserBlock/>
    <FormBlock/>
</template>
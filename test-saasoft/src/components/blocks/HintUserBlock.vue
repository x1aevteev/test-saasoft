<script setup lang="ts">
import { VCard } from 'vuetify/components'
</script>
<template>
    <VCard
    prepend-icon="mdi-help-circle-outline"
    class="flex !bg-blue-50"
    title="Для указания нескольких меток для одной пары логин\пароль используйте разделитель « ; »"
    />
    <VCard
    prepend-icon="mdi-alert-octagram-outline"
    class="flex !bg-yellow-50"
    title="Для сохранения учетной записи, после введения крайнего поля, нажмите клавишу «Enter»"
    />
</template>
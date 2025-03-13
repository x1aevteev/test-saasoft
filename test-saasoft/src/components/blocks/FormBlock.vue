<script setup lang="ts">

import { VCard, VTextField, VSelect } from 'vuetify/components'
import {useMainStore} from '@/stores/index'
const store = useMainStore()


</script>
<template>
    <template v-if="store.users.length <= 0">
        <VCard
        prepend-icon="mdi-check-circle-outline"
        class="flex"
        color="deep-purple"
        title="Пока что тут пусто"
        />
    </template>
    <template v-else>
        <div class="grid grid-cols-4 gap-4">
            <template v-for="(user, i) in store.users">
                <VTextField
                name="name"
                label="Метки"
                id="id"
                variant="outlined"
            />
            <VSelect
                :items="['Локально', 'LDAP']"
                label="Тип записи"
                variant="outlined"
            />
            <VTextField
                name="name"
                label="Логин"
                id="id"
                variant="outlined"
            />
            <VTextField
                name="name"
                label="Пароль"
                id="id"
                variant="outlined"
            />
            </template>
        </div>
        {{ store.users }}
    </template>
</template>
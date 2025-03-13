<script setup lang="ts">
import { VCard, VTextField, VSelect } from 'vuetify/components'
import { ref } from 'vue'
import {useMainStore} from '@/stores/index'

import type {user} from '@/types/user'
const store = useMainStore()

const stringFields = [
    {
        name: 'Метки',
        id: 1,
        key: 'labels'
    },
    {
        name: 'Тип записи',
        id: 2,
        key: 'type'
    },
    {
        name: 'Логин',
        id: 3,
        key: 'login'
    },
    {
        name: 'Пароль',
        id: 4,
        key: 'password'
    },
]

const selectItems = ['Локально', 'LDAP']


const userIndex = ref<number | null>(null) 
const userDataObject = ref<Record<string, any>>({})

const updateFormData = (key: string, value: any) => {
    userDataObject.value[key] = value
}

const submitForm = () => {
    console.log('привет')
    console.log(userDataObject)
  if (userIndex.value !== null) {
    store.updateUser(userIndex.value, userDataObject ) 
  } else {
    store.addEmptyUser()
  }
}

const STRING_WIDGETS = [
  {
    name: 'labels',
    id: 'labels-id',
    label: 'Метки',
    placeholder: 'Введите метки',
    type: 'text',  
  },
  {
    name: 'select',
    id: 'select-id',
    label: 'Тип записи',
    placeholder: 'Выберите тип записи',
    type: 'select',  
    items: ['Локально', 'LDAP'], 
  },
  {
    name: 'login',
    id: 'login-id',
    label: 'Логин',
    placeholder: 'Введите логин',
    type: 'text',  
  },
  {
    name: 'password',
    id: 'password-id',
    label: 'Пароль',
    placeholder: 'Введите пароль',
    type: 'password',  
  }
]


</script>
<template>
    <template v-if="store.users.length <= 0">
        <VCard
        prepend-icon="mdi-check-circle-outline"
        class="flex"
        color="deep-purple"
        title="Пока что учетных записей нет :("
        />
    </template>
    <template v-else>
        <div v-if="store.users.length > 0" class="flex flex-col gap-6">
            <div class="grid grid-cols-4 gap-4 w-full">
                <template v-for="(label, i) in stringFields" :key="i">
                <p class="text-gray-500">{{ label.name }}</p>
                </template>
            </div>
            <template v-for="(user, i) in store.users" :key="i">
                <form @submit.prevent="submitForm" class="grid grid-cols-4 gap-4 w-full"> 
                    <template v-for="(field, i) in STRING_WIDGETS" :key="i">
                        <template v-if="field.type === 'text' && field.name !== 'login'">
                            <VTextField
                                :name="field.name"
                                :label="field.label"
                                :id="field.id"
                                variant="outlined"
                                @update:model-value="updateFormData(field.name, $event)"
                            />
                        </template>
                        <template v-if="field.type === 'select'">
                            <VSelect
                                :items=field.items
                                :label="field.label"
                                variant="outlined"
                                @update:model-value="updateFormData(field.name, $event)"
                            />
                        </template>
                        <template v-if="field.type === 'text' && field.name === 'login'">
                            <VTextField
                                :name="field.name"
                                :label="field.label"
                                :id="field.id"
                                variant="outlined"
                                @update:model-value="updateFormData(field.name, $event)"
                            />
                        </template>
                        <template v-if="field.type === 'password'">
                            <VTextField
                                :name="field.name"
                                :label="field.label"
                                :id="field.id"
                                variant="outlined"
                                @update:model-value="updateFormData(field.name, $event)"
                            />
                        </template>
                    </template>
                    <button type="submit" class="hidden"/>
                </form>
            </template>
        </div>
    </template>
</template>
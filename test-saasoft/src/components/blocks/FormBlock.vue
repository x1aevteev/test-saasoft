<script setup lang="ts">
import { VCard, VTextField, VSelect, VBtn, VForm } from 'vuetify/components'
import { ref, computed, reactive, nextTick, watchEffect } from 'vue'
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

const formRefs = ref<Record<number, InstanceType<typeof VForm> | null>>({})
watchEffect(() => {
    Object.entries(formRefs.value).forEach(([index, form]) => {
    if (form?.isValid) {
        submitForm(Number(index))
    }
    })
})


const userIndex = ref<number | null>(null) 
const userDataObject = ref<Record<number, Record<string, any>>>({})
const errors = reactive<Record<number, Record<string, string>>>({})

const validateField = (index: number, field: string, value: any) => {
    if (!errors[index]) errors[index] = {}
    if (!value) {
        errors[index][field] = 'Поле обязательно для заполнения'
    } else {
        delete errors[index][field]
    }
}

const updateFormData = async (key: string, value: any, index: number) => {
    if (!userDataObject.value[index]) {
        userDataObject.value[index] = {} 
    }
    userDataObject.value[index][key] = value

    await nextTick()
    if (formRefs.value[index]) {
        formRefs.value[index]?.validate()
    }
}

const deleteUser = (index: number) => {
    store.removeUser(index)
}

const submitForm = (i: number) => {
    userIndex.value = i
    if (userDataObject.value[i] && userDataObject.value[i].select === 'LDAP') {
        if (!userDataObject.value[i].password) {
            userDataObject.value[i].password = null
        }
    }

    console.log(userDataObject.value)
    if (userIndex.value !== null) {
        store.updateUser(userIndex.value, userDataObject.value)
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

const loginRules = {
    counter: (value: Array<string> | null) => {
        if (value === null || value === undefined) {
            return 'Value cannot be null'
        }
        return value.length <= 100 || 'Max 100 characters'
    }
}

const labelRules = {
    counter: (value: Array<string> | null) => {
        if (value === null) {
            return 'Value cannot be null'
        }
        return value.length <= 50 || 'Max 50 characters'
    }
}

const user = computed(() => store.users[userIndex.value ?? 0] || { labels: [] })

const getUserLabel = (index: number) => {
    console.log(store.users[index])
  const storeUser = store.users[index]
  if (storeUser && storeUser.labels) {
    console.log('привет')
    console.log(storeUser.labels.map(label => label.text).join('; '))
    return storeUser.labels.map(label => label.text).join('; ')
  }
  return ''
}

const userField = (index: number, fieldName: string) => computed({
  get: () => {
    if (fieldName === 'labels') {
      return store.users[index]?.labels?.map(label => label.text).join('; ') || ''
    }
    return store.users[index]?.[fieldName] || ''
  },
  set: (value: any) => {
    if (fieldName === 'labels') {
      store.users[index].labels = value.split('; ').map((text: any) => ({ text }))
    } else {
      store.users[index][fieldName] = value
    }
  }
})

const setFormRef = (el: InstanceType<typeof VForm> | null, index: number) => {
    if (el) {
        formRefs.value[index] = el
    }
}
</script>
<template>
    <template v-if="store.users.length <= 0">
        <VCard
        prepend-icon="mdi-emoticon-sad-outline"
        class="flex"
        color="deep-purple"
        title="Пока что учетных записей нет"
        />
    </template>
    <template v-else>
        <div v-if="store.users.length > 0" class="flex flex-col gap-6">
            <div class="grid grid-cols-5 gap-4 w-full">
                <template v-for="(label, i) in stringFields" :key="i">
                    <p class="text-gray-500">{{ label.name }}</p>
                </template>
            </div>
            <template v-for="(user, index) in store.users" :key="index">
                <VForm 
                @submit.prevent="submitForm(index)" 
                class="grid grid-cols-5 gap-4 w-full"
                :ref="el => setFormRef(el as InstanceType<typeof VForm> | null, index)"
                > 
                    <template v-for="(field, i) in STRING_WIDGETS" :key="i">
                        <template v-if="field.type === 'text' && field.name !== 'login'">
                            <VTextField
                                :name="field.name"
                                :label="field.label"
                                :id="field.id"
                                :rules="[labelRules.counter]"
                                variant="outlined"
                                @update:model-value="updateFormData(field.name, $event, index)"
                                class="col-span-1"
                                v-model="userField(index, 'labels').value"
                                @blur="validateField(index, field.name, store.users[index][field.name])"
                                :error="!!errors[index]?.[field.name]"
                                :error-messages="errors[index]?.[field.name]"
                            />
                        </template>
                        <template v-if="field.type === 'select'">
                            <VSelect
                                :items=field.items
                                :label="field.label"
                                variant="outlined"  
                                @update:model-value="updateFormData(field.name, $event, index)"
                                class="col-span-1"
                                v-model="store.users[index][field.name]"
                                @change="validateField(index, field.name, store.users[index][field.name])"
                                :error="!!errors[index]?.[field.name]"
                                :error-messages="errors[index]?.[field.name]"
                            />
                        </template>
                        <template v-if="field.type === 'text' && field.name === 'login'">
                            <VTextField
                                required
                                :name="field.name"
                                :label="field.label"
                                :rules="[loginRules.counter]"
                                :id="field.id"
                                variant="outlined"
                                @update:model-value="updateFormData(field.name, $event, index)"
                                :class="store.users[index]?.select !== 'LDAP' ? 'col-span-1' : 'col-span-2'"
                                v-model="store.users[index][field.name]"
                                @blur="validateField(index, field.name, store.users[index][field.name])"
                                :error="!!errors[index]?.[field.name]"
                                :error-messages="errors[index]?.[field.name]"
                            />
                        </template>
                        <template v-if="field.type === 'password' && (store.users[index]?.select !== 'LDAP')">
                            <VTextField
                                required
                                type="password"
                                :name="field.name"
                                :label="field.label"
                                :id="field.id"
                                variant="outlined"
                                @update:model-value="updateFormData(field.name, $event, index)"
                                v-model="store.users[index][field.name]"
                                @blur="validateField(index, field.name, store.users[index][field.name])"
                                :error="!!errors[index]?.[field.name]"
                                :error-messages="errors[index]?.[field.name]"
                            />
                        </template>
                    </template>
                    <VBtn
                        variant="plain"
                        prepend-icon="mdi-trash-can-outline"
                        @click="deleteUser(index)"
                        small
                        class="!max-w-[50px]"
                    />
                    <button type="submit" class="hidden"/>
                </VForm>
            </template>
        </div>
    </template>
</template>
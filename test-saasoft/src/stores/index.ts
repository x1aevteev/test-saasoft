import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type {user} from '@/types/user'

export const useMainStore = defineStore('main', () => {

  const users = ref<user[]>([])

  const addEmptyUser = () => {
    const newUser: user = {
      labels: null,
      select: null,
      login: null,
      password: null,
    }
    users?.value.push(newUser)
  }

  const updateUser = (index: number, updatedUser: any) => {
    users.value[index] = updatedUser
  }

  const setUser = (data: user) => {
    users?.value.push(data)
  }

  return { 
    users,
    addEmptyUser,
    updateUser,   
   }
})

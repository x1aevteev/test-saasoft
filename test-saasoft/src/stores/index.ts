import { ref, computed, onMounted } from 'vue'
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
    saveUsersToLocalStorage()
  }

  const updateUser = (index: number, updatedUser: any) => {

    if (updatedUser.labels && typeof updatedUser.labels === 'string') {
      updatedUser.labels = updatedUser.labels
        .split(';') 
        .map((label: string) => ({ text: label.trim() }))  
    }

    users.value[index] = updatedUser
    saveUsersToLocalStorage()
    console.log('привет', users)
  }

  const saveUsersToLocalStorage = () => {
    localStorage.setItem('users', JSON.stringify(users.value))
  }

  const loadUsersFromLocalStorage = () => {
    const savedUsers = localStorage.getItem('users')
    if (savedUsers) {
      users.value = JSON.parse(savedUsers)
    }
  }

  onMounted(() => {
    loadUsersFromLocalStorage()
    console.log(users.value)
  })

  const removeUser = (index: number) => {
    users.value.splice(index, 1)
    saveUsersToLocalStorage()
  }

  const setUser = (data: user) => {
    users?.value.push(data)
  }

  return { 
    users,
    addEmptyUser,
    updateUser,  
    removeUser 
   }
})

import {create} from 'zustand'


type User = {
    username:string
}

export const useAuthStore = create<User | null>((set) => ({
    username: ""
}))

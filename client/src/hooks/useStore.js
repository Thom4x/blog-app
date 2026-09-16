import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

const logger = (config) => (set, get) => config(
    (...args) => {
        console.log('prev state', get());
        set(...args);
        console.log('next state', get());
    },
    get
);

const useNotificationStore = create(devtools((set) => ({
    notification: {
        message: '',
        type: ''
    },
    actions: {
        setNotification: (message, type) => set(() => ({ notification: { message, type } })),
        clearNotification: () => set({ notification: { message: '', type: '' } })
    }
})))


const useStore = create((set) => ({
    bear: 0,
    actions: {
        greet: () => console.log("hI world"),
        set: () =>
            set((state) => ({ bear: state.bear + 1 })
            )

    }
}))

export const useHello = () => useStore(state => state.actions)
export const useNotificationActions = () => useNotificationStore(state => state.actions)
export const useNotification = () => useNotificationStore(state => state.notification)
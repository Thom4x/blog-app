import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import blogService from "../services/blogs";

const logger = (config) => (set, get) => config(
    (...args) => {
        console.log('prev state', get());
        set(...args);
        console.log('next state', get());
    },
    get
);

const useNotificationStore = create(logger((set) => ({
    notification: {
        message: '',
        type: ''
    },
    actions: {
        setNotification: (message, type, duration = 2500) => {
            set({ notification: { message, type } })
            setTimeout(() => {
                set({ notification: { message: '', type: '' } })
            }, duration)
        },
        clearNotification: () => set({ notification: { message: '', type: '' } })
    }
}), { name: 'NotificationStore' }))




const useBlogStore = create(logger((set, get) => ({
    blog: [],
    actions: {
        getBlogs: async () => {
            const data = await blogService.getAll();
            set(() => ({
                blog: data
            }))
        },
        createBlog: async (blog) => {
            const { setNotification } = useNotificationStore.getState().actions
            try {
                const newBlog = await blogService.create(blog);
                set((state) => ({
                    blog: state.blog.concat(newBlog)
                }))
                setNotification(`A new blog "${newBlog.title}" by ${newBlog.author} added`, 'success', 2500)
            } catch (error) {
                setNotification(`Error creating blog: ${error.message}`, 'error', 2500)
            }
        },
        likeBlog: async (id) => {
            const { setNotification } = useNotificationStore.getState().actions
            const blog = get().blog.find(n => n.id === id)
            try {
                const update = await blogService.update(id, { ...blog, likes: blog.likes + 1 });
                set((state) => ({
                    blog: state.blog
                        .map(a => a.id === id ? update : a)
                }))
                setNotification(`Blog liked successfully: ${update.title}`, 'success', 2500)
            } catch (error) {
                setNotification(`Error liking blog: ${error.message}`, 'error', 2500)
            }
        },
        deleteBlog: async (id) => {
            const { setNotification } = useNotificationStore.getState().actions
            const blog = get().blog.find(n => n.id === id)
            if (window.confirm(`Deseas eliminar este blog? ${id}`)) {
                try {
                    const deleteBlog = await blogService.deleteBlog(id)
                    set((state) => ({
                        blog: state.blog
                            .filter(b => b.id !== id) // filtrar solo blogs que no sean iguales al id que se eliminó
                    }))
                    setNotification(`Blog Delete successfully: ${blog.title}`, 'success', 2500)
                } catch (error) {
                    setNotification(`Error Deleting blog: ${error.message}`, 'error', 2500)
                }
            }
        }
    }
}), { name: 'BlogStore' }))

export const useBlog = () => useBlogStore(state => state.blog)
export const useBlogActions = () => useBlogStore(state => state.actions)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)

export const useNotification = () => useNotificationStore(state => state.notification)
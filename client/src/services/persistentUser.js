export const persistentUser = {
    getUserLocalStorage: () => {
        const userJSON = window.localStorage.getItem("loggedBlogappUser");
        return userJSON ? JSON.parse(userJSON) : null;
    },

    setUserLocalStorage: (user) => {
        try {
            window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
        } catch (error) {
            console.error("Error al guardar usuario en localStorage:", error);
        }
    },

    removeUserLocalStorage: () => {
        window.localStorage.removeItem("loggedBlogappUser");
    }
}
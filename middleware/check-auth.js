export default async ({ store, redirect, app, route }) => {
  const token = app.$cookies.get('token')
  const requiresAuth = route.meta[0].requiresAuth || false
  let user = store.getters['users/checkAuth']

  if(token && !user){
    try {
      await store.dispatch('users/getCurrentUser')
      user = store.getters['users/checkAuth']
    } catch(error) {
      app.$cookies.remove('token')
      await store.commit('users/SET_ACCESS_TOKEN', undefined)
      await store.commit('users/SET_CURRENT_USER', undefined)
      redirect('/login')
    }
  }

  if(requiresAuth && !user) {
    redirect('/login')
  }
  else if(!requiresAuth && user) {
    redirect('/profile')
  }
}

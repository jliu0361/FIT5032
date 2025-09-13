import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import JoinActivities from '../views/JoinActivities.vue'
import AllActivities from '../views/AllActivities.vue'
import FirebaseLoginPage from '../views/FirebaseLoginPage.vue'
import AdminPanel from '../views/AdminPanel.vue'
import WellbeingPage from '../views/WellbeingPage.vue'
import ReviewPage from '../views/ReviewPage.vue'
import { auth } from '../firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.js'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/activities',
    name: 'Activities',
    component: JoinActivities,
    meta: { requiresAuth: true }
  },
  {
    path: '/all-activities',
    name: 'AllActivities',
    component: AllActivities,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: FirebaseLoginPage
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPanel,
    meta: { requiresAuth: true, requiresRole: 'admin' }
  },
  {
    path: '/wellbeing',
    name: 'Wellbeing',
    component: WellbeingPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/review',
    name: 'Review',
    component: ReviewPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const getUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    return userDoc.exists() ? userDoc.data().role : 'user'
  } catch (error) {
    return 'user'
  }
}

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresRole = to.meta.requiresRole

  if (requiresAuth) {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          if (requiresRole) {
            const userRole = await getUserRole(user.uid)
            if (userRole === requiresRole) {
              resolve(next())
            } else {
              resolve(next('/'))
            }
          } else {
            resolve(next())
          }
        } else {
          resolve(next('/login'))
        }
      })
    })
  } else {
    next()
  }
})

export default router

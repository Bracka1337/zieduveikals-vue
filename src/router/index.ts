/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
    {
      path: '/admin/',
      name: 'admin',
      component: () => import('../views/Admin.vue'),
      children: [
        {
          path: 'dashboard', // Default path for /admin
          name: 'dashboard',
          component: () => import('../views/AdminViews/Dashboard.vue'),
        },
        {
          path: 'promocodes',
          name: 'promocodes',
          component: () => import('../views/AdminViews/Promocodes.vue'),
        },
        {
          path: 'users', // Default path for /admin
          name: 'users',
          component: () => import('../views/AdminViews/Users.vue'),
        },
        {
          path: 'orders', // Default path for /admin
          name: 'orders',
          component: () => import('../views/AdminViews/Orders.vue'),
        },
        {
          path: 'products', // Default path for /admin
          name: 'products',
          component: () => import('../views/AdminViews/Products.vue'),
        },
      ],
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../pages/Profile.vue'),
    },
    {
      path: '/',
      component: () => import('../layouts/default.vue'),  // Use DefaultLayout for this route
      children: [
        {
          path: '/product/:id',
          name: 'product',
          component: () => import('../pages/product.vue'),
        }
      ]
    },
  ],
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router

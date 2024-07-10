// Composables
import { createRouter, createWebHistory } from 'vue-router'
import verifyAuthentication from "@/router/verifyAuthentication";
import Laboratories from '@/views/Laboratories.vue';
import LaboratoryInterface from '@/views/LaboratoryInterface.vue';
import AuthenticationLayout from '@/layouts/authentication/AuthenticationLayout.vue';
import MainAppLayout from '@/layouts/default/MainAppLayout.vue';
import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import MyData from '@/views/MyData.vue';
import MyDataEditForm from "@/views/MyDataEditForm.vue";
import MyPasswordRedefineForm from "@/views/MyPasswordRedefineForm.vue";
import ForgotPassword from "@/views/ForgotPassword.vue";

const routes = [
  {
    path: '/',
    component: MainAppLayout,
    meta: {
      authenticationRequired: true
    },
    children: [
      {
        path: '',
        name: 'home',
        component:  Home
      },
      {
        path:'/my-data',
        name:'my-data',
        component: MyData
      },
      {
        path:'/my-data-edit-form',
        name:'my-data-edit-form',
        component: MyDataEditForm
      },
      {
        path:'/my-password-redefine-form',
        name:'my-password-redefine-form',
        component: MyPasswordRedefineForm
      },
      {
        path:'/users',
        name:'users',
        component: ()=> import ('@/views/Users.vue')
      },
      {
        path:'/user-form/:id?',
        name:'user-form',
        props: true,
        component: ()=> import ('@/views/UserForm.vue')
      },
      {
        path:'/laboratories',
        name:'laboratories',
        component: Laboratories
      },
      {
        path:'/laboratory-form/:id?',
        name:'laboratory-form',
        props: true,
        component: ()=> import ('@/views/LaboratoryForm.vue')
      },
      {
        path:'/laboratory-interface/:id?',
        name:'laboratory-interface',
        props: true,
        component: LaboratoryInterface
      },
      {
        path:'/test-view/',
        name:'test-view',
        component: ()=> import ('@/views/TestView.vue')
      }
    ],
  },
  {
    path: '/authentication',
    name: 'authentication',
    component: AuthenticationLayout,
    meta: {
      authenticationRequired: false
    },
    children: [
      {
        path: '',
        name: 'login',
        authenticationRequired: false,
        component: Login
      },
      {
        path: '/forgot-password',
        name: 'forgot-password',
        authenticationRequired: false,
        component: ForgotPassword
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(verifyAuthentication);

export default router

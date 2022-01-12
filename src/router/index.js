import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '../views/HomePage.vue'
import testTest from '../views/test.vue'

/* Chart */
import chartPage from "../views/charts/acquisition/chartPage";

/* Documentation */
import docsHome from "../views/documentation"
import lineaireX from "../views/documentation/lineaires/x"
import lineaireY from "../views/documentation/lineaires/y"
import lineaireZ from "../views/documentation/lineaires/z"
import angulaireX from "../views/documentation/angulaires/x"
import angulaireY from "../views/documentation/angulaires/y"
import angulaireZ from "../views/documentation/angulaires/z"

const routes = [
  {
    path: "/test",
    component: testTest
  },

  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: "/chart",
    name: "Relevé de l'accélération",
    component: chartPage
  },
  {
    path: "/documentation",
    name: "Documentation",
    component: docsHome
  },
  {
    path: "/documentation/lineaires/x",
    name: "Linéaire en X",
    component: lineaireX
  },
  {
    path: "/documentation/lineaires/y",
    name: "Linéaire en Y",
    component: lineaireY
  },
  {
    path: "/documentation/lineaires/z",
    name: "Linéaire en Z",
    component: lineaireZ
  },
  {
    path: "/documentation/angulaires/x",
    name: "Angulaire en X",
    component: angulaireX
  },
  {
    path: "/documentation/angulaires/y",
    name: "Angulaire en Y",
    component: angulaireY
  },
  {
    path: "/documentation/angulaires/z",
    name: "Angulaire en Z",
    component: angulaireZ
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

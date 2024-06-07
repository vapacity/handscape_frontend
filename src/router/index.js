import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LearnPage from '../views/LearnPage.vue';
import ExamPage from '../views/ExamPage.vue';
import CreatePage from '../views/CreatePage.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/learn',
    name: 'LearnPage',
    component: LearnPage,
  },
  {
    path: '/exam',
    name: 'ExamPage',
    component: ExamPage,
  },
  {
    path: '/create',
    name: 'CreatePage',
    component: CreatePage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LearnPage from '../views/LearnPage.vue';
import ExamPage from '../views/ExamPage.vue';
import CreatePage1 from '../views/CreatePage1.vue';
import CreatePage2 from '../views/CreatePage2.vue';

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
    name: 'CreatePage1',
    component: CreatePage1,
  },
  {
    path: '/create',
    name: 'CreatePage2',
    component: CreatePage2,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

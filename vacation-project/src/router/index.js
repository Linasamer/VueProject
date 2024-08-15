import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import UserDetailsPage from '../views/UserDetailsPage.vue';
import RequestVacationPage from '../views/RequestVacationPage.vue';
import TaskDetailsPage from '../views/TaskDetailsPage.vue'; // Import the TaskDetailsPage component

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/user-details',
    name: 'UserDetails',
    component: UserDetailsPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/request-vacation',
    name: 'RequestVacation',
    component: RequestVacationPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/task-details/:id', // Dynamic route for Task Details
    name: 'TaskDetails',
    component: TaskDetailsPage,
    meta: { requiresAuth: true },
    props: true, // Pass route params as props to the component
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router; // Ensure this line is present

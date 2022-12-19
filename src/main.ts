import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import HelloWorld from "./components/HelloWorld.vue";
import TaskPlatform from "./components/TaskPlatform.vue";
import * as VueRouter from "vue-router";

const routes = [
  { path: "/", component: TaskPlatform },
  { path: "/test", component: HelloWorld },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");

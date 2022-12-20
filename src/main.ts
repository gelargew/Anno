import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import HelloWorld from "./components/HelloWorld.vue";
import TaskPlatform from "./components/TaskPlatform.vue";
import KonvaPage from "./components/KonvaPage.vue";
import * as VueRouter from "vue-router";
import VueKonva from "vue-konva";

const routes = [
  { path: "/", component: TaskPlatform },
  { path: "/test", component: HelloWorld },
  { path: "/konva", component: KonvaPage },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

createApp(App).use(router).use(VueKonva).mount("#app");

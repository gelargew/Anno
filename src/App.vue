<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import HelloWorld from "./components/HelloWorld.vue";
import TaskPlatform from "./components/TaskPlatform.vue";
import * as VueRouter from "vue-router";
import Vue from "vue";
</script>

<template>
  <nav>
    <router-link to="/">
      <img alt="Vue logo" src="../assets/logo.png" class="logo" />
    </router-link>
    <router-link to="/test">Test</router-link>
    <router-link to="/konva">Konva</router-link>
  </nav>
  <!-- <HelloWorld msg="Anno" /> -->
  <!-- <TaskPlatform /> -->

  <router-view />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

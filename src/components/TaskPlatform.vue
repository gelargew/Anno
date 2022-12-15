<script setup lang="ts">
import { useTaskStore } from "../store";
import { TabsData } from "./TabsData";
import { ref, onMounted, watch, reactive } from "vue";
import { Annotorious } from "@recogito/annotorious";
import "../styles/annotorious.css";
</script>

<template>
  <div>
    <nav>
      <button v-for="tab in TabsData">
        <p>{{ tab.title }}</p>
        <p>({{ tab.shortcut }})</p>
      </button>
    </nav>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
.imgWrapper {
  position: relative;
}
svg.a9s-annotationlayer {
  z-index: 9;
}
.annotator {
  width: 80vw;
  margin: auto;
  aspect-ratio: 16/9;
  position: relative;
}
.frontImage {
  touch-action: none;
  pointer-events: none;
  height: 99%;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}
.colorselector-widget {
  padding: 5px;
  border-bottom: 1px solid #e5e5e5;
}

.colorselector-widget button {
  outline: none;
  border: none;
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.5;
  margin: 4px;
}

.colorselector-widget button.selected,
.colorselector-widget button:hover {
  opacity: 1;
}

.active {
  background: red;
}
.none {
  display: none;
}
</style>

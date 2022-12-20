<script setup lang="ts">
import { ref, onMounted, watch, reactive } from "vue";
import { Annotorious } from "@recogito/annotorious";
import "../styles/annotorious.css";

const annotations = ref<any[]>([]);
const newAnnotation = ref<any[]>([]);
const annotationsToDraw = ref<any[]>([]);

const configKonva = {
  width: 800,
  height: 400,
};
const handleMouseDown = (event: MouseEvent) => {
  if (newAnnotation.value.length === 0) {
    const { x, y } = event.target.getStage().getPointerPosition();
    newAnnotation.value = [{ x, y, width: 0, height: 0, key: "0" }];
  }
};

const handleMouseUp = (event: MouseEvent) => {
  if (newAnnotation.value.length === 1) {
    const sx = newAnnotation.value[0].x;
    const sy = newAnnotation.value[0].y;
    const { x, y } = event.target.getStage().getPointerPosition();
    const annotationToAdd = {
      x: sx,
      y: sy,
      width: x - sx,
      height: y - sy,
      key: annotations.value.length + 1,
    };
    annotations.value.push(annotationToAdd);
    newAnnotation.value = [];
  }
};

const handleMouseMove = (event: MouseEvent) => {
  if (newAnnotation.value.length === 1) {
    const sx = newAnnotation.value[0].x;
    const sy = newAnnotation.value[0].y;
    const { x, y } = event.target.getStage().getPointerPosition();
    newAnnotation.value = [
      {
        x: sx,
        y: sy,
        width: x - sx,
        height: y - sy,
        key: "0",
      },
    ];
  }
};
const log = (e) => {
  console.log("asdsad");
};
watch(
  () => newAnnotation.value,
  (newVal) => {
    annotationsToDraw.value = [...annotations.value, ...newAnnotation.value];
  }
);
</script>

<template>
  <div></div>
  <v-stage
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mousedown="handleMouseDown"
    :config="configKonva"
  >
    <v-layer>
      <v-rect
        v-for="annotation in annotationsToDraw"
        :key="annotation.id"
        :config="{
          x: annotation.x,
          y: annotation.y,
          width: annotation.width,
          height: annotation.height,
          fill: 'red',
          opacity: 0.5,
          draggable: true,
        }"
        :on="{
          click: log,
        }"
      />
      }" />
    </v-layer></v-stage
  >
</template>

<style scoped></style>

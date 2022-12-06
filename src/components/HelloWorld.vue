<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Annotorious } from "@recogito/annotorious";
import "@recogito/annotorious/dist/annotorious.min.css";

defineProps<{ msg: string }>();

const count = ref(0);
const img = ref(null);
const anno = null;
const innitAnno = () => {};
onMounted(() => {
  const anno = new Annotorious({
    image: img.value,
  });
});
</script>

<template>
  <h1>{{ msg }}</h1>

  <img ref="img" src="https://w.wallha.com/ws/14/0IWudqMN.jpg" />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>

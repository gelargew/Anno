<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Annotorious } from "@recogito/annotorious";
import "../styles/annotorious.css";

defineProps<{ msg: string }>();
const annotations = ref<any[]>([]);
const categories = ["tops", "bottom", "underwear", "mask"];
const selectedCategory = ref("tops");

const count = ref(0);
const img = ref(null);
let anno: any = null;

const formatter = (annotation: any) => {
  console.log(annotation.bodies);
  const label = annotation.bodies.find((item: any) => item.category);
  const foreignObject = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "foreignObject"
  );
  foreignObject.innerHTML = `<label xmlns="http://www.w3.org/1999/xhtml">HELLO</label>`;

  return {
    element: foreignObject,
  };
};

const innitAnno = () => {
  anno = new Annotorious({
    image: img.value,
    widgets: [],
    allowEmpty: true,
    formatter: formatter,
  });
};
const log = () => {
  console.log(anno.getAnnotations());
};
onMounted(() => {
  innitAnno();
  anno.on("createSelection", async (selection: any) => {
    selection.body = [
      {
        ...selection.body,
        category: selectedCategory.value,
        subCategory: ["foo", "bar", "baz"],
      },
    ];
    await anno.updateSelected(selection);
    anno.saveSelected();
  });
  anno.on("createAnnotation", (annotation: any) => {
    console.log(annotation);
  });
});
</script>

<template>
  <h1 v-on:click="log()">{{ msg }}</h1>
  <div>
    <div class="imgWrapper">
      <img
        src="https://www.solidbackgrounds.com/images/1600x900/1600x900-black-solid-color-background.jpg"
        ref="img"
        class="annotator"
      />
      <img
        class="frontImage"
        src="https://images.unsplash.com/photo-1540324155974-7523202daa3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80"
      />
    </div>
    <div>
      <ul>
        <li
          @:click="selectedCategory = category"
          v-for="category in categories"
        >
          {{ category }}
        </li>
      </ul>
    </div>
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

svg.a9s-annotationlayer .a9s-annotation.RED .a9s-outer {
  stroke: red;
  stroke-width: 3;
  fill: rgba(255, 0, 0, 0.3);
}

svg.a9s-annotationlayer .a9s-annotation.GREEN .a9s-outer {
  stroke: green;
  stroke-width: 3;
  fill: rgba(0, 255, 0, 0.3);
}

svg.a9s-annotationlayer .a9s-annotation.BLUE .a9s-outer {
  stroke: blue;
  stroke-width: 3;
  fill: rgba(0, 0, 255, 0.3);
}

svg.a9s-annotationlayer .a9s-annotation.RED .a9s-inner,
svg.a9s-annotationlayer .a9s-annotation.GREEN .a9s-inner,
svg.a9s-annotationlayer .a9s-annotation.BLUE .a9s-inner {
  fill: transparent;
  stroke: none;
}
</style>

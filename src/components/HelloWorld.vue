<script setup lang="ts">
import { ref, onMounted, watch, reactive } from "vue";
import { Annotorious } from "@recogito/annotorious";
import "../styles/annotorious.css";

const DUMMY = {
  "@context": "http://www.w3.org/ns/anno.jsonld",
  type: "Annotation",
  body: [
    {
      category: "tops",
      subCategory: ["foo", "bar", "baz"],
    },
  ],
  target: {
    source:
      "https://www.solidbackgrounds.com/images/1600x900/1600x900-black-solid-color-background.jpg",
    selector: {
      type: "FragmentSelector",
      conformsTo: "http://www.w3.org/TR/media-frags/",
      value:
        "xywh=pixel:651.3306274414062,133.4931640625,761.8317260742188,342.9393310546875",
    },
  },
};

defineProps<{ msg: string }>();
const annotations = ref<any[]>([]);
const categories = ["tops", "bottom", "underwear", "mask"];
const selectedCategory = ref("tops");

const count = ref(0);
const img = ref(null);
const layouts = reactive({
  comments: true,
  labels: true,
});
let anno: any = null;

const formatter = (annotation: any) => {
  const selected = annotation.bodies[0];

  const foreignObject = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "foreignObject"
  );
  if (selected)
    foreignObject.innerHTML = `<label xmlns="http://www.w3.org/1999/xhtml">${selected.category}</label>`;

  return {
    element: foreignObject,
    className: selected && "category" in selected ? "annotationLabels" : "",
  };
};

const innitAnno = () => {
  anno = new Annotorious({
    image: img.value,
    widgets: ["COMMENT"],
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
    if (layouts.labels) {
      await anno.updateSelected(selection);
      anno.saveSelected();
    }
  });
  anno.on("startSelection", (annotation: any) => {
    console.log(annotation);
  });
});

watch(layouts, () => {
  const labels = document.querySelectorAll(".annotationLabels");
  if (layouts.labels) {
    labels.forEach((el) => {
      el.classList.remove("none");
    });
  } else {
    labels.forEach((el) => {
      el.classList.add("none");
    });
  }
  console.log(labels);
});

const addAnno = () => {
  anno.addAnnotation(DUMMY);
  console.log("--add");
};
</script>

<template>
  <h1 v-on:click="addAnno">{{ msg }}</h1>
  <div>
    <button
      :class="{ active: layouts.labels }"
      @:click="layouts.labels = !layouts.labels"
    >
      Labels
    </button>
    <button
      :class="{ active: layouts.comments }"
      @:click="layouts.comments = !layouts.comments"
    >
      Comments
    </button>
  </div>
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
          :class="{
            active: selectedCategory === category,
          }"
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

.active {
  background: red;
}
.none {
  display: none;
}
</style>

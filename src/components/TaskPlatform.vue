<script setup lang="ts">
import { useTaskStore } from "../store";
import { TabsData, DUMMY_CATEGORIES } from "./TabsData";
import { ref, onMounted, watch, reactive } from "vue";
import { Annotorious } from "@recogito/annotorious";
import "../styles/annotorious.css";
import { ObjectListType } from "../types";
import { DEFAULT_ANNOTATION } from "../constants";
import { assertNoop } from "@babel/types";

const objectList = ref<{
  [key: string]: { attributes: { [key: string]: string | null } };
}>({});
const selectedObject = ref<typeof DUMMY_CATEGORIES[0] | null>(null);
const currentObjectIndex = ref<"none" | number>("none");
const currentAttributeStep = ref(0);

// LABELS
const labelOptions = ref<{ title: string; option: string[] }[] | null>(null);
const labelStep = ref(0);
const labelData = ref<{ [key: string]: string | null }>({});

const saveLabel = () => {
  const object = {
    category: selectedObject.value?.name,
    attributes: labelData.value,
  };
  console.log(object);
  if (currentObjectIndex.value !== "none") {
    objectList.value[DUMMY_CATEGORIES[currentObjectIndex.value].name] = object;
  }
  currentObjectIndex.value = "none";
  labelOptions.value = null;
  labelStep.value = 0;
  labelData.value = {};
};

watch(
  () => currentObjectIndex.value,
  (newVal) => {
    if (newVal !== "none") {
      labelOptions.value = DUMMY_CATEGORIES[newVal].classes;
      labelData.value = DUMMY_CATEGORIES[newVal].classes.reduce(
        (acc, cur) => ({ ...acc, [cur.title]: null }),
        {}
      );
    }
    console.log(labelData.value);
  }
);

// ANNOTATIONS
const annotations = ref<any[]>([]);
const img = ref(null);
const selectedAnnotation = ref<any>(null);
const selectedCategory = ref("tops");
const layouts = reactive({
  comments: true,
  labels: true,
});
let anno: any = null;

function* idGenerator() {
  let id = 0;
  while (true) {
    yield (++id).toString();
  }
}
const idGen = idGenerator();

const formatter = (annotation: any) => {
  const selected = annotation.bodies[0];

  const foreignObject = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "foreignObject"
  );
  if (selected) {
    foreignObject.innerHTML = `<label xmlns="http://www.w3.org/1999/xhtml">${selected.category}</label>`;
  }
  return {
    element: foreignObject,
    className: selected && "category" in selected ? "annotationLabels" : "",
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
onMounted(() => {
  innitAnno();
  anno.on("createSelection", async (selection: any) => {
    anno.cancelSelected();
  });
  anno.on("cancelSelected", function (selection: any) {
    console.log(selection);
    anno.selectAnnotation(selection);
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

const addAnno = (i: number) => {
  const category = DUMMY_CATEGORIES[i].name;
  const annotation = annotations.value.find(
    (anno) => anno.body.category === category
  );
  if (annotation) {
    anno.selectAnnotation(annotation.id);
    return;
  }
  const id = idGen.next().value;
  const newAnnotation = {
    ...DEFAULT_ANNOTATION,
    body: {
      ...DEFAULT_ANNOTATION.body,
      category: DUMMY_CATEGORIES[i].name,
      attributes: DUMMY_CATEGORIES[i].classes.reduce(
        (acc, cur) => ({ ...acc, [cur.title]: null }),
        {}
      ),
    },
    id,
  };
  anno.addAnnotation(newAnnotation);
  selectedAnnotation.value = id;
  anno.selectAnnotation(id);
  annotations.value.push(newAnnotation);
};

const saveAnno = () => {
  const annotation = annotations.value.find(
    (anno) => anno.id === selectedAnnotation.value
  );
  if (annotation) {
    annotation.body.attributes = labelData.value;
    anno.updateSelected(annotation);
    anno.cancelSelected();
  } else {
    anno.selectAnnotation(selectedAnnotation.value);
  }
};

const updateAttribute = (key: string, value: string) => {
  const annotation = annotations.value.find(
    (anno) => anno.id === selectedAnnotation.value
  );
  if (annotation) {
    annotation.body.attributes[key] = value;
  }
};

const log = () => {
  console.log(annotations.value);
};

const readOnly = () => {
  anno.readOnly = true;
};
const notReadOnly = () => {
  anno.readOnly = false;
};
</script>

<template>
  <button @click="log">LOG</button>
  <button
    @click="
      () => {
        anno.readOnly = !anno.readOnly;
      }
    "
  >
    TOGGLE READ ONlY
  </button>
  <div class="container">
    <nav class="annotator-tabs">
      <button v-for="tab in TabsData">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Pi-symbol.svg/2116px-Pi-symbol.svg.png"
        />
        <p>{{ tab.title }}</p>
        <p>({{ tab.shortcut }})</p>
      </button>
    </nav>
    <div class="annotatorWrapper">
      <div class="imgWrapper">
        <img
          ref="img"
          class="annotatorImg"
          src="https://images.unsplash.com/photo-1540324155974-7523202daa3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80"
        />
      </div>
    </div>
    <div class="options">
      <div v-if="!labelOptions">
        <h4>Category</h4>
        <ul>
          <li v-for="(category, i) in DUMMY_CATEGORIES">
            <button
              @click="
                () => {
                  currentObjectIndex = i;
                  addAnno(i);
                }
              "
            >
              {{ category.name }}
            </button>
          </li>
        </ul>
      </div>
      <div v-else>
        <div class="flex">
          <button v-if="labelStep" @click="() => labelStep--">back</button>
          <h4>
            {{ labelOptions[labelStep].title }}
          </h4>
          <button
            v-if="labelStep + 1 < labelOptions.length"
            @click="() => labelStep++"
          >
            next
          </button>
        </div>

        <ul>
          <fieldset
            @change="
              (e) => {

                if (labelOptions && e.target) {
                  updateAttribute(labelOptions[labelStep].title, (e.target as HTMLInputElement).value);
                }
                
              }
            "
          >
            <li v-for="attribute in labelOptions[labelStep].option">
              <input
                :checked="
                  labelData[labelOptions[labelStep].title] === attribute
                "
                type="radio"
                :name="labelOptions[labelStep].title"
                :value="attribute"
              />
              <span>{{ attribute }}</span>
            </li>
          </fieldset>
        </ul>
        <button
          v-if="labelStep + 1 < labelOptions.length"
          @click="() => labelStep++"
        >
          Next
        </button>
        <button
          v-else
          @click="
            () => {
              saveLabel();
              saveAnno();
            }
          "
        >
          Submit
        </button>
      </div>
      <div v-if="currentObjectIndex === 'none'">
        <h4>Object List</h4>
        <ul>
          <li v-for="(value, key) in objectList" :key="key">
            <span v-for="(attribute, key) in value.attributes" :key="key">
              {{ attribute }} /
            </span>
          </li>
        </ul>
      </div>

      <h1>OPTIONS</h1>
    </div>
  </div>
  <div>
    <pre>{{ JSON.stringify(objectList) }}</pre>
    <ul>
      <pre v-for="obj in annotations.values()" :key="obj.id">
        {{ JSON.stringify(obj) }}</pre
      >
    </ul>
    <pre>{{ JSON.stringify(labelData) }}</pre>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
}

.annotator-tabs {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.annotator-tabs button {
  padding: 0.8rem;
}

.flex {
  display: flex;
}

.annotatorWrapper {
  height: 40vw;
  aspect-ratio: 16/9;
  position: relative;
  background: #222a35;
}
.imgWrapper {
  height: 100%;
  width: fit-content;
  margin: auto;
}
.imgWrapper > div {
  height: 100%;
  width: 100%;
  position: relative;
}
.annotatorImg {
  height: 40vw;
  object-fit: contain;
  position: relative;
}
svg.a9s-annotationlayer {
  z-index: 9;
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
</style>

<script setup lang="ts">
import { useTaskStore } from "../store";
import { TabsData, DUMMY_CATEGORIES } from "./TabsData";
import { ref, onMounted, watch, reactive } from "vue";
import { Annotorious } from "@recogito/annotorious";
import "../styles/annotorious.css";
import { ObjectListType } from "../types";
import { DEFAULT_ANNOTATION } from "../constants";
import { assertNoop } from "@babel/types";
import { CategoryProps } from "../store";
const {
  activeTab,
  changeTab,
  categories,
  setCategories,
  setActiveCategory,
  activeCategory,
} = useTaskStore();

// ANNOTATIONS
const annotations = ref<any[]>([]);
const img = ref(null);
const selectedAnnotation = ref<any>(null);
const selectedCategory = ref("tops");
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
    disableEditor: true,
    disableSelect: true,
    readOnly: true,
  });
};
onMounted(() => {
  innitAnno();
  anno.on("createSelection", async (selection: any) => {
    anno.cancelSelected();
  });
  anno.on("cancelSelected", function (selection: any) {
    anno.saveSelected();
  });
});

// watch(layouts, () => {
//   const labels = document.querySelectorAll(".annotationLabels");
//   if (layouts.labels) {
//     labels.forEach((el) => {
//       el.classList.remove("none");
//     });
//   } else {
//     labels.forEach((el) => {
//       el.classList.add("none");
//     });
//   }
// });

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
    // annotation.body.attributes = labelData.value;
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

const onSelectCategory = (category: CategoryProps) => {
  if (activeTab.value.id === 1) {
    anno.readOnly = false;
  }

  const annotation = annotations.value.find(
    (anno) => anno.id === selectedAnnotation.value
  );
  if (annotation) {
    selectedCategory.value = annotation.body.category;
  }
};

watch([activeTab, activeCategory], (prev, next) => {
  if (prev[0].id != next[0].id) {
    // Every tab changes
    setActiveCategory(null);
  }
  // on select report
  if (activeTab.value.id === 6 && anno.readOnly) {
    anno.readOnly = !anno.readOnly;
  } else {
    anno.readOnly = anno.readOnly ? !anno.readOnly : anno.readOnly;
  }
  // on label tab & select category
  if (activeTab.value.id === 2 && activeCategory.value) {
    anno.readOnly = anno.readOnly ? !anno.readOnly : anno.readOnly;
    anno.disableSelect = anno.disableSelect
      ? !anno.disableSelect
      : anno.disableSelect;
  } else {
    anno.readOnly = anno.readOnly ? anno.readOnly : !anno.readOnly;
    anno.disableSelect = anno.disableSelect
      ? anno.disableSelect
      : !anno.disableSelect;
  }
});
</script>

<template>
  <!-- HEADER -->
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
    <!-- TABS -->
    <nav class="annotator-tabs">
      <button
        @click="() => changeTab(tab)"
        v-for="tab in TabsData"
        :class="{
          active: tab.id === activeTab.id,
          disabled:
            tab.disabledWithoutCategory && Object.keys(categories).length,
        }"
      >
        <img :src="tab.iconUrl" />
        <p>{{ tab.title }}</p>
        <p>({{ tab.shortcut }})</p>
      </button>
    </nav>
    <!-- ANNOTATOR -->
    <div class="annotatorWrapper">
      <div class="imgWrapper">
        <img
          ref="img"
          class="annotatorImg"
          src="https://images.unsplash.com/photo-1540324155974-7523202daa3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80"
        />
      </div>
    </div>
    <!-- OPTIONS -->
    <div class="options">
      <div
        class="category"
        :class="{
          active: activeTab.id === 1 || activeTab.id === 2,
        }"
        v-if="activeTab.id != 1"
      >
        <h4>Category</h4>
        <ul>
          <li
            :class="{
              active: activeCategory && activeCategory.id === category.id,
            }"
            v-for="(category, i) in DUMMY_CATEGORIES"
          >
            <button @click="() => setActiveCategory(category)">
              ({{ category.id }}) {{ category.name }}
            </button>
          </li>
        </ul>
      </div>
      <div v-else>
        <div class="flex">
          <!-- <button v-if="labelStep" @click="() => labelStep--">back</button>
          <h4>
            {{ labelOptions[labelStep].title }}
          </h4>
          <button
            v-if="labelStep + 1 < labelOptions.length"
            @click="() => labelStep++"
          >
            next
          </button> -->
        </div>

        <!-- <ul>
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
        </ul> -->
        <!-- <button
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
        </button> -->
      </div>
      <!-- <div v-if="currentObjectIndex === 'none'">
        <h4>Object List</h4>
        <ul>
          <li v-for="(value, key) in objectList" :key="key">
            <span v-for="(attribute, key) in value.attributes" :key="key">
              {{ attribute }} /
            </span>
          </li>
        </ul>
      </div> -->
    </div>
  </div>
  <!-- <div>
    <pre>{{ JSON.stringify(objectList) }}</pre>
    <ul>
      <pre v-for="obj in annotations.values()" :key="obj.id">
        {{ JSON.stringify(obj) }}</pre
      >
    </ul>
    <pre>{{ JSON.stringify(labelData) }}</pre>
  </div> -->
</template>

<style scoped>
.container {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  background: white;
  color: black;
}

.container * {
  color: inherit;
}

.annotator-tabs {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.annotator-tabs button {
  padding: 0.8rem;
  color: black;
  font-size: 0.8rem;
  border: none;
  outline: none;
}

.annotator-tabs button.active {
  background: #0085ff;
  color: white;
}
.annotator-tabs button.active img {
  filter: invert(1);
}

.options {
  flex: 1;
}

.options h4 {
  padding-left: 1rem;
}
.options input {
  accent-color: blue;
}

.options li {
  padding-left: 1.2rem;
}

.options ul {
  padding-left: 0;
  list-style: none;
}
.options h4 {
  font-weight: 700;
  line-height: 1.2em;
}

.category {
  opacity: 0.6;
  pointer-events: none;
}
.category.active {
  opacity: 1;
  pointer-events: auto;
}

.category li {
  line-height: 2.5em;
  font-size: 0.8rem;
  transition: 0.2s;
  cursor: pointer;
}

.category li:hover,
.category li.active {
  background: #0085ff;
  color: white;
}

.category li button {
  text-transform: uppercase;
  display: block;
  height: 100%;
  width: 100%;
  text-align: left;
  line-height: 2.5em;
}

.flex {
  display: flex;
}

.annotatorWrapper {
  height: 40vw;
  aspect-ratio: 9/6;
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

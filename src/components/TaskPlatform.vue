<script setup lang="ts">
import { useTaskStore } from "../store";
import { TabsData, DUMMY_CATEGORIES } from "./TabsData";
import { ref, onMounted, watch, reactive } from "vue";
import { Annotorious } from "@recogito/annotorious";
import "../styles/annotorious.css";
import { ObjectListType } from "../types";
import { DEFAULT_ANNOTATION } from "../constants";
import { DUMMY_ATTRIBUTES_OPTIONS } from "../dummy/category";
const {
  activeTab,
  changeTab,
  categories,
  setCategories,
  setActiveCategory,
  activeCategory,
  selectedAttributeOption,
  setAttributeOption,
  selectedAttributes,
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
    style: `stroke: black;`,
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
  anno.on("cancelSelected", () => {
    anno.readOnly = anno.readOnly ? anno.readOnly : !anno.readOnly;
    changeTab(null);
    setActiveCategory(null);
  });
  anno.on("createSelection", async (selection: any) => {
    if (activeCategory.value) {
      anno.saveSelected();
    } else {
      anno.cancelSelected();
    }
  });
  anno.on("createAnnotation", (annotation: any) => {
    if (activeCategory.value) {
      setCategories({
        ...activeCategory.value,
        annotationData: annotation,
      });
    }
    changeTab(TabsData[0]);
    anno.selectAnnotation(annotation.id);
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

const log = () => {
  console.log(categories.value);
};

watch([activeTab, activeCategory], (next, prev) => {
  if (prev[0]?.id != next[0]?.id) {
    // Every tab changes
    // setActiveCategory(null);
  }
  // on select report
  // if (activeTab.value.id === 6 && anno.readOnly) {
  //   anno.readOnly = !anno.readOnly;
  // } else {
  //   anno.readOnly = anno.readOnly ? !anno.readOnly : anno.readOnly;
  // }

  // on every category changes
  if (next[1]?.id != prev[1]?.id) {
    // on label tab & select category
    const selectCategory = categories.value.find(
      (c) => c.id === activeCategory.value?.id
    );
    console.log(selectCategory, "selectcategory");
    if (selectCategory) {
      anno.selectAnnotation(selectCategory.annotationData);
      anno.disableSelect = anno.disableSelect
        ? anno.disableSelect
        : !anno.disableSelect;
    } else {
      anno.readOnly = anno.readOnly ? !anno.readOnly : anno.readOnly;
      anno.disableSelect = anno.disableSelect
        ? !anno.disableSelect
        : anno.disableSelect;
    }
  }

  // on label tab & select category
  console.log(activeCategory.value, next[0]?.id);
  if (next[0]?.id === 1 && activeCategory.value) {
  } else {
    anno.readOnly = anno.readOnly ? anno.readOnly : !anno.readOnly;
    anno.disableSelect = anno.disableSelect
      ? anno.disableSelect
      : !anno.disableSelect;
  }
  if (activeCategory.value) {
    anno.readOnly = anno.readOnly ? !anno.readOnly : anno.readOnly;
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
          active: tab.id === activeTab?.id,
          disabled: tab.id != 6 && activeCategory === null,
        }"
      >
        <img :src="tab.iconUrl" />
        <p>{{ tab.title }}</p>
        <p>({{ tab.shortcut }})</p>
      </button>
    </nav>
    <!-- ANNOTATOR -->
    <div>
      <div class="annotatorWrapper">
        <div class="imgWrapper">
          <img
            ref="img"
            class="annotatorImg"
            src="https://images.unsplash.com/photo-1540324155974-7523202daa3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=715&q=80"
          />
        </div>
      </div>
      <div class="bottomMenu">
        <p></p>
        <nav>
          <p>1 / 100</p>
          <a href="#">&gt;</a>
        </nav>
        <button v-if="activeCategory">SAVE</button>
      </div>
    </div>
    <!-- OPTIONS -->
    <div class="options">
      <div
        class="category"
        :class="{
          active: true,
        }"
        v-if="activeTab?.id != 1"
      >
        <h4>Category</h4>
        <ul>
          <li
            :class="{
              active: activeCategory && activeCategory.id === category.id,
            }"
            v-for="(category, i) in DUMMY_CATEGORIES"
          >
            <button
              @click="
                () => {
                  anno.saveSelected();
                  anno.readOnly = anno.readOnly
                    ? !anno.readOnly
                    : anno.readOnly;
                  setActiveCategory(category);
                }
              "
            >
              ({{ category.id }}) {{ category.name }}
            </button>
          </li>
        </ul>
      </div>
      <div v-else>
        <div class="flex">
          <h4>Attribute</h4>
          <ul>
            <fieldset v-if="selectedAttributeOption === 0">
              <li v-for="attribute in DUMMY_ATTRIBUTES_OPTIONS.classCategory">
                <input
                  type="radio"
                  :id="attribute.classCategoryName"
                  name="classCategory"
                  :value="attribute"
                />
                <label :for="attribute.classCategoryName">{{
                  attribute.classCategoryName
                }}</label>
              </li>
            </fieldset>
            <fieldset v-if="selectedAttributeOption === 1">
              <li
                v-for="attribute in DUMMY_ATTRIBUTES_OPTIONS.subClassCategory"
              >
                <input
                  type="radio"
                  :id="attribute.subClassCategoryName"
                  name="subClassCategory"
                  :value="attribute"
                />
                <label :for="attribute.subClassCategoryName">{{
                  attribute.subClassCategoryName
                }}</label>
              </li>
            </fieldset>
            <fieldset v-if="selectedAttributeOption === 2">
              <li v-for="attribute in DUMMY_ATTRIBUTES_OPTIONS.classAttribute">
                <input
                  type="radio"
                  :id="attribute.classAttributeName"
                  name="classAttribute"
                  :value="attribute"
                />
                <label :for="attribute.classAttributeName">{{
                  attribute.classAttributeName
                }}</label>
              </li>
            </fieldset>
            <fieldset v-if="selectedAttributeOption === 3">
              <li v-for="attribute in DUMMY_ATTRIBUTES_OPTIONS.attribute">
                <input
                  type="radio"
                  :id="attribute.attributeName"
                  name="attribute"
                  :value="attribute"
                />
                <label :for="attribute.attributeName">{{
                  attribute.attributeName
                }}</label>
              </li>
            </fieldset>
          </ul>
        </div>

        <button
          v-if="selectedAttributeOption < 3"
          @click="() => setAttributeOption(selectedAttributeOption + 1)"
        >
          Next
        </button>
        <button v-else @click="() => {}">Submit</button>
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
.none {
  display: none;
}

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

.annotator-tabs button.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.annotator-tabs button.active img {
  filter: invert(1);
}

.bottomMenu {
  display: flex;
  justify-content: space-between;
  place-items: center;
  padding: 1rem 0;
}
.bottomMenu nav {
  display: flex;
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

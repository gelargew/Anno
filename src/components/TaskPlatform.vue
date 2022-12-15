<script setup lang="ts">
import { useTaskStore } from "../store";
import { TabsData, DUMMY_CATEGORIES } from "./TabsData";
import { ref, onMounted, watch, reactive } from "vue";
import { Annotorious } from "@recogito/annotorious";
import "../styles/annotorious.css";
import { ObjectListType } from "../types";

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
  }
);

const log = (e: any) => {
  labelData.value[e.target.name] = e.target.value;
};
</script>

<template>
  <div>
    <pre>{{ JSON.stringify(objectList) }}</pre>
    <pre>{{ JSON.stringify(labelData) }}</pre>
  </div>
  <div class="container">
    <nav class="annotator-tabs">
      <button v-for="tab in TabsData">
        <img src="{{LabelIcon}}" />
        <p>{{ tab.title }}</p>
        <p>({{ tab.shortcut }})</p>
      </button>
    </nav>
    <div class="annotatorWrapper">
      <h1 @click="log">ANNOTATOR</h1>
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
          <fieldset @change="log">
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
        <button v-else @click="saveLabel">Submit</button>
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
  flex: 1;
  aspect-ratio: 16/9;
  position: relative;
  background: #222a35;
}
.imgWrapper {
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

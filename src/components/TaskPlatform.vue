<script setup lang="ts">
import { useTaskStore } from "../store";
import { TabsData, DUMMY_CATEGORIES } from "./TabsData";
import { ref, onMounted, watch, reactive } from "vue";
import { Annotorious } from "@recogito/annotorious";
import "../styles/annotorious.css";
import { ObjectListType } from "../types";

const objectList = ref<ObjectListType[]>([]);
const selectedObject = ref<typeof DUMMY_CATEGORIES[0] | null>(null);
const currentObjectIndex = ref(99);
const currentAttributeStep = ref(0);

const log = (e: any) => {
  console.log(selectedObject.value);
};
</script>

<template>
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
      <div v-if="!selectedObject">
        <h4>Category</h4>
        <ul>
          <li
            @click="() => (currentAttributeStep = i)"
            v-for="(category, i) in DUMMY_CATEGORIES"
          >
            {{ category.name }}
          </li>
        </ul>
      </div>
      <div v-else>
        <div class="flex">
          <span>back</span>
          <h4>
            {{
              DUMMY_CATEGORIES[currentObjectIndex].classes[currentAttributeStep]
                .title
            }}
          </h4>
          <span>next</span>
        </div>

        <ul>
          <fieldset @change="log">
            <li
              v-for="attribute in DUMMY_CATEGORIES[currentObjectIndex].classes[
                currentAttributeStep
              ].option"
            >
              <input
                type="radio"
                :name="DUMMY_CATEGORIES[currentObjectIndex].name"
                :value="attribute"
              />
              <span>{{ attribute }}</span>
            </li>
          </fieldset>
        </ul>
        <button>Next</button>
      </div>
      <div v-if="!selectedObject">
        <h4>Object List</h4>
        <ul>
          <li v-for="(object, i) in objectList" :key="i">
            {{ object.id }}/{{ object.category }}/{{ object.category }}
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

import { ref, watch } from "vue";
import { TabsData, TabsProps } from "./components/TabsData";
import { AttributeNameProps, AttributeOptionProps } from "./types";

type ActiveTabs =
  | "report"
  | "attributes"
  | "labels"
  | "feedback"
  | "fit-width"
  | "group";

export interface CategoryProps {
  name: string;
  id: string;
  annotationData?: any;
}

const a = {
  classAttribute: null,
  classCategory: null,
  subClassCategory: null,
  attribute: null,
};

export const useTaskStore = () => {
  const activeTab = ref<TabsProps | null>(TabsData[5]);
  const action = ref<ActiveTabs>("report");
  const annotations = ref<any[]>([]);
  const activeCategory = ref<CategoryProps | null>(null);
  const categories = ref<CategoryProps[]>([]);
  const selectedAttributeOption = ref(0);
  const selectedAttributes = ref<{
    classAttribute: null | string;
    classCategory: null | string;
    subClassCategory: null | string;
    attribute: null | string;
  }>({
    classAttribute: null,
    classCategory: null,
    subClassCategory: null,
    attribute: null,
  });

  let anno = null;

  const addAnnotation = (annotation: any) => {
    annotations.value.push(annotation);
  };
  const changeTab = (tab: TabsProps | null) => {
    activeTab.value = tab;
  };

  const setCategories = (category: CategoryProps) => {
    console.log(category.id);
    categories.value.push(category);
  };

  watch(activeCategory, (newCategory) => {
    if (newCategory) {
      selectedAttributeOption.value = 0;
    }
  });

  const setAttributeOption = (attributeOption: number) => {
    selectedAttributeOption.value = attributeOption;
  };

  return {
    activeTab,
    annotations,
    addAnnotation,
    action,
    changeTab,
    anno,
    categories,
    setCategories,
    activeCategory,
    setActiveCategory: (category: CategoryProps | null) => {
      activeCategory.value = category;
    },
    selectedAttributeOption,
    setAttributeOption,
    selectedAttributes,
  };
};

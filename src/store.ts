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
  attributes: AttributeOptionProps;
  annotationData?: any;
}

export const useTaskStore = () => {
  const activeTab = ref<TabsProps>(TabsData[5]);
  const action = ref<ActiveTabs>("report");
  const annotations = ref<any[]>([]);
  const activeCategory = ref<CategoryProps | null>(null);
  const categories = ref<CategoryProps[]>([]);
  const selectedAttribueOption = ref<AttributeNameProps | null>(null);

  let anno = null;

  const addAnnotation = (annotation: any) => {
    annotations.value.push(annotation);
  };
  const changeTab = (tab: TabsProps) => {
    activeTab.value = tab;
  };

  const setCategories = (category: CategoryProps) => {
    console.log(category.id);
    categories.value.push(category);
  };

  watch(activeCategory, (newCategory) => {
    if (newCategory) {
      selectedAttribueOption.value = Object.keys(
        newCategory.attributes
      )[0] as AttributeNameProps;
    }
  });

  const changeAttributeOption = (attributeOption: AttributeNameProps) => {
    selectedAttribueOption.value = attributeOption;
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
    selectedAttribueOption,
    changeAttributeOption,
  };
};

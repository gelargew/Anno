import { ref, watch } from "vue";
import { TabsData, TabsProps } from "./components/TabsData";

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
  classes: {
    title: string;
    option: string[];
  }[];
  annotationData?: any;
}

export const useTaskStore = () => {
  const activeTab = ref<TabsProps>(TabsData[5]);
  const action = ref<ActiveTabs>("report");
  const annotations = ref<any[]>([]);
  const activeCategory = ref<CategoryProps | null>(null);
  const categories = ref<{
    [key: string]: CategoryProps;
  }>({});
  let anno = null;

  const addAnnotation = (annotation: any) => {
    annotations.value.push(annotation);
  };
  const changeTab = (tab: TabsProps) => {
    activeTab.value = tab;
  };

  const setCategories = (category: CategoryProps) => {
    categories.value[category.id] = category;
  };

  watch(activeCategory, (newTab) => {
    console.log(activeCategory.value);
  });

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
  };
};

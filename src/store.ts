import { ref } from "vue";
import { TabsData, TabsProps } from "./components/TabsData";

type ActiveTabs =
  | "report"
  | "attributes"
  | "labels"
  | "feedback"
  | "fit-width"
  | "group";

export const useTaskStore = () => {
  const activeTab = ref<TabsProps>(TabsData[5]);
  const action = ref<ActiveTabs>("report");
  const annotations = ref<any[]>([]);

  const addAnnotation = (annotation: any) => {
    annotations.value.push(annotation);
  };
  const changeTab = (tab: TabsProps) => {
    activeTab.value = tab;
  };

  return { activeTab, annotations, addAnnotation, action, changeTab };
};

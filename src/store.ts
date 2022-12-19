import { ref } from "vue";

type ActiveTabs =
  | "report"
  | "attributes"
  | "labels"
  | "feedback"
  | "fit-width"
  | "group";

export const useTaskStore = () => {
  const activeTab = ref<ActiveTabs[]>(["report"]);
  const action = ref<ActiveTabs>("report");
  const annotations = ref<any[]>([]);

  const addAnnotation = (annotation: any) => {
    annotations.value.push(annotation);
  };

  return { activeTab, annotations, addAnnotation, action };
};

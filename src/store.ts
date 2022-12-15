import { ref } from "vue";

export const useTaskStore = () => {
  const activeTab = ref("all");
  const annotations = ref<any[]>([]);

  const addAnnotation = (annotation: any) => {
    annotations.value.push(annotation);
  };

  return { activeTab, annotations, addAnnotation };
};

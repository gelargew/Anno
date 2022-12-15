export interface ObjectListType {
  id?: string;
  category: string;
  attributes: {
    [key: string]: string | null;
  };
}

export interface ObjectListType {
  id?: string;
  category: string;
  attributes: {
    [key: string]: string | null;
  };
}

export type AttributeOptionProps = [
  "category",
  "classCategory",
  "subClassCategory",
  "classAttribute",
  "attribute"
];
export type AttributeNameProps =
  | "category"
  | "classCategory"
  | "subClassCategory"
  | "classAttribute"
  | "attribute";

export interface CategoryProps {
  id: number;
  categoryName: string;
  version: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  function_types: boolean;
}

const a = {
  id: 892,
  classAttributeId: 136,
  attributeName: "Plain",
  version: "1",
  createdAt: "2022-12-16T07:17:57.000Z",
  updatedAt: "2022-12-16T07:17:57.000Z",
};

export interface ClassCategoryProps {
  id: number;
  categoryId: number;
  classCategoryName: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubClassCategoryProps {
  id: number;
  classCategoryId: number;
  subClassCategoryName: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassAttributeProps {
  id: number;
  classAttributeName: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttributeProps {
  id: number;
  classAttributeId: number;
  attributeName: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttributesOptionsProps {
  classCategory: ClassCategoryProps[];
  subClassCategory: SubClassCategoryProps[];
  classAttribute: ClassAttributeProps[];
  attribute: AttributeProps[];
}

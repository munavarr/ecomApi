interface ProductInfo {
    id: number | null;
    productfield: string;
    productvalue: string | number | null;
    isNumber: boolean;
  }
  
  interface VariantValue {
    id: number | null;
    fieldValue: string | File | null; // Assuming File is referring to a file object
    idAdditional: string;
    isImage: boolean;
    image?:string;
  }
  
  interface Variant {
    id: number | null;
    field: string;
    values: VariantValue[];

  }
  
 export interface DataStructure {
    productinfo: ProductInfo[];
    variants: Variant[];
  }
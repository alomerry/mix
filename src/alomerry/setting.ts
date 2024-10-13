export const button_english_only_enable = true; // 是否展示仅英文按钮

export const DEFAULT_LANG = "zh";

// type 下的分类，如 IOI 下的 LeetCode Easy、Medium、Hard
export declare interface Category {
  name: string;
  to: string;
  count?: number;
  dotColor?: string;
}

export const categories: Category[] = [
  { name: "博文", to: "/posts" },
  { name: "笔记", to: "/docs" },
  { name: "算法", to: "/ioi" },
];

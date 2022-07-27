import type { ComputedRef, InjectionKey } from "vue";
import type { BlogCategoryData } from "vuepress-plugin-blog2";
import type { GungnirThemePostData, GungnirThemePostInfo } from "../../shared";
export declare type TagMapRef = ComputedRef<BlogCategoryData<GungnirThemePostInfo>>;
export declare const tagMapSymbol: InjectionKey<TagMapRef>;
export declare const useTagMap: () => TagMapRef;
export declare const setupTagMap: () => void;
export interface TagType {
    name: string;
    path: string;
    pages: Array<GungnirThemePostData>;
    tagColor?: string;
}
export declare const useTags: (start?: string, end?: string) => {
    tags: ComputedRef<TagType[]>;
    tagsWithColor: ComputedRef<TagType[]>;
};

import type { ComputedRef, InjectionKey, Ref } from "vue";
import type { BlogTypeData } from "vuepress-plugin-blog2";
import type { GungnirThemePostInfo } from "../../shared";
export declare type BlogRef = ComputedRef<BlogTypeData<GungnirThemePostInfo>>;
export declare const blogsSymbol: InjectionKey<BlogRef>;
export declare const useBlogPages: () => BlogRef;
export declare const setupBlogPages: () => void;
export declare const useBlog: (pageIndex?: Ref<number>) => {
    posts: ComputedRef<import("vuepress-plugin-blog2").Article<GungnirThemePostInfo>[]>;
    postIndex: ComputedRef<number>;
    post: ComputedRef<import("vuepress-plugin-blog2").Article<GungnirThemePostInfo> | null>;
    slicedPosts: ComputedRef<import("vuepress-plugin-blog2").Article<GungnirThemePostInfo>[]>;
    postListPager: ComputedRef<{
        next?: undefined;
        prev?: undefined;
    } | {
        next: string | null;
        prev: string | null;
    }>;
};

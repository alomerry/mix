import type { GungnirThemePostData } from "../../shared";
export declare const getPostsByYear: (posts: GungnirThemePostData[]) => {
    year: string;
    data: GungnirThemePostData[];
}[];
export declare const filterPostsByTag: (posts: GungnirThemePostData[], tag: string) => GungnirThemePostData[];

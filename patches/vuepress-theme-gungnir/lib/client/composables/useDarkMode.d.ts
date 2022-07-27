import type { InjectionKey, Ref, WritableComputedRef } from "vue";
export declare type CurrentModeRef = WritableComputedRef<string>;
export declare type IsDarkModeRef = Ref<boolean>;
export declare const darkModeSymbol: InjectionKey<{
    currentMode: CurrentModeRef;
    isDarkMode: IsDarkModeRef;
}>;
/**
 * Inject dark mode global computed
 */
export declare const useDarkMode: () => {
    currentMode: CurrentModeRef;
    isDarkMode: IsDarkModeRef;
};
/**
 * Create dark mode ref and provide as global computed in setup
 */
export declare const setupDarkMode: () => void;
export declare const updateHtmlDarkClass: (currentMode: CurrentModeRef, isDarkMode: IsDarkModeRef) => void;

import { usePageData } from "@vuepress/client";
import { computed } from "vue";
import { useThemeLocaleData } from ".";
export const useCatalog = () => {
    const themeLocale = useThemeLocaleData();
    const page = usePageData();
    return computed(() => page.value.frontmatter.layout === "Post" &&
        page.value.frontmatter.catalog !== false &&
        (themeLocale.value.catalog || page.value.frontmatter.catalog) &&
        page.value.headers.length > 0);
};

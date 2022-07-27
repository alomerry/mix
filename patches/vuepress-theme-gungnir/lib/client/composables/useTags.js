import { computed, inject, provide } from "vue";
import { useBlogCategory } from "vuepress-plugin-blog2/lib/client";
import { colorIncrement, toHex, toRGB } from "../utils";
export const tagMapSymbol = Symbol.for("blogTags");
export const useTagMap = () => {
    const tagMap = inject(tagMapSymbol);
    if (!tagMap) {
        throw new Error("useTagMap() is called without provider.");
    }
    return tagMap;
};
export const setupTagMap = () => {
    const tagMap = useBlogCategory("tag");
    provide(tagMapSymbol, tagMap);
};
const tagColor = (start, increment, weighting) => {
    const rgb = toRGB(start).map((value, i) => {
        let ref = Math.round(value + increment[i] * weighting);
        if (ref > 255)
            ref = 255;
        else if (ref < 0)
            ref = 0;
        return ref;
    });
    return toHex(rgb);
};
export const useTags = (start = "#0066ff", end = "#ffb3ff") => {
    const tagMap = useTagMap();
    const tags = computed(() => {
        const tags = [];
        for (const tag in tagMap.value.map) {
            const info = {};
            info.name = tag;
            info.pages = tagMap.value.map[tag].items;
            info.path = tagMap.value.map[tag].path;
            tags.push(info);
        }
        tags.sort((prev, next) => {
            return next.pages.length - prev.pages.length;
        });
        return tags;
    });
    const tagsWithColor = computed(() => {
        if (tags.value.length === 0)
            return [];
        const lowest = tags.value[tags.value.length - 1].pages.length;
        const highest = tags.value[0].pages.length;
        const range = Math.max(highest - lowest, 1);
        const colorIncr = colorIncrement(start, end, range);
        const tagList = tags.value;
        for (const item of tagList) {
            const weighting = item.pages.length - lowest;
            item.tagColor = tagColor(start, colorIncr, weighting);
        }
        return tagList;
    });
    return {
        tags,
        tagsWithColor
    };
};

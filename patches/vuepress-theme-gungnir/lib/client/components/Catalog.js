import { h } from "vue";
import { useRouter } from "vue-router";
export const Catalog = ({ headers, activeLink }) => {
    const router = useRouter();
    return h("ul", {
        class: {
            catalog: true
        }
    }, headers.map((header) => {
        return h("li", {
            class: {
                active: activeLink === header.slug,
                [`level-${header.level}`]: true,
                [`toc-link-${header.slug}`]: true
            },
            key: header.title,
            onClick: () => {
                if (router.currentRoute.value.hash !== `#${header.slug}`) {
                    router.push(`#${header.slug}`);
                }
            }
        }, header.title);
    }));
};
Catalog.displayName = "Catalog";
Catalog.props = {
    headers: {
        type: Object,
        required: true
    },
    activeLink: {
        type: String,
        default: ""
    }
};

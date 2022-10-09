import { resolveDate } from ".";
export const getPostsByYear = (posts, sortByUpdate) => {
    const formatPages = {};
    const formatPagesArr = [];
    for (const post of posts) {
        if (!post.info.date)
            continue;
        // +++
        let date = post.info.date
        if (sortByUpdate && post.info.update) {
            date = post.info.update
        }

        const pageDateYear = resolveDate(date, "year");
        if (formatPages[pageDateYear])
            formatPages[pageDateYear].push(post);
        else
            formatPages[pageDateYear] = [post];
    }
    for (const key in formatPages) {
        formatPagesArr.unshift({
            year: key,
            // +++
            data: formatByType(formatPages[key], sortByUpdate)
        });
    }
    return formatPagesArr;
};
export const filterPostsByTag = (posts, tag) => tag === ""
    ? posts
    : posts.filter((item) => item.info.tags ? item.info.tags.includes(tag) : false);

// +++
const formatByType = (formatPages, sortByUpdate) => {
    if (sortByUpdate) {
        return formatPages.sort(function (a, b) {
            const timeA = getTime(a);
            const timeB = getTime(b);
            if (timeA === -1)
                return 1;
            if (timeB === -1)
                return -1;
            return timeB - timeA;
        })
    }
    return formatPages;
}
const getTime = (page) => {
    const date = page.info.update ? page.info.update : page.info.date;
    return date ? new Date(date).getTime() : -1;
};
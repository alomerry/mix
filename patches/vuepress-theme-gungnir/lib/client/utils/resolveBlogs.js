import { resolveDate } from ".";
export const getPostsByYear = (posts) => {
    const formatPages = {};
    const formatPagesArr = [];
    for (const post of posts) {
        if (!post.info.date)
            continue;
        const pageDateYear = resolveDate(post.info.date, "year");
        if (formatPages[pageDateYear])
            formatPages[pageDateYear].push(post);
        else
            formatPages[pageDateYear] = [post];
    }
    for (const key in formatPages) {
        formatPagesArr.unshift({
            year: key,
            data: formatPages[key]
        });
    }
    return formatPagesArr;
};
export const filterPostsByTag = (posts, tag) => tag === ""
    ? posts
    : posts.filter((item) => item.info.tags ? item.info.tags.includes(tag) : false);

export const formateDateString = (date) => {
    const dateJson = new Date(date).toJSON();
    const dateStr = new Date(+new Date(dateJson) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
    return dateStr.split(" ")[0];
};
export const resolveDate = (date, type) => {
    const dateStr = formateDateString(date).replace(/-/g, "/");
    const dateObj = new Date(dateStr);
    const info = {
        year: dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        day: dateObj.getDate()
    };
    return info[type].toString();
};

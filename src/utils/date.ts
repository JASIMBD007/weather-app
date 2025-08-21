export const deShortFmt = new Intl.DateTimeFormat("de-DE", {
weekday: "short",
day: "2-digit",
month: "2-digit",
});


export const deLongFmt = new Intl.DateTimeFormat("de-DE", {
weekday: "long",
day: "2-digit",
month: "long",
year: "numeric",
});
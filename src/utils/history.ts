export function canManipulateHistory() {
try {
const href = window.location?.href || "";
const origin = (window.location as any)?.origin || "";
const protocol = window.location?.protocol || "";
if (href.startsWith("about:")) return false;
if (protocol === "about:") return false;
if (origin === "null") return false; // e.g., file: URLs
return typeof window.history?.replaceState === "function";
} catch {
return false;
}
}


export function safeReplaceState(newUrl: string) {
try {
if (canManipulateHistory()) {
window.history.replaceState({}, "", newUrl);
}
} catch {
// Ignore SecurityError in sandbox
}
}
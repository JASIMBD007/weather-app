import React from "react";


export function CloudIcon({ className = "" }: { className?: string }) {
return (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
<path d="M6 19a5 5 0 1 1 .9-9.92A7 7 0 1 1 18 19H6z" />
</svg>
);
}


export function SnowIcon({ className = "" }: { className?: string }) {
return (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
<path d="M12 2a1 1 0 0 1 1 1v3.05l2.6-1.5a1 1 0 1 1 1 1.73L14 7.78v2.44l2.6-1.5 1.5-2.6a1 1 0 1 1 1.73 1l-1.5 2.6L20 11a1 1 0 0 1 0 2l-1.67.28 1.5 2.6a1 1 0 1 1-1.73 1l-1.5-2.6L14 14.78v2.44l2.6 1.5a1 1 0 1 1-1 1.73L13 18.95V22a1 1 0 0 1-2 0v-3.05l-2.6 1.5a1 1 0 1 1-1-1.73L10 17.22v-2.44l-2.6 1.5-1.5 2.6a1 1 0 1 1-1.73-1l1.5-2.6L4 13a1 1 0 0 1 0-2l1.67-.28-1.5-2.6a1 1 0 1 1 1.73-1l1.5 2.6L10 9.22V6.78L7.4 5.28a1 1 0 0 1 1-1.73L11 6.05V3a1 1 0 0 1 1-1z" />
</svg>
);
}


export function StormIcon({ className = "" }: { className?: string }) {
return (
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
<path d="M7 13h3l-2 5h2l-1 5 5-7h-3l2-3H9l2-6H9l1-4-4 7h3l-2 3z" />
</svg>
);
}
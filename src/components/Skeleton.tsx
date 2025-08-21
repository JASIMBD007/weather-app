import React from "react";
export default function Skeleton({ height = 200 }: { height?: number }) {
return <div className="w-full rounded-2xl bg-slate-100 animate-pulse" style={{ height }} aria-hidden />;
}
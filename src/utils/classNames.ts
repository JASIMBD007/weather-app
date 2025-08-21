export default function classNames(...s: (string | false | null | undefined)[]) {
return s.filter(Boolean).join(" ");
}
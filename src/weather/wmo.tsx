import { Droplets, Sun } from "lucide-react";
import { CloudIcon, SnowIcon, StormIcon } from "./icons";


// WMO weather code mapping: description + icon component
const wmo: Record<number, { label: string; Icon: React.ComponentType<{ className?: string }>; short: string }>
= {
0: { label: "Klarer Himmel", Icon: Sun, short: "Klar" },
1: { label: "Überwiegend klar", Icon: Sun, short: "Heiter" },
2: { label: "Teilweise bewölkt", Icon: Sun, short: "Wolkig" },
3: { label: "Bewölkt", Icon: CloudIcon, short: "Bewölkt" },
45: { label: "Nebel", Icon: CloudIcon, short: "Nebel" },
48: { label: "Reifnebel", Icon: CloudIcon, short: "Nebel" },
51: { label: "Feiner Nieselregen", Icon: Droplets, short: "Niesel" },
53: { label: "Mäßiger Nieselregen", Icon: Droplets, short: "Niesel" },
55: { label: "Starker Nieselregen", Icon: Droplets, short: "Niesel" },
61: { label: "Leichter Regen", Icon: Droplets, short: "Regen" },
63: { label: "Mäßiger Regen", Icon: Droplets, short: "Regen" },
65: { label: "Starker Regen", Icon: Droplets, short: "Regen" },
66: { label: "Gefrierender Regen (leicht)", Icon: Droplets, short: "Eisregen" },
67: { label: "Gefrierender Regen (stark)", Icon: Droplets, short: "Eisregen" },
71: { label: "Leichter Schneefall", Icon: SnowIcon, short: "Schnee" },
73: { label: "Mäßiger Schneefall", Icon: SnowIcon, short: "Schnee" },
75: { label: "Starker Schneefall", Icon: SnowIcon, short: "Schnee" },
77: { label: "Schneekörner", Icon: SnowIcon, short: "Schnee" },
80: { label: "Leichte Regenschauer", Icon: Droplets, short: "Schauer" },
81: { label: "Mäßige Regenschauer", Icon: Droplets, short: "Schauer" },
82: { label: "Heftige Regenschauer", Icon: Droplets, short: "Schauer" },
85: { label: "Leichte Schneeschauer", Icon: SnowIcon, short: "Schauer" },
86: { label: "Heftige Schneeschauer", Icon: SnowIcon, short: "Schauer" },
95: { label: "Gewitter", Icon: StormIcon, short: "Gewitter" },
96: { label: "Gewitter (leichter Hagel)", Icon: StormIcon, short: "Gewitter" },
99: { label: "Gewitter (starker Hagel)", Icon: StormIcon, short: "Gewitter" },
};


export default wmo;
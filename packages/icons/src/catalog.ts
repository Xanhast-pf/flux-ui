// GENERATED FILE. Run `pnpm generate`; do not edit manually.
import type { ComponentType } from "react";
import type { IconProps } from "./IconBase.js";
import { ArrowDownIcon } from "./icons/ArrowDownIcon.js";
import { ArrowLeftIcon } from "./icons/ArrowLeftIcon.js";
import { ArrowRightIcon } from "./icons/ArrowRightIcon.js";
import { ArrowUpIcon } from "./icons/ArrowUpIcon.js";
import { ArrowUpRightIcon } from "./icons/ArrowUpRightIcon.js";
import { ChevronDownIcon } from "./icons/ChevronDownIcon.js";
import { ChevronLeftIcon } from "./icons/ChevronLeftIcon.js";
import { ChevronRightIcon } from "./icons/ChevronRightIcon.js";
import { ChevronUpIcon } from "./icons/ChevronUpIcon.js";
import { MenuIcon } from "./icons/MenuIcon.js";
import { CloseIcon } from "./icons/CloseIcon.js";
import { CheckIcon } from "./icons/CheckIcon.js";
import { PlusIcon } from "./icons/PlusIcon.js";
import { CopyIcon } from "./icons/CopyIcon.js";
import { RefreshIcon } from "./icons/RefreshIcon.js";
import { SearchIcon } from "./icons/SearchIcon.js";
import { CommandIcon } from "./icons/CommandIcon.js";
import { SparkIcon } from "./icons/SparkIcon.js";
import { StarIcon } from "./icons/StarIcon.js";
import { InfoIcon } from "./icons/InfoIcon.js";
import { WarningIcon } from "./icons/WarningIcon.js";
import { ShieldCheckIcon } from "./icons/ShieldCheckIcon.js";
import { SunIcon } from "./icons/SunIcon.js";
import { MoonIcon } from "./icons/MoonIcon.js";
import { PaletteIcon } from "./icons/PaletteIcon.js";
import { GridIcon } from "./icons/GridIcon.js";
import { ListIcon } from "./icons/ListIcon.js";
import { LayersIcon } from "./icons/LayersIcon.js";
import { GaugeIcon } from "./icons/GaugeIcon.js";
import { PackageIcon } from "./icons/PackageIcon.js";
import { TerminalIcon } from "./icons/TerminalIcon.js";
import { CodeIcon } from "./icons/CodeIcon.js";
import { BranchIcon } from "./icons/BranchIcon.js";
import { FluxMarkIcon } from "./icons/FluxMarkIcon.js";
import { MinusIcon } from "./icons/MinusIcon.js";
import { EditIcon } from "./icons/EditIcon.js";
import { TrashIcon } from "./icons/TrashIcon.js";
import { DownloadIcon } from "./icons/DownloadIcon.js";
import { UploadIcon } from "./icons/UploadIcon.js";
import { FilterIcon } from "./icons/FilterIcon.js";
import { SlidersIcon } from "./icons/SlidersIcon.js";
import { MoreHorizontalIcon } from "./icons/MoreHorizontalIcon.js";
import { MoreVerticalIcon } from "./icons/MoreVerticalIcon.js";
import { EyeIcon } from "./icons/EyeIcon.js";
import { EyeOffIcon } from "./icons/EyeOffIcon.js";
import { HomeIcon } from "./icons/HomeIcon.js";
import { ExpandIcon } from "./icons/ExpandIcon.js";
import { ShrinkIcon } from "./icons/ShrinkIcon.js";
import { CircleCheckIcon } from "./icons/CircleCheckIcon.js";
import { CircleXIcon } from "./icons/CircleXIcon.js";
import { CircleHelpIcon } from "./icons/CircleHelpIcon.js";
import { ClockIcon } from "./icons/ClockIcon.js";
import { BellIcon } from "./icons/BellIcon.js";
import { BellOffIcon } from "./icons/BellOffIcon.js";
import { LockIcon } from "./icons/LockIcon.js";
import { UnlockIcon } from "./icons/UnlockIcon.js";
import { FileIcon } from "./icons/FileIcon.js";
import { FolderIcon } from "./icons/FolderIcon.js";
import { LinkIcon } from "./icons/LinkIcon.js";
import { CalendarIcon } from "./icons/CalendarIcon.js";
import { MailIcon } from "./icons/MailIcon.js";
import { UserIcon } from "./icons/UserIcon.js";
import { UsersIcon } from "./icons/UsersIcon.js";
import { DatabaseIcon } from "./icons/DatabaseIcon.js";

export type IconCategory = "actions" | "brand" | "communication" | "content" | "developer" | "layout" | "navigation" | "status" | "theme";

export interface IconCatalogEntry {
  name: string;
  category: IconCategory;
  keywords: readonly string[];
  component: ComponentType<IconProps>;
}

export const iconCatalog: readonly IconCatalogEntry[] = [
  {
    name: "ArrowDownIcon",
    category: "navigation",
    keywords: ["down","south","move","direction","scroll"],
    component: ArrowDownIcon,
  },
  {
    name: "ArrowLeftIcon",
    category: "navigation",
    keywords: ["left","west","back","previous","direction"],
    component: ArrowLeftIcon,
  },
  {
    name: "ArrowRightIcon",
    category: "navigation",
    keywords: ["right","east","forward","next","direction"],
    component: ArrowRightIcon,
  },
  {
    name: "ArrowUpIcon",
    category: "navigation",
    keywords: ["up","north","move","direction","scroll"],
    component: ArrowUpIcon,
  },
  {
    name: "ArrowUpRightIcon",
    category: "navigation",
    keywords: ["external","open","new window","diagonal","northeast"],
    component: ArrowUpRightIcon,
  },
  {
    name: "ChevronDownIcon",
    category: "navigation",
    keywords: ["down","expand","disclosure","select"],
    component: ChevronDownIcon,
  },
  {
    name: "ChevronLeftIcon",
    category: "navigation",
    keywords: ["left","previous","back","pagination"],
    component: ChevronLeftIcon,
  },
  {
    name: "ChevronRightIcon",
    category: "navigation",
    keywords: ["right","next","forward","pagination"],
    component: ChevronRightIcon,
  },
  {
    name: "ChevronUpIcon",
    category: "navigation",
    keywords: ["up","collapse","disclosure"],
    component: ChevronUpIcon,
  },
  {
    name: "MenuIcon",
    category: "navigation",
    keywords: ["navigation","hamburger","drawer","sidebar"],
    component: MenuIcon,
  },
  {
    name: "CloseIcon",
    category: "actions",
    keywords: ["x","dismiss","cancel","remove"],
    component: CloseIcon,
  },
  {
    name: "CheckIcon",
    category: "status",
    keywords: ["done","success","confirm","selected"],
    component: CheckIcon,
  },
  {
    name: "PlusIcon",
    category: "actions",
    keywords: ["add","new","create","positive"],
    component: PlusIcon,
  },
  {
    name: "CopyIcon",
    category: "actions",
    keywords: ["duplicate","clipboard","clone"],
    component: CopyIcon,
  },
  {
    name: "RefreshIcon",
    category: "actions",
    keywords: ["reload","sync","retry","restart"],
    component: RefreshIcon,
  },
  {
    name: "SearchIcon",
    category: "actions",
    keywords: ["find","filter","magnifier","lookup"],
    component: SearchIcon,
  },
  {
    name: "CommandIcon",
    category: "actions",
    keywords: ["keyboard","shortcut","cmd","meta"],
    component: CommandIcon,
  },
  {
    name: "SparkIcon",
    category: "status",
    keywords: ["new","magic","feature","highlight"],
    component: SparkIcon,
  },
  {
    name: "StarIcon",
    category: "status",
    keywords: ["favorite","rating","save","featured"],
    component: StarIcon,
  },
  {
    name: "InfoIcon",
    category: "status",
    keywords: ["information","help","notice","details"],
    component: InfoIcon,
  },
  {
    name: "WarningIcon",
    category: "status",
    keywords: ["alert","caution","danger","attention"],
    component: WarningIcon,
  },
  {
    name: "ShieldCheckIcon",
    category: "status",
    keywords: ["secure","verified","protected","success"],
    component: ShieldCheckIcon,
  },
  {
    name: "SunIcon",
    category: "theme",
    keywords: ["light","theme","day","brightness"],
    component: SunIcon,
  },
  {
    name: "MoonIcon",
    category: "theme",
    keywords: ["dark","theme","night"],
    component: MoonIcon,
  },
  {
    name: "PaletteIcon",
    category: "theme",
    keywords: ["theme","color","appearance","design"],
    component: PaletteIcon,
  },
  {
    name: "GridIcon",
    category: "layout",
    keywords: ["layout","tiles","gallery","apps"],
    component: GridIcon,
  },
  {
    name: "ListIcon",
    category: "layout",
    keywords: ["layout","rows","menu","items"],
    component: ListIcon,
  },
  {
    name: "LayersIcon",
    category: "layout",
    keywords: ["stack","layout","depth","collection"],
    component: LayersIcon,
  },
  {
    name: "GaugeIcon",
    category: "layout",
    keywords: ["performance","speed","metric","dashboard"],
    component: GaugeIcon,
  },
  {
    name: "PackageIcon",
    category: "developer",
    keywords: ["npm","module","dependency","bundle"],
    component: PackageIcon,
  },
  {
    name: "TerminalIcon",
    category: "developer",
    keywords: ["cli","shell","console","command line"],
    component: TerminalIcon,
  },
  {
    name: "CodeIcon",
    category: "developer",
    keywords: ["source","developer","markup","brackets"],
    component: CodeIcon,
  },
  {
    name: "BranchIcon",
    category: "developer",
    keywords: ["git","version control","fork","source control"],
    component: BranchIcon,
  },
  {
    name: "FluxMarkIcon",
    category: "brand",
    keywords: ["brand","logo","flux","identity","flow","forward","monogram","ribbon","f"],
    component: FluxMarkIcon,
  },
  {
    name: "MinusIcon",
    category: "actions",
    keywords: ["remove","subtract","collapse","negative"],
    component: MinusIcon,
  },
  {
    name: "EditIcon",
    category: "actions",
    keywords: ["pencil","write","rename","modify"],
    component: EditIcon,
  },
  {
    name: "TrashIcon",
    category: "actions",
    keywords: ["delete","remove","bin","discard"],
    component: TrashIcon,
  },
  {
    name: "DownloadIcon",
    category: "actions",
    keywords: ["save","export","arrow down","receive"],
    component: DownloadIcon,
  },
  {
    name: "UploadIcon",
    category: "actions",
    keywords: ["import","publish","arrow up","send"],
    component: UploadIcon,
  },
  {
    name: "FilterIcon",
    category: "actions",
    keywords: ["funnel","refine","query","search"],
    component: FilterIcon,
  },
  {
    name: "SlidersIcon",
    category: "actions",
    keywords: ["settings","controls","adjust","preferences"],
    component: SlidersIcon,
  },
  {
    name: "MoreHorizontalIcon",
    category: "actions",
    keywords: ["ellipsis","more","options","menu"],
    component: MoreHorizontalIcon,
  },
  {
    name: "MoreVerticalIcon",
    category: "actions",
    keywords: ["ellipsis","more","options","kebab"],
    component: MoreVerticalIcon,
  },
  {
    name: "EyeIcon",
    category: "actions",
    keywords: ["view","show","visible","preview"],
    component: EyeIcon,
  },
  {
    name: "EyeOffIcon",
    category: "actions",
    keywords: ["hide","hidden","visibility","private"],
    component: EyeOffIcon,
  },
  {
    name: "HomeIcon",
    category: "navigation",
    keywords: ["house","start","root","overview"],
    component: HomeIcon,
  },
  {
    name: "ExpandIcon",
    category: "navigation",
    keywords: ["fullscreen","maximize","grow","open"],
    component: ExpandIcon,
  },
  {
    name: "ShrinkIcon",
    category: "navigation",
    keywords: ["minimize","collapse","contract","inset"],
    component: ShrinkIcon,
  },
  {
    name: "CircleCheckIcon",
    category: "status",
    keywords: ["success","complete","valid","approved"],
    component: CircleCheckIcon,
  },
  {
    name: "CircleXIcon",
    category: "status",
    keywords: ["error","failed","invalid","cancel"],
    component: CircleXIcon,
  },
  {
    name: "CircleHelpIcon",
    category: "status",
    keywords: ["help","question","support","unknown"],
    component: CircleHelpIcon,
  },
  {
    name: "ClockIcon",
    category: "status",
    keywords: ["time","history","schedule","recent"],
    component: ClockIcon,
  },
  {
    name: "BellIcon",
    category: "status",
    keywords: ["notification","alert","reminder","subscribe"],
    component: BellIcon,
  },
  {
    name: "BellOffIcon",
    category: "status",
    keywords: ["notifications off","mute","silent","unsubscribe"],
    component: BellOffIcon,
  },
  {
    name: "LockIcon",
    category: "status",
    keywords: ["secure","private","locked","permission"],
    component: LockIcon,
  },
  {
    name: "UnlockIcon",
    category: "status",
    keywords: ["open","public","unlocked","permission"],
    component: UnlockIcon,
  },
  {
    name: "FileIcon",
    category: "content",
    keywords: ["document","page","source","attachment"],
    component: FileIcon,
  },
  {
    name: "FolderIcon",
    category: "content",
    keywords: ["directory","files","project","open"],
    component: FolderIcon,
  },
  {
    name: "LinkIcon",
    category: "content",
    keywords: ["url","chain","hyperlink","attach"],
    component: LinkIcon,
  },
  {
    name: "CalendarIcon",
    category: "content",
    keywords: ["date","schedule","event","month"],
    component: CalendarIcon,
  },
  {
    name: "MailIcon",
    category: "communication",
    keywords: ["email","message","inbox","envelope"],
    component: MailIcon,
  },
  {
    name: "UserIcon",
    category: "communication",
    keywords: ["person","profile","account","member"],
    component: UserIcon,
  },
  {
    name: "UsersIcon",
    category: "communication",
    keywords: ["people","team","group","members"],
    component: UsersIcon,
  },
  {
    name: "DatabaseIcon",
    category: "developer",
    keywords: ["data","storage","sql","server"],
    component: DatabaseIcon,
  },
];

// GENERATED FILE. Run `pnpm flux maintain generate`; do not edit manually.
export const components = [
  {
    name: "Accordion",
    slug: "accordion",
    category: "Disclosure",
    status: "stable",
    stableSince: "0.2.0",
    description: "Grouped native disclosures with automatic exclusive naming.",
    sizeClass: "primitive",
    publicDataAttributes: {
      "Accordion.Root": ["data-type"],
    },
  },
  {
    name: "AlertDialog",
    slug: "alert-dialog",
    category: "Overlays",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Destructive confirmations using the existing native modal foundation; backdrop clicks do not confirm or dismiss.",
    sizeClass: "overlay",
    nonDomParts: ["AlertDialog.Root"],
    publicDataAttributes: {
      "AlertDialog.Trigger": ["data-state"],
      "AlertDialog.Popup": ["data-state"],
    },
  },
  {
    name: "AspectRatio",
    slug: "aspect-ratio",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "A responsive CSS aspect-ratio frame with no measurement code.",
    sizeClass: "primitive",
  },
  {
    name: "Avatar",
    slug: "avatar",
    category: "Data display",
    status: "stable",
    stableSince: "0.2.0",
    description: "Identity images with a named, resilient fallback.",
    sizeClass: "primitive",
  },
  {
    name: "BottomNavigation",
    slug: "bottom-navigation",
    category: "Navigation",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Semantic destination navigation for compact application shells using real links.",
    sizeClass: "primitive",
  },
  {
    name: "Box",
    slug: "box",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description: "Single-element semantic spacing and surface primitive.",
    sizeClass: "primitive",
  },
  {
    name: "Breadcrumbs",
    slug: "breadcrumbs",
    category: "Navigation",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Semantic navigation trails with decorative separators and optional long-trail disclosure.",
    sizeClass: "primitive",
  },
  {
    name: "Button",
    slug: "button",
    category: "Actions",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Triggers an immediate action with predictable states and native button semantics.",
    sizeClass: "interactive",
    publicDataAttributes: {
      Button: ["data-loading"],
    },
  },
  {
    name: "ButtonGroup",
    slug: "button-group",
    category: "Actions",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Semantic attached-edge grouping for buttons without duplicating Button appearance or selection state.",
    sizeClass: "primitive",
    publicDataAttributes: {
      ButtonGroup: ["data-orientation"],
    },
  },
  {
    name: "Callout",
    slug: "callout",
    category: "Feedback",
    status: "stable",
    stableSince: "0.2.0",
    description: "Informational notes with optional status or alert semantics.",
    sizeClass: "primitive",
  },
  {
    name: "Card",
    slug: "card",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description: "A token-styled surface for composable application content.",
    sizeClass: "primitive",
  },
  {
    name: "Chart",
    slug: "chart",
    category: "Data",
    status: "beta",
    description:
      "Standalone line, area and grouped bar visualization with bounded rendering and source-complete keyboard/pointer inspection.",
    sizeClass: "data-heavy",
    publicDescendantDataAttributes: {
      series: {
        selector: "[data-muted]",
        dataAttributes: ["data-muted"],
      },
    },
  },
  {
    name: "ChartLegend",
    slug: "chart-legend",
    category: "Data",
    status: "beta",
    description:
      "Optional HTML legend wrapper for Flux charts with independent layout and controlled or uncontrolled series visibility.",
    sizeClass: "interactive",
    publicDescendantDataAttributes: {
      hiddenItem: {
        selector: "[data-hidden]",
        dataAttributes: ["data-hidden"],
      },
    },
  },
  {
    name: "ChartTooltip",
    slug: "chart-tooltip",
    category: "Data",
    status: "beta",
    description:
      "Optional pointer-inert visual data tooltip wrapper for Flux charts with hover or click triggers.",
    sizeClass: "interactive",
    publicDescendantDataAttributes: {
      popup: {
        selector: "[data-align]",
        dataAttributes: ["data-align", "data-side"],
      },
    },
  },
  {
    name: "Checkbox",
    slug: "checkbox",
    category: "Inputs",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Native checkbox with controlled mixed presentation, form semantics, and Field composition.",
    sizeClass: "primitive",
    publicDataAttributes: {
      Checkbox: ["data-invalid"],
    },
  },
  {
    name: "Code",
    slug: "code",
    category: "Typography",
    status: "stable",
    stableSince: "0.2.0",
    description: "Literal inline code with shared monospace styling.",
    sizeClass: "primitive",
  },
  {
    name: "CodeBlock",
    slug: "code-block",
    category: "Typography",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Literal code, optional copy action and accessible clipboard feedback.",
    sizeClass: "composite",
    publicUtilities: ["codeLanguages", "tokenizeCode"],
  },
  {
    name: "Collapsible",
    slug: "collapsible",
    category: "Disclosure",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Native details and summary disclosure with no custom keyboard engine.",
    sizeClass: "primitive",
  },
  {
    name: "ColorSwatch",
    slug: "color-swatch",
    category: "Display",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Decorative color sample for composition inside named selection controls.",
    sizeClass: "primitive",
    publicDataAttributes: {
      ColorSwatch: ["data-selected"],
    },
  },
  {
    name: "Combobox",
    slug: "combobox",
    category: "Inputs",
    status: "beta",
    description:
      "Searchable single selection with grouped options, controllable query state, loading status, forms and keyboard navigation.",
    sizeClass: "overlay",
    publicDataAttributes: {
      Combobox: ["data-invalid"],
    },
    publicDescendantDataAttributes: {
      popup: {
        selector: "[data-state]",
        dataAttributes: ["data-state"],
      },
    },
  },
  {
    name: "Container",
    slug: "container",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Centered page-width primitive with consistent responsive gutters.",
    sizeClass: "primitive",
    publicDataAttributes: {
      Container: ["data-query"],
    },
  },
  {
    name: "DataGrid",
    slug: "data-grid",
    category: "Data",
    status: "beta",
    description:
      "Interactive ARIA grid with stable cell focus, client transforms, row selection, column visibility, and app-owned inline cell editing.",
    sizeClass: "data-heavy",
    publicDescendantDataAttributes: {
      cell: {
        selector: '[role="gridcell"]',
        dataAttributes: ["data-editable", "data-editing"],
      },
      row: {
        selector: '[role="row"]',
        dataAttributes: ["data-selected"],
      },
    },
  },
  {
    name: "DataTable",
    slug: "data-table",
    category: "Data",
    status: "beta",
    description:
      "Windowed, fixed-row-height native table; not an editable spreadsheet or ARIA grid.",
    sizeClass: "data-heavy",
  },
  {
    name: "DatePicker",
    slug: "date-picker",
    category: "Forms",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Native civil date input with stable ISO serialization and browser-owned validation.",
    sizeClass: "primitive",
    publicDataAttributes: {
      DatePicker: ["data-invalid"],
    },
  },
  {
    name: "DateTimePicker",
    slug: "date-time-picker",
    category: "Forms",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Native local date-time input that deliberately carries no timezone or instant semantics.",
    sizeClass: "primitive",
    publicDataAttributes: {
      DateTimePicker: ["data-invalid"],
    },
  },
  {
    name: "DescriptionList",
    slug: "description-list",
    category: "Typography",
    status: "stable",
    stableSince: "0.2.0",
    description: "Semantic term/detail pairs with shared layout.",
    sizeClass: "primitive",
  },
  {
    name: "Dialog",
    slug: "dialog",
    category: "Overlays",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Modal dialog composition built on the native top layer with automatic labeling and predictable dismissal.",
    sizeClass: "overlay",
    nonDomParts: ["Dialog.Root"],
    publicDataAttributes: {
      "Dialog.Trigger": ["data-state"],
      "Dialog.Popup": ["data-state"],
    },
  },
  {
    name: "Drawer",
    slug: "drawer",
    category: "Overlays",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Edge-aligned modal panel for navigation and secondary workflows with native dialog semantics.",
    sizeClass: "overlay",
    nonDomParts: ["Drawer.Root"],
    publicDataAttributes: {
      "Drawer.Trigger": ["data-state"],
      "Drawer.Popup": ["data-side", "data-state"],
    },
  },
  {
    name: "DropdownMenu",
    slug: "dropdown-menu",
    category: "Overlays",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Flat action menus with roving focus, typeahead, unavailable-item handling and native dismissal.",
    sizeClass: "overlay",
    nonDomParts: ["DropdownMenu.Root"],
    publicDataAttributes: {
      "DropdownMenu.Popup": ["data-align", "data-side", "data-state"],
    },
  },
  {
    name: "EmptyState",
    slug: "empty-state",
    category: "Feedback",
    status: "stable",
    stableSince: "0.2.0",
    description: "Quiet no-results content with no implied alert behavior.",
    sizeClass: "composite",
  },
  {
    name: "Field",
    slug: "field",
    category: "Inputs",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Accessible form-field composition that wires labels, descriptions, errors, and shared control state.",
    sizeClass: "primitive",
    nonDomParts: ["Field.Control"],
    publicDataAttributes: {
      "Field.Root": ["data-disabled", "data-invalid"],
    },
  },
  {
    name: "Fieldset",
    slug: "fieldset",
    category: "Forms",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Native grouped controls and legend; browser-owned group disabling.",
    sizeClass: "primitive",
  },
  {
    name: "Footer",
    slug: "footer",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Semantic page footer that settles at the bottom of flex-column layouts.",
    sizeClass: "primitive",
  },
  {
    name: "Grid",
    slug: "grid",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Native CSS Grid layout with responsive tracks, auto-fit sizing, placement, and subgrid support.",
    sizeClass: "interactive",
  },
  {
    name: "Heading",
    slug: "heading",
    category: "Typography",
    status: "stable",
    stableSince: "0.2.0",
    description: "Explicit heading hierarchy with independent visual size.",
    sizeClass: "primitive",
  },
  {
    name: "IconButton",
    slug: "icon-button",
    category: "Actions",
    status: "stable",
    stableSince: "0.2.0",
    description: "Compact icon actions with a required accessible name.",
    sizeClass: "primitive",
    publicDataAttributes: {
      IconButton: ["data-loading"],
    },
  },
  {
    name: "Indicator",
    slug: "indicator",
    category: "Feedback",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Decorative count or dot overlay whose meaningful state stays in the owning control's accessible name.",
    sizeClass: "primitive",
  },
  {
    name: "Inline",
    slug: "inline",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Token-driven horizontal layout for toolbars, actions, and inline groups.",
    sizeClass: "primitive",
  },
  {
    name: "Input",
    slug: "input",
    category: "Inputs",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Styled native text-entry control that preserves browser semantics, attributes, and refs.",
    sizeClass: "primitive",
    publicDataAttributes: {
      Input: ["data-invalid"],
    },
  },
  {
    name: "InputGroup",
    slug: "input-group",
    category: "Inputs",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Input composition for prefixes, suffixes and actions without replacing the native input contract.",
    sizeClass: "primitive",
    publicDataAttributes: {
      "InputGroup.Input": ["data-invalid"],
    },
  },
  {
    name: "Kbd",
    slug: "kbd",
    category: "Typography",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Semantic keyboard hints, styled without adding shortcut behavior.",
    sizeClass: "primitive",
  },
  {
    name: "Knob",
    slug: "knob",
    category: "Audio",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "A labelled single-value slider with linear or positive logarithmic mapping.",
    sizeClass: "interactive",
  },
  {
    name: "LevelMeter",
    slug: "level-meter",
    category: "Audio",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "A passive labelled meter, not a slider. The application owns updates, peak hold and clip reset.",
    sizeClass: "primitive",
    publicDataAttributes: {
      LevelMeter: ["data-orientation"],
    },
  },
  {
    name: "Link",
    slug: "link",
    category: "Navigation",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Native navigation with text, navigation and action treatments.",
    sizeClass: "primitive",
  },
  {
    name: "List",
    slug: "list",
    category: "Typography",
    status: "stable",
    stableSince: "0.2.0",
    description: "Styled native content lists, not an ARIA menu.",
    sizeClass: "primitive",
  },
  {
    name: "Meter",
    slug: "meter",
    category: "Feedback",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Native bounded measurement; unknown data is never presented as zero.",
    sizeClass: "primitive",
  },
  {
    name: "NumberField",
    slug: "number-field",
    category: "Forms",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "A native number input: form participation, min/max validity and steppers stay with the platform.",
    sizeClass: "primitive",
    publicDataAttributes: {
      NumberField: ["data-invalid"],
    },
  },
  {
    name: "PageHeader",
    slug: "page-header",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description: "A public recipe for consistent page introductions.",
    sizeClass: "composite",
  },
  {
    name: "Pagination",
    slug: "pagination",
    category: "Navigation",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Controlled paging controls with native buttons, first/last affordances, and bounded generated ranges.",
    sizeClass: "primitive",
    nonDomParts: ["Pagination.Range"],
  },
  {
    name: "PieChart",
    slug: "pie-chart",
    category: "Data",
    status: "beta",
    description:
      "Standalone bounded pie visualization with keyboard/pointer slice inspection and composable legend/tooltip accessories.",
    sizeClass: "data-heavy",
    publicDescendantDataAttributes: {
      slice: {
        selector: "[data-active]",
        dataAttributes: ["data-active"],
      },
    },
  },
  {
    name: "Popover",
    slug: "popover",
    category: "Overlays",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Non-modal anchored content with native top-layer dismissal and scoped themes.",
    sizeClass: "overlay",
    nonDomParts: ["Popover.Root"],
    publicDataAttributes: {
      "Popover.Popup": ["data-align", "data-side", "data-state"],
    },
  },
  {
    name: "Progress",
    slug: "progress",
    category: "Feedback",
    status: "stable",
    stableSince: "0.2.0",
    description: "Native determinate and indeterminate progress.",
    sizeClass: "primitive",
  },
  {
    name: "RadioGroup",
    slug: "radio-group",
    category: "Inputs",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Native radio group with fieldset semantics, controlled or uncontrolled selection, and Field-compatible options.",
    sizeClass: "primitive",
    publicDataAttributes: {
      "RadioGroup.Root": ["data-invalid"],
      "RadioGroup.Item": ["data-invalid"],
    },
  },
  {
    name: "Rating",
    slug: "rating",
    category: "Inputs",
    status: "beta",
    description:
      "Form-capable rating with native radio semantics, half-star precision and read-only presentation.",
    sizeClass: "primitive",
    publicDataAttributes: {
      Rating: ["data-readonly"],
    },
  },
  {
    name: "ScatterChart",
    slug: "scatter-chart",
    category: "Data",
    status: "beta",
    description:
      "Standalone bounded scatter visualization with axes, source-complete inspection and sampled SVG paths.",
    sizeClass: "data-heavy",
    publicDescendantDataAttributes: {
      series: {
        selector: "[data-muted]",
        dataAttributes: ["data-muted"],
      },
    },
  },
  {
    name: "ScrollArea",
    slug: "scroll-area",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Named native overflow region with overflow-aware keyboard focus.",
    sizeClass: "primitive",
    publicDataAttributes: {
      ScrollArea: ["data-axis"],
    },
  },
  {
    name: "Select",
    slug: "select",
    category: "Inputs",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Native select, option and optgroup behavior with Flux styling.",
    sizeClass: "primitive",
    publicDataAttributes: {
      Select: ["data-invalid"],
    },
  },
  {
    name: "Separator",
    slug: "separator",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description: "Semantic or decorative dividers in either orientation.",
    sizeClass: "primitive",
    publicDataAttributes: {
      Separator: ["data-orientation"],
    },
  },
  {
    name: "Sidebar",
    slug: "sidebar",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Persistent, non-modal side navigation that shares layout with the content.",
    sizeClass: "interactive",
    nonDomParts: ["Sidebar.Root"],
  },
  {
    name: "Skeleton",
    slug: "skeleton",
    category: "Feedback",
    status: "stable",
    stableSince: "0.2.0",
    description: "Static decorative placeholders for loading layouts.",
    sizeClass: "primitive",
  },
  {
    name: "SkipLink",
    slug: "skip-link",
    category: "Navigation",
    status: "stable",
    stableSince: "0.2.0",
    description: "Focus-revealed native skip navigation.",
    sizeClass: "primitive",
  },
  {
    name: "Slider",
    slug: "slider",
    category: "Inputs",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Single-thumb native range input with form semantics, optional datalist marks, and visual value output.",
    sizeClass: "primitive",
    publicDataAttributes: {
      Slider: ["data-appearance", "data-orientation"],
    },
  },
  {
    name: "Sparkline",
    slug: "sparkline",
    category: "Data",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Decorative trend rendering is not a replacement for data access. Supply a meaningful accessible label or an equivalent nearby summary.",
    sizeClass: "primitive",
  },
  {
    name: "Spinner",
    slug: "spinner",
    category: "Feedback",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "An accessible loading status with reduced-motion-safe presentation.",
    sizeClass: "primitive",
  },
  {
    name: "SplitPane",
    slug: "split-pane",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "An in-flow two-pane layout, separate from Sidebar and Drawer.",
    sizeClass: "interactive",
    publicDataAttributes: {
      SplitPane: ["data-orientation"],
    },
  },
  {
    name: "Stack",
    slug: "stack",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description: "Token-driven vertical layout with responsive spacing.",
    sizeClass: "primitive",
  },
  {
    name: "Stat",
    slug: "stat",
    category: "Display",
    status: "stable",
    stableSince: "0.2.0",
    description: "A semantic label, value and supporting-note recipe.",
    sizeClass: "composite",
  },
  {
    name: "StatusBadge",
    slug: "status-badge",
    category: "Display",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Compact, standalone status labels with semantic tones; not an overlay counter.",
    sizeClass: "primitive",
  },
  {
    name: "Stepper",
    slug: "stepper",
    category: "Navigation",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Ordered workflow progress with current, completed and error semantics.",
    sizeClass: "primitive",
    publicDataAttributes: {
      "Stepper.Item": ["data-status"],
      "Stepper.Root": ["data-orientation"],
    },
  },
  {
    name: "Switch",
    slug: "switch",
    category: "Inputs",
    status: "stable",
    stableSince: "0.2.0",
    description: "Native checkbox form behavior with binary switch semantics.",
    sizeClass: "primitive",
    publicDataAttributes: {
      Switch: ["data-invalid"],
    },
  },
  {
    name: "Table",
    slug: "table",
    category: "Data",
    status: "stable",
    stableSince: "0.2.0",
    description: "Composable semantic tables without a data-grid runtime.",
    sizeClass: "primitive",
  },
  {
    name: "Tabs",
    slug: "tabs",
    category: "Navigation",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Responsive tabbed navigation with automatic overflow menus and keyboard-accessible panels.",
    sizeClass: "composite",
  },
  {
    name: "Tag",
    slug: "tag",
    category: "Data display",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Compact labels with an explicitly named optional removal action.",
    sizeClass: "primitive",
  },
  {
    name: "Text",
    slug: "text",
    category: "Typography",
    status: "stable",
    stableSince: "0.2.0",
    description: "Tokenized text roles independent from native semantics.",
    sizeClass: "primitive",
  },
  {
    name: "Textarea",
    slug: "textarea",
    category: "Inputs",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Native multi-line text control with optional CSS-native content autosizing and row constraints.",
    sizeClass: "primitive",
    publicDataAttributes: {
      Textarea: ["data-auto-size", "data-invalid"],
    },
  },
  {
    name: "ThemeScope",
    slug: "theme-scope",
    category: "Layout",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Scoped semantic theme application with optional container queries.",
    sizeClass: "primitive",
    publicDataAttributes: {
      ThemeScope: ["data-query"],
    },
  },
  {
    name: "TimePicker",
    slug: "time-picker",
    category: "Forms",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Native civil time input with browser-owned validation and no timezone semantics.",
    sizeClass: "primitive",
    publicDataAttributes: {
      TimePicker: ["data-invalid"],
    },
  },
  {
    name: "Toast",
    slug: "toast",
    category: "Feedback",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Scoped notification queues with paused dismissal timers and optional actions.",
    sizeClass: "interactive",
    nonDomParts: ["Toast.Provider"],
    publicUtilities: ["useToast"],
  },
  {
    name: "Toggle",
    slug: "toggle",
    category: "Actions",
    status: "stable",
    stableSince: "0.2.0",
    description: "A native pressed-state button for reversible actions.",
    sizeClass: "primitive",
  },
  {
    name: "ToggleGroup",
    slug: "toggle-group",
    category: "Actions",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Single or multiple toggle selection with scoped roving focus.",
    sizeClass: "interactive",
  },
  {
    name: "Toolbar",
    slug: "toolbar",
    category: "Actions",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Named action groups with one tab stop and arrow-key navigation.",
    sizeClass: "interactive",
    publicDataAttributes: {
      "Toolbar.Root": ["data-orientation"],
      "Toolbar.Separator": ["data-orientation"],
    },
  },
  {
    name: "Tooltip",
    slug: "tooltip",
    category: "Overlays",
    status: "stable",
    stableSince: "0.2.0",
    description:
      "Controlled or trigger-owned supplemental help with optional collision-aware decorative arrows.",
    sizeClass: "interactive",
    publicDataAttributes: {
      Tooltip: ["data-align", "data-side", "data-state"],
    },
  },
  {
    name: "TreeView",
    slug: "tree-view",
    category: "Navigation",
    status: "beta",
    description:
      "Hierarchical navigation with expansion state and WAI-ARIA tree keyboard behavior.",
    sizeClass: "interactive",
    publicDataAttributes: {
      "TreeView.Item": ["data-expandable", "data-expanded"],
    },
  },
  {
    name: "VisuallyHidden",
    slug: "visually-hidden",
    category: "Accessibility",
    status: "stable",
    stableSince: "0.2.0",
    description: "Screen-reader text without an extra visual box.",
    sizeClass: "primitive",
  },
] as const;

export type ComponentMeta = (typeof components)[number];

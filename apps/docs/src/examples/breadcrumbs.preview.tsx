import { Breadcrumbs } from "@varua/flux-ui";

export default function Example() {
  return (
    <Breadcrumbs.Root aria-label="Example breadcrumb">
      <Breadcrumbs.List maxItems={4} itemsAfterCollapse={2}>
        <Breadcrumbs.Item separator="›">
          <Breadcrumbs.Link href="#overview">Workshop</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item separator="›">
          <Breadcrumbs.Link href="#components/stack">Guides</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item separator="›">
          <Breadcrumbs.Link href="#components/grid">Patterns</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item separator="›">
          <Breadcrumbs.Link href="#components/pagination">
            Navigation
          </Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item separator="›">
          <Breadcrumbs.Link href="#components">Components</Breadcrumbs.Link>
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>
          <Breadcrumbs.Current>Breadcrumbs</Breadcrumbs.Current>
        </Breadcrumbs.Item>
      </Breadcrumbs.List>
    </Breadcrumbs.Root>
  );
}

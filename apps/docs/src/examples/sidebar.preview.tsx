import { Button, Heading, Link, Sidebar, Stack, Text } from "@flux-ui/react";
import { useState } from "react";
export default function Preview() {
  const [page, setPage] = useState("Overview");
  return (
    <Sidebar.Root defaultOpen>
      <Stack gap="md">
        <Sidebar.Toggle variant="outline">
          Toggle example navigation
        </Sidebar.Toggle>
        <Sidebar.Layout>
          <Sidebar.Panel aria-label="Example navigation">
            <Stack gap="md">
              {["Overview", "Settings"].map((name) => (
                <Link
                  key={name}
                  variant="navigation"
                  href={`#${name.toLowerCase()}`}
                  aria-current={page === name ? "page" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    setPage(name);
                  }}
                >
                  {name}
                </Link>
              ))}
              <Sidebar.Close variant="ghost">
                Close example navigation
              </Sidebar.Close>
            </Stack>
          </Sidebar.Panel>
          <Sidebar.Content>
            <Stack padding="md" gap="md">
              <Heading level={2} size="md">
                {page}
              </Heading>
              <Text as="p">
                Selecting another page keeps navigation open. This panel is not
                a modal.
              </Text>
              <Button
                onClick={() =>
                  setPage(page === "Overview" ? "Settings" : "Overview")
                }
              >
                Use main content
              </Button>
            </Stack>
          </Sidebar.Content>
        </Sidebar.Layout>
      </Stack>
    </Sidebar.Root>
  );
}

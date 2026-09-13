// Intentionally no docs aliases, docs CSS, source-relative Flux imports, or VE plugin.
import "@flux-ui/tokens/theme.css";
import "@flux-ui/tokens/reset.css";
import { FluxMarkIcon } from "@flux-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Field,
  Grid,
  Heading,
  Inline,
  Input,
  Sidebar,
  Stack,
  Tabs,
  Text,
} from "@flux-ui/react";
import { useState } from "react";
import { createRoot } from "react-dom/client";

function Consumer() {
  const [page, setPage] = useState("Overview");
  const [count, setCount] = useState(0);
  return (
    <Sidebar.Root>
      <Box as="header" padding="md">
        <Inline justify="between">
          <Sidebar.Toggle>Toggle sidebar</Sidebar.Toggle>
          <FluxMarkIcon title="Flux mark" />
        </Inline>
      </Box>
      <Sidebar.Layout>
        <Sidebar.Panel aria-label="Consumer navigation">
          <Stack gap="md">
            <Sidebar.Close>Close sidebar</Sidebar.Close>
            <Input aria-label="Remembered filter" />
            <Button onClick={() => setPage("Components")}>Change page</Button>
          </Stack>
        </Sidebar.Panel>
        <Sidebar.Content data-testid="consumer-content">
          <Container>
            <Stack as="main" gap="lg" paddingBlock="lg">
              <Heading level={1}>{page}</Heading>
              <Card data-testid="surface">
                <Stack gap="md">
                  <Heading level={2}>Public exports, real CSS</Heading>
                  <Button onClick={() => setCount((value) => value + 1)}>
                    Page action {count}
                  </Button>
                  <Text data-testid="emphasis" italic decoration="underline">
                    Semantic text styling
                  </Text>
                </Stack>
              </Card>
              <Tabs.Root
                defaultValue="outer"
                orientation="vertical"
                appearance="pill"
                size="sm"
              >
                <Tabs.List aria-label="Outer tabs">
                  <Tabs.Tab value="outer">Outer</Tabs.Tab>
                  <Tabs.Tab value="other">Other</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="outer">
                  <Tabs.Root defaultValue="inner-one">
                    <Tabs.List aria-label="Inner tabs" activateOnFocus>
                      <Tabs.Tab value="inner-one">Inner one</Tabs.Tab>
                      <Tabs.Tab value="inner-two">Inner two</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="inner-one">Inner first panel</Tabs.Panel>
                    <Tabs.Panel value="inner-two">
                      Inner second panel
                    </Tabs.Panel>
                  </Tabs.Root>
                </Tabs.Panel>
                <Tabs.Panel value="other">Other panel</Tabs.Panel>
              </Tabs.Root>
              <Field.Root disabled id="outer-field">
                <Field.Label>Disabled outer</Field.Label>
                <Field.Control>
                  <Input />
                </Field.Control>
                <Field.Root id="inner-field">
                  <Field.Label>Enabled inner</Field.Label>
                  <Field.Control>
                    <Input />
                  </Field.Control>
                  <Field.Description>Inner description</Field.Description>
                </Field.Root>
              </Field.Root>
              <Field.Root id="reference-field">
                <Field.Label>Enabled reference</Field.Label>
                <Field.Control>
                  <Input />
                </Field.Control>
              </Field.Root>
              <Stack
                hidden
                data-testid="hidden-stack"
                style={{ display: "flex" }}
              >
                <Button>Hidden stack action</Button>
              </Stack>
              <Inline hidden data-testid="hidden-inline">
                <Button>Hidden inline action</Button>
              </Inline>
              <Grid hidden data-testid="hidden-grid">
                <Button>Hidden grid action</Button>
              </Grid>
              <Field.Root hidden data-testid="hidden-field">
                <Button>Hidden field action</Button>
              </Field.Root>
              <Avatar
                hidden
                data-testid="hidden-avatar"
                alt=""
                fallback={<Button>Hidden avatar action</Button>}
              />
              <Box hidden data-testid="hidden-box">
                <Button>Hidden box action</Button>
              </Box>
              <Stack id="findable">
                <Text>Findable hidden content</Text>
              </Stack>
            </Stack>
          </Container>
        </Sidebar.Content>
      </Sidebar.Layout>
    </Sidebar.Root>
  );
}
const root = document.getElementById("root");
if (root === null) throw new Error("Consumer fixture root is missing.");
createRoot(root).render(<Consumer />);

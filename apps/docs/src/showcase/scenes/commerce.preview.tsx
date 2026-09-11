import { ArrowRightIcon, PackageIcon } from "@flux-ui/icons";
import {
  Box,
  Button,
  Card,
  ColorSwatch,
  Field,
  Grid,
  Heading,
  Inline,
  Select,
  Stack,
  Text,
  ToggleGroup,
} from "@flux-ui/react";
import { useId, useState } from "react";
import { artworkInkStyle, SceneHeader, SceneStatus } from "../SceneParts.js";
import { formatMoney } from "../model.js";
import "./commerce.css";
const finishes = ["Chalk", "Ink", "Clay"] as const;
type Finish = (typeof finishes)[number];
const finishColors: Record<Finish, string> = {
  Chalk: "#eee9df",
  Ink: "#302f35",
  Clay: "#c5967a",
};
const price = 12900;
const bagLimit = 9;
export default function CommerceScene() {
  const id = useId();
  const [finish, setFinish] = useState<Finish>("Chalk");
  const [quantity, setQuantity] = useState(1);
  const [bag, setBag] = useState<
    ReadonlyArray<{
      finish: Finish;
      quantity: number;
    }>
  >([]);
  const [status, setStatus] = useState(
    "A fictional storefront. No payment, no order, no surprises.",
  );
  const count = bag.reduce((total, item) => total + item.quantity, 0);
  const full = count + quantity > bagLimit;
  function addToBag(): void {
    if (full) return;
    setBag((current) => {
      const existing = current.find((item) => item.finish === finish);
      return existing === undefined
        ? [...current, { finish, quantity }]
        : current.map((item) =>
            item.finish === finish
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
    });
    setStatus(
      `Added ${quantity} ${finish.toLowerCase()} ${quantity === 1 ? "speaker" : "speakers"} to your local demo bag.`,
    );
  }
  return (
    <Stack data-scene="commerce" gap={5} padding={5}>
      <SceneHeader brand="objects" context="Fewer things. Better things.">
        <Inline as="span" gap="sm">
          <PackageIcon size={16} /> Demo bag{" "}
          <Text as="strong" weight="bold" variant="caption">
            {count}
          </Text>
        </Inline>
      </SceneHeader>
      <Grid
        templateColumns={{
          base: "minmax(0, 1fr)",
          md: "minmax(0, 1.1fr) minmax(0, 1fr)",
        }}
        responsiveTo="container"
        gap="md"
      >
        <Box
          data-finish={finish.toLowerCase()}
          className="product-art"
          style={artworkInkStyle}
          as="figure"
        >
          <Text variant="caption" tone="muted">
            Form follows feeling.
          </Text>
          <svg
            viewBox="0 0 440 330"
            role="img"
            aria-label={`Illustration of a fictional portable speaker in ${finish}`}
          >
            <ellipse
              cx="225"
              cy="290"
              rx="105"
              ry="12"
              className="speaker-shadow"
            />
            <path
              d="M155 117V92C155 48 285 48 285 92V117"
              className="speaker-handle"
            />
            <rect
              x="125"
              y="100"
              width="190"
              height="185"
              rx="32"
              className="speaker-body"
            />
            <rect
              x="139"
              y="117"
              width="162"
              height="150"
              rx="22"
              className="speaker-grille"
            />
            <path
              d="M154 136H286 M154 148H286 M154 160H286 M154 172H286 M154 184H286 M154 196H286 M154 208H286 M154 220H286 M154 232H286 M154 244H286"
              className="speaker-lines"
            />
            <circle cx="220" cy="254" r="3" className="speaker-led" />
            <path
              d="M195 109H207 M215 109H227 M235 109H247"
              className="speaker-controls"
            />
          </svg>
          <Box as="figcaption">
            <Text variant="caption">THE EVERYDAY SPEAKER</Text>
            <Text variant="caption">Designed for wherever.</Text>
          </Box>
        </Box>
        <Card aria-label="Product options" as="section" padding={6} radius="sm">
          <Stack gap={3}>
            <Text as="p" variant="caption" tone="muted">
              01 / Sound, simplified
            </Text>
            <Heading level={3} size="md">
              Good sound.
              <br />
              Great company.
            </Heading>
            <Text as="p" variant="caption" tone="muted">
              A little speaker for the big and small moments. An original,
              fictional product concept.
            </Text>
            <Text
              className="product-price"
              as="strong"
              weight="bold"
              variant="caption"
            >
              {formatMoney(price)} <Text>sample USD</Text>
            </Text>
            <Text id={`${id}-finish`} as="p" variant="caption">
              The finish{" "}
              <Text as="strong" weight="bold">
                {finish}
              </Text>
            </Text>
            <ToggleGroup.Root
              type="single"
              value={finish}
              onValueChange={(value) => {
                if (value === "Chalk" || value === "Ink" || value === "Clay")
                  setFinish(value);
              }}
              aria-labelledby={`${id}-finish`}
              size="sm"
            >
              {finishes.map((value) => (
                <ToggleGroup.Item key={value} value={value}>
                  <ColorSwatch
                    color={finishColors[value]}
                    selected={value === finish}
                  />
                  {value}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
            <Grid
              templateColumns="minmax(0, 6rem) minmax(0, 1fr)"
              align="end"
              gap={3}
            >
              <Box>
                <Field.Root density="compact" controlId={`${id}-quantity`}>
                  <Field.Label>Quantity</Field.Label>
                  <Field.Control>
                    <Select
                      value={quantity}
                      onChange={(event) => {
                        setQuantity(Number(event.currentTarget.value));
                      }}
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </Select>
                  </Field.Control>
                </Field.Root>
              </Box>
              <Button
                onClick={addToBag}
                disabled={full}
                endIcon={<ArrowRightIcon size={16} />}
                size="sm"
              >
                Add to demo bag · {formatMoney(price * quantity)}
              </Button>
            </Grid>
            <SceneStatus>
              {full
                ? "The demo bag holds up to 9 items. Clear the bag or reduce the quantity."
                : status}
            </SceneStatus>
          </Stack>
        </Card>
        <Grid.Item colSpan="full">
          <Inline
            aria-label="Demo bag summary"
            as="section"
            wrap
            justify="between"
            gap="md"
            padding={5}
          >
            <Box>
              <Text as="p" variant="caption" tone="muted">
                Your small collection
              </Text>
              <Heading level={3} size="md">
                {count === 0
                  ? "Room for something good."
                  : `${count} ${count === 1 ? "object" : "objects"}. All yours to imagine.`}
              </Heading>
              <Text as="p" variant="caption" tone="muted">
                {bag.length === 0
                  ? "Try adding a speaker. This bag lives only in your browser tab."
                  : bag
                      .map((item) => `${item.finish} × ${item.quantity}`)
                      .join(" · ")}
              </Text>
            </Box>
            <Box>
              <Text as="strong" variant="metric" numeric>
                {formatMoney(count * price)}
              </Text>
              <Button
                size="sm"
                tone="neutral"
                variant="outline"
                disabled={count === 0}
                onClick={() => {
                  setBag([]);
                  setStatus("Your demo bag is empty again.");
                }}
              >
                Clear demo bag
              </Button>
            </Box>
          </Inline>
        </Grid.Item>
      </Grid>
    </Stack>
  );
}

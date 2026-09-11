import { useId, useState } from "react";
import { ArrowRightIcon, PackageIcon } from "@flux-ui/icons";
import { Button, Select, ToggleGroup } from "@flux-ui/react";
import { SceneHeader, SceneStatus } from "../SceneParts.js";
import { formatMoney } from "../model.js";
const finishes = ["Chalk", "Ink", "Clay"] as const;
type Finish = (typeof finishes)[number];
const price = 12900;
const bagLimit = 9;
export default function CommerceScene() {
  const id = useId();
  const [finish, setFinish] = useState<Finish>("Chalk");
  const [quantity, setQuantity] = useState(1);
  const [bag, setBag] = useState<
    ReadonlyArray<{ finish: Finish; quantity: number }>
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
    <div className="product-scene commerce-scene" data-scene="commerce">
      <SceneHeader brand="objects" context="Fewer things. Better things.">
        <span className="scene-bag">
          <PackageIcon size={16} /> Demo bag <strong>{count}</strong>
        </span>
      </SceneHeader>
      <div className="commerce-layout">
        <figure className="product-art" data-finish={finish.toLowerCase()}>
          <span className="scene-kicker">Form follows feeling.</span>
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
          <figcaption>
            <span>THE EVERYDAY SPEAKER</span>
            <span>Designed for wherever.</span>
          </figcaption>
        </figure>
        <section
          className="scene-panel product-details"
          aria-label="Product options"
        >
          <p className="scene-kicker">01 / Sound, simplified</p>
          <h3>
            Good sound.
            <br />
            Great company.
          </h3>
          <p className="scene-muted">
            A little speaker for the big and small moments. An original,
            fictional product concept.
          </p>
          <strong className="product-price">
            {formatMoney(price)} <span>sample USD</span>
          </strong>
          <p id={`${id}-finish`}>
            The finish <strong>{finish}</strong>
          </p>
          <ToggleGroup.Root
            type="single"
            value={finish}
            onValueChange={(value) => {
              if (value === "Chalk" || value === "Ink" || value === "Clay")
                setFinish(value);
            }}
            aria-labelledby={`${id}-finish`}
            className="finish-options"
          >
            {finishes.map((value) => (
              <ToggleGroup.Item key={value} value={value}>
                <span
                  className="finish-dot"
                  data-finish={value.toLowerCase()}
                  aria-hidden="true"
                />
                {value}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
          <div className="product-order">
            <div>
              <label htmlFor={`${id}-quantity`}>Quantity</label>
              <Select
                id={`${id}-quantity`}
                value={quantity}
                onChange={(event) => {
                  setQuantity(Number(event.currentTarget.value));
                }}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </Select>
            </div>
            <Button
              onClick={addToBag}
              disabled={full}
              endIcon={<ArrowRightIcon size={16} />}
            >
              Add to demo bag · {formatMoney(price * quantity)}
            </Button>
          </div>
          <SceneStatus>
            {full
              ? "The demo bag holds up to 9 items. Clear the bag or reduce the quantity."
              : status}
          </SceneStatus>
        </section>
        <section className="commerce-bag" aria-label="Demo bag summary">
          <div>
            <p className="scene-kicker">Your small collection</p>
            <h3>
              {count === 0
                ? "Room for something good."
                : `${count} ${count === 1 ? "object" : "objects"}. All yours to imagine.`}
            </h3>
            <p className="scene-muted">
              {bag.length === 0
                ? "Try adding a speaker. This bag lives only in your browser tab."
                : bag
                    .map((item) => `${item.finish} × ${item.quantity}`)
                    .join(" · ")}
            </p>
          </div>
          <div>
            <strong>{formatMoney(count * price)}</strong>
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
          </div>
        </section>
      </div>
    </div>
  );
}

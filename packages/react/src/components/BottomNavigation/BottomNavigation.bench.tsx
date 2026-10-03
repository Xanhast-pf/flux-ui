import { renderToString } from "react-dom/server";
import { bench, describe } from "vitest";
import { BottomNavigation } from "./BottomNavigation.js";

describe("BottomNavigation SSR", () => {
  bench("render 1,000 three-destination navigations", () => {
    renderToString(
      <div>
        {Array.from({ length: 1_000 }, (_, index) => index).map((index) => (
          <BottomNavigation key={index} aria-label={"Navigation " + index}>
            <BottomNavigation.Item href={"#home-" + index} current>
              Home
            </BottomNavigation.Item>
            <BottomNavigation.Item href={"#search-" + index}>
              Search
            </BottomNavigation.Item>
            <BottomNavigation.Item href={"#profile-" + index}>
              Profile
            </BottomNavigation.Item>
          </BottomNavigation>
        ))}
      </div>,
    );
  });
});

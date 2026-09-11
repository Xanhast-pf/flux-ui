import { expect, test } from "@playwright/test";
import { sceneIds } from "./showcase-fixtures.js";
test("the landing page leads with a live product, not a documentation rail", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /One system\.\s*Different worlds\./u,
  );
  await expect(page.locator(".desktop-sidebar")).toHaveCount(0);
  await expect(page.locator("[data-scene]")).toHaveCount(1);
  await expect(page.locator('[data-scene="finance"]')).toBeVisible();
  await expect(page.locator(".release-room")).toHaveCount(0);
  await page.goto("/#components");
  await expect(page.locator(".desktop-sidebar")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Browse sections", exact: true })
    .click();
  const navigation = page.getByRole("dialog", {
    name: "Flux UI documentation",
    exact: true,
  });
  await expect(navigation).toBeVisible();
  await expect(
    navigation.getByRole("navigation", { name: "Documentation sections" }),
  ).toHaveCount(1);
  await navigation
    .getByRole("button", { name: "Close navigation", exact: true })
    .click();
  await expect(navigation).not.toBeVisible();
});
for (const scene of sceneIds) {
  test(`${scene} is the only mounted scene and survives a reloadable deep link`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => {
      errors.push(error.message);
    });
    await page.goto(`/#playground?scene=${scene}&mood=studio`);
    await expect(page.locator(`[data-scene="${scene}"]`)).toBeVisible();
    await expect(page.locator("[data-scene]")).toHaveCount(1);
    await expect(page.locator(".world-surface")).toHaveAttribute(
      "data-mood",
      "studio",
    );
    await page.reload();
    await expect(page.locator(`[data-scene="${scene}"]`)).toBeVisible();
    expect(errors).toEqual([]);
  });
}
test("world tabs have manual keyboard activation; changing mood preserves state and focus", async ({
  page,
}) => {
  await page.goto("/#playground");
  const worlds = page.getByRole("tablist", { name: "Product worlds" });
  const finance = worlds.getByRole("tab", { name: "Finance", exact: true });
  await finance.focus();
  await page.keyboard.press("ArrowRight");
  const marketing = worlds.getByRole("tab", { name: "Marketing", exact: true });
  await expect(marketing).toBeFocused();
  await expect(finance).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("Enter");
  await expect(page.locator('[data-scene="marketing"]')).toBeVisible();
  await expect(marketing).toBeFocused();
  await page
    .getByLabel("Campaign headline", { exact: true })
    .fill("A very good idea.");
  const rootTheme = await page.locator("html").getAttribute("data-flux-theme");
  const mood = page
    .getByRole("group", { name: "Set the mood" })
    .getByRole("button", { name: "Studio", exact: true });
  await mood.click();
  await expect(mood).toBeFocused();
  await expect(
    page.getByLabel("Campaign headline", { exact: true }),
  ).toHaveValue("A very good idea.");
  expect(await page.locator("html").getAttribute("data-flux-theme")).toBe(
    rootTheme,
  );
  await page.getByRole("button", { name: "Reset scene", exact: true }).click();
  await expect(
    page.getByLabel("Campaign headline", { exact: true }),
  ).toHaveValue("Make room for wonder.");
  await expect(page.locator(".world-surface")).toHaveAttribute(
    "data-mood",
    "studio",
  );
});
test("invalid scene and mood parameters fall back safely", async ({ page }) => {
  await page.goto("/#playground?scene=not-a-scene&mood=%3Cscript%3E");
  await expect(page.locator('[data-scene="finance"]')).toBeVisible();
  await expect(page.locator(".world-surface")).toHaveAttribute(
    "data-mood",
    "paper",
  );
  await expect(
    page.getByRole("heading", { name: "That page wandered off." }),
  ).toHaveCount(0);
});
test("back navigation restores scene and mood without resetting the page scroll", async ({
  page,
}) => {
  await page.goto("/#playground?scene=finance&mood=paper");
  await expect(page.locator("[data-scene]")).toBeVisible();
  await page.getByRole("tab", { name: "Marketing", exact: true }).click();
  await expect(page.locator('[data-scene="marketing"]')).toBeVisible();
  await page
    .getByRole("group", { name: "Set the mood" })
    .getByRole("button", { name: "Bloom", exact: true })
    .click();
  await expect(page.locator(".world-surface")).toHaveAttribute(
    "data-mood",
    "bloom",
  );
  await page.goBack();
  await expect(page.locator(".world-surface")).toHaveAttribute(
    "data-mood",
    "paper",
  );
  await page.goBack();
  await expect(page.locator('[data-scene="finance"]')).toBeVisible();
  await page.evaluate(() => {
    window.scrollTo({ top: 320, behavior: "instant" });
  });
  const before = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => {
    window.location.hash = "playground?scene=finance&mood=terminal";
  });
  await expect(page.locator(".world-surface")).toHaveAttribute(
    "data-mood",
    "terminal",
  );
  expect(await page.evaluate(() => window.scrollY)).toBe(before);
});
test("finance controls change real local state", async ({ page }) => {
  await page.goto("/#playground?scene=finance&mood=paper");
  const scene = page.locator('[data-scene="finance"]');
  await scene
    .getByRole("group", { name: "Cash flow period" })
    .getByRole("button", { name: "Week", exact: true })
    .click();
  await expect(scene.getByTestId("finance-amount")).toContainText("$12,480");
  await scene
    .getByRole("button", { name: "Freeze demo card", exact: true })
    .click();
  await expect(
    scene.getByRole("button", { name: "Freeze demo card", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await scene
    .getByRole("button", { name: "Record demo payout", exact: true })
    .click();
  await expect(scene.getByTestId("finance-balance")).toContainText("$122,380");
  await expect(scene.getByRole("status")).toContainText("No money moved");
});
test("marketing rejects empty headlines and only launches locally", async ({
  page,
}) => {
  await page.goto("/#playground?scene=marketing&mood=paper");
  const scene = page.locator('[data-scene="marketing"]');
  await scene.getByLabel("Campaign headline", { exact: true }).fill("   ");
  await expect(
    scene.getByRole("button", { name: "Launch demo campaign", exact: true }),
  ).toBeDisabled();
  await scene
    .getByLabel("Campaign headline", { exact: true })
    .fill("Something worth making.");
  await expect(scene.locator(".campaign-poster h3")).toHaveText(
    "Something worth making.",
  );
  await scene
    .getByLabel("Your audience", { exact: true })
    .selectOption("teams");
  await expect(scene.locator(".campaign-poster")).toContainText(
    "teams that think differently",
  );
  await scene
    .getByRole("button", { name: "Launch demo campaign", exact: true })
    .click();
  await expect(scene.getByRole("status")).toContainText("No message was sent");
});
test("social posting is bounded, text-only, and resettable", async ({
  page,
}) => {
  await page.goto("/#playground?scene=social&mood=bloom");
  const scene = page.locator('[data-scene="social"]');
  await scene
    .getByRole("button", { name: "Like post mira", exact: true })
    .click();
  await expect(
    scene.getByRole("button", { name: "Like post mira", exact: true }),
  ).toContainText("25");
  await scene.getByRole("button", { name: "Follow Mira", exact: true }).click();
  await expect(
    scene.getByRole("button", { name: "Following Mira", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  for (const text of [
    "<script>not executable</script>",
    "A small win.",
    "One last note.",
  ]) {
    await scene
      .getByLabel("What are you working on?", { exact: true })
      .fill(text);
    await scene
      .getByRole("button", { name: "Post to demo feed", exact: true })
      .click();
  }
  await expect(scene.getByRole("article")).toHaveCount(4);
  await expect(scene.locator("script")).toHaveCount(0);
  await expect(
    scene.getByRole("button", { name: "Post to demo feed", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Reset scene", exact: true }).click();
  await expect(scene.getByRole("article")).toHaveCount(1);
});
test("music is opt-in, keyboard-operable, silent, and honors reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#playground?scene=music&mood=studio");
  const scene = page.locator('[data-scene="music"]');
  await expect(scene.locator(".sequencer")).toHaveAttribute(
    "data-playing",
    "false",
  );
  await scene
    .getByRole("button", { name: "Play visual loop", exact: true })
    .click();
  await expect(scene.locator(".sequencer")).toHaveAttribute(
    "data-playing",
    "true",
  );
  await expect(scene.locator(".sequencer-playhead > span")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(scene.locator(".reduced-motion-note")).toBeVisible();
  await scene
    .getByRole("button", { name: "Mute Drum machine", exact: true })
    .click();
  await expect(
    scene.getByRole("button", { name: "Mute Drum machine", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await scene.getByRole("slider", { name: /^Tempo/ }).press("ArrowRight");
  await expect(scene.getByRole("slider", { name: /^Tempo/ })).toHaveValue(
    "109",
  );
  await expect(page.locator("audio, video, iframe")).toHaveCount(0);
  await page.getByRole("tab", { name: "Finance", exact: true }).click();
  await expect(scene).toHaveCount(0);
});
test("video selects illustrated clips and exports actual edit notes", async ({
  page,
}) => {
  await page.goto("/#playground?scene=video&mood=studio");
  const scene = page.locator('[data-scene="video"]');
  await scene.getByRole("button", { name: /02 \/ Dunes/ }).click();
  await expect(scene.locator(".video-frame h3")).toHaveText(
    "Take the long way",
  );
  await scene.getByRole("slider", { name: /^Preview position/ }).press("End");
  await expect(
    scene.getByRole("region", { name: "Storyboard preview" }),
  ).toContainText("00:08");
  await scene
    .getByRole("switch", { name: "Show title overlay", exact: true })
    .uncheck();
  await expect(scene.locator(".video-frame h3")).toHaveCount(0);
  const download = page.waitForEvent("download");
  await scene
    .getByRole("button", { name: "Export edit notes", exact: true })
    .click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("cutroom-demo-edit.json");
  const stream = await file.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream)
    chunks.push(Buffer.from(chunk as Uint8Array));
  const body = Buffer.concat(chunks).toString("utf8");
  expect(body).toContain('"clip": "dunes"');
  expect(body).toContain('"positionSeconds": 8');
  expect(body).toContain('"titles": false');
});
test("commerce preserves line items, computes totals, and enforces the demo bag limit", async ({
  page,
}) => {
  await page.goto("/#playground?scene=commerce&mood=paper");
  const scene = page.locator('[data-scene="commerce"]');
  await scene.getByRole("button", { name: "Clay", exact: true }).click();
  await scene.getByLabel("Quantity", { exact: true }).selectOption("3");
  const add = scene.getByRole("button", { name: /Add to demo bag/ });
  await add.click();
  await expect(
    scene.getByRole("region", { name: "Demo bag summary" }),
  ).toContainText("$387");
  const bag = scene.getByRole("region", { name: "Demo bag summary" });
  await expect(bag).toContainText("Clay × 3");
  await add.click();
  await add.click();
  await expect(add).toBeDisabled();
  await expect(bag).toContainText("$1,161");
  await scene
    .getByRole("button", { name: "Clear demo bag", exact: true })
    .click();
  await expect(bag).toContainText("$0");
});
test("composition details expose real source only on request", async ({
  page,
}) => {
  await page.goto("/#playground?scene=music&mood=studio");
  await expect(
    page.getByRole("region", { name: "Composition details" }),
  ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Inspect composition", exact: true })
    .click();
  const inspector = page.getByRole("region", { name: "Composition details" });
  await expect(inspector).toContainText("not an audio engine");
  await inspector
    .getByRole("button", { name: "View source", exact: true })
    .click();
  await expect(
    inspector.getByRole("region", { name: "Music / DAW composition source" }),
  ).toContainText("export default function MusicScene");
  await expect(
    inspector.getByRole("link", { name: "Slider ↗", exact: true }),
  ).toHaveAttribute("href", "#components/slider");
});
test("clipboard failure is honest and the permalink stays usable", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("blocked")) },
    });
  });
  await page.goto("/#playground?scene=music&mood=studio");
  await page
    .getByRole("button", { name: "Copy scene link", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "Clipboard unavailable" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Scene permalink ↗", exact: true }),
  ).toHaveAttribute("href", "#playground?scene=music&mood=studio");
});
for (const width of [320, 390, 768, 1024, 1440]) {
  test(`every product fits a ${width}px viewport without root overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const scene of sceneIds) {
      await page.goto(`/#playground?scene=${scene}&mood=paper`);
      await expect(page.locator(`[data-scene="${scene}"]`)).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth + 1,
        ),
        scene,
      ).toBe(true);
      const clippedControls = await page
        .locator(".product-showcase")
        .evaluate((surface) => {
          return [
            ...surface.querySelectorAll<HTMLElement>(
              "button, input, textarea, select, a",
            ),
          ]
            .filter((element) => {
              const rect = element.getBoundingClientRect();
              if (rect.width === 0 || rect.height === 0) return false;
              const stage = element
                .closest(".world-surface")
                ?.getBoundingClientRect();
              return (
                rect.left < 0 ||
                rect.right > window.innerWidth ||
                (stage !== undefined &&
                  (rect.left < stage.left || rect.right > stage.right))
              );
            })
            .map((element) => element.textContent.trim() || element.tagName);
        });
      expect(
        clippedControls,
        `${scene}: visible controls must not rely on overflow clipping`,
      ).toEqual([]);
    }
  });
}

test("container-responsive scenes do not inherit wide viewport columns", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const scene of ["finance", "marketing", "commerce"]) {
    await page.goto(`/#playground?scene=${scene}&mood=paper`);
    const root = page.locator(`[data-scene="${scene}"]`);
    await expect(root).toBeVisible();
    await page.locator(".world-surface").evaluate((element) => {
      element.style.inlineSize = "20rem";
      element.style.maxInlineSize = "100%";
    });
    const layout = root.locator(':scope > [data-r="container"]').first();
    await expect(layout).toBeVisible();
    await expect
      .poll(() =>
        layout.evaluate(
          (element) =>
            getComputedStyle(element).gridTemplateColumns.split(" ").length,
        ),
      )
      .toBe(1);
  }
});

test("the compact finance table retains a caption and keyboard-scrollable overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/#playground?scene=finance&mood=paper");
  const table = page.getByRole("table");
  await expect(table.locator(":scope > caption")).toHaveCount(1);
  const region = page
    .locator('[data-scene="finance"] [role="region"]')
    .filter({ has: table });
  await expect(region).toHaveAttribute("tabindex", "0");
  await region.focus();
  await expect(region).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => region.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
});

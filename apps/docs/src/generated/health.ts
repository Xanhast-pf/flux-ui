// GENERATED FILE. Run `pnpm generate`; do not edit manually.
export const health = {
  size: {
    schemaVersion: 1,
    budgetsVersion: 1,
    aggregate: {
      rootEntry: {
        raw: 359,
        gzip: 203,
        brotli: 179,
        fileCount: 1,
      },
      runtime: {
        raw: 21579,
        gzip: 6858,
        brotli: 5979,
        fileCount: 18,
      },
      published: {
        raw: 78605,
        gzip: 28854,
        brotli: 25198,
        fileCount: 83,
      },
    },
    components: [
      {
        name: "Button",
        slug: "button",
        sizeClass: "interactive",
        raw: 6773,
        gzip: 2583,
        brotli: 2218,
        budgetBrotli: 3072,
      },
      {
        name: "Container",
        slug: "container",
        sizeClass: "primitive",
        raw: 1086,
        gzip: 742,
        brotli: 634,
        budgetBrotli: 1536,
      },
      {
        name: "Grid",
        slug: "grid",
        sizeClass: "interactive",
        raw: 10335,
        gzip: 2152,
        brotli: 1909,
        budgetBrotli: 3072,
      },
      {
        name: "Inline",
        slug: "inline",
        sizeClass: "primitive",
        raw: 2624,
        gzip: 1347,
        brotli: 1162,
        budgetBrotli: 1536,
      },
      {
        name: "Stack",
        slug: "stack",
        sizeClass: "primitive",
        raw: 2336,
        gzip: 1231,
        brotli: 1079,
        budgetBrotli: 1536,
      },
    ],
  },
  performance: {
    schemaVersion: 1,
    policyVersion: 2,
    scenarios: [
      {
        name: "button",
        count: 1000,
        reference: "native",
        medians: {
          raw: {
            mount: 2,
            mountToFrame: 18.600000023841858,
            update: 1.800000011920929,
            updateToFrame: 18.600000023841858,
            unmount: 1.100000023841858,
          },
          native: {
            mount: 3.5,
            mountToFrame: 16.69999998807907,
            update: 2.800000011920929,
            updateToFrame: 16.5,
            unmount: 2,
          },
          flux: {
            mount: 6.699999988079071,
            mountToFrame: 18.399999976158142,
            update: 6.199999988079071,
            updateToFrame: 16.899999976158142,
            unmount: 2.300000011920929,
          },
        },
        ratios: {
          mount: 1.8787878683885377,
          mountToFrame: 1.0545454567128962,
          update: 2.2142857477373012,
          updateToFrame: 1.0119760471989123,
          unmount: 1.1904761769603982,
        },
      },
      {
        name: "grid",
        count: 1000,
        reference: "native",
        medians: {
          raw: {
            mount: 2.599999964237213,
            mountToFrame: 16.600000023841858,
            update: 2,
            updateToFrame: 16.900000035762787,
            unmount: 1.699999988079071,
          },
          native: {
            mount: 2.699999988079071,
            mountToFrame: 16.600000023841858,
            update: 2.199999988079071,
            updateToFrame: 16.69999998807907,
            unmount: 1.399999976158142,
          },
          flux: {
            mount: 2.600000023841858,
            mountToFrame: 16.5,
            update: 2.100000023841858,
            updateToFrame: 16.600000023841858,
            unmount: 1.399999976158142,
          },
        },
        ratios: {
          mount: 1,
          mountToFrame: 0.9939393961068356,
          update: 0.9545454705549666,
          updateToFrame: 0.9939759021868535,
          unmount: 0.9473684094949445,
        },
      },
    ],
  },
} as const;

export type HealthSnapshot = typeof health;

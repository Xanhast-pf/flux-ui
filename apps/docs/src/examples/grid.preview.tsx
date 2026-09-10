import { Grid } from "@flux-ui/react";

export default function Example() {
  return (
    <Grid minColumnWidth="7rem" gap="sm" className="demo-boundary">
      <div className="demo-block">One</div>
      <div className="demo-block">Two</div>
      <div className="demo-block">Three</div>
      <div className="demo-block">Four</div>
    </Grid>
  );
}

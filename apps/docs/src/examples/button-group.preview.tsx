import { DownloadIcon, SaveIcon, ShareIcon } from "@varua/icons";
import { Button, ButtonGroup } from "@varua/flux-ui";

export default function Example() {
  return (
    <ButtonGroup aria-label="Document actions">
      <Button variant="outline" startIcon={<SaveIcon size={14} />}>
        Save
      </Button>
      <Button variant="outline" startIcon={<DownloadIcon size={14} />}>
        Export
      </Button>
      <Button variant="outline" startIcon={<ShareIcon size={14} />}>
        Share
      </Button>
    </ButtonGroup>
  );
}

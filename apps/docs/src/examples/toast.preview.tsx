import { Button, Stack, Text, Toast, useToast } from "@flux-ui/react";
import { useState } from "react";
function SaveExample() {
  const { notify } = useToast();
  const [saved, setSaved] = useState(false);
  return (
    <Stack gap="md">
      <Button
        onClick={() => {
          setSaved(true);
          notify({
            title: "Local draft saved",
            description: "No network request was made.",
            tone: "success",
            action: { label: "Undo", onClick: () => setSaved(false) },
          });
        }}
      >
        Save local draft
      </Button>
      <Text>
        {saved ? "Saved locally for this example." : "Unsaved draft."}
      </Text>
      <Toast.Viewport placement="inline" />
    </Stack>
  );
}
export default function Example() {
  return (
    <Toast.Provider>
      <SaveExample />
    </Toast.Provider>
  );
}

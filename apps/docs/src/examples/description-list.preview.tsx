import { DescriptionList } from "@flux-ui/react";

export default function Preview() {
  return (
    <DescriptionList>
      <DescriptionList.Term>Status</DescriptionList.Term>
      <DescriptionList.Details>Draft</DescriptionList.Details>
      <DescriptionList.Term>Owner</DescriptionList.Term>
      <DescriptionList.Details>Design systems team</DescriptionList.Details>
    </DescriptionList>
  );
}

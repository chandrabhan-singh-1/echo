import { OrganizationList } from "@clerk/nextjs";

export const OrgSelectionView = () => {
  return (
    <OrganizationList
      hidePersonal
      skipInvitationScreen
      afterCreateOrganizationUrl="/"
      afterSelectOrganizationUrl="/"
    />
  );
};

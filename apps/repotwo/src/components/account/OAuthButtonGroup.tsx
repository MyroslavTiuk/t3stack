import { Button, ButtonGroup, VisuallyHidden } from "@chakra-ui/react";
import { GitHubIcon, GoogleIcon, TwitterIcon } from "./ProviderIcons";
import { signIn } from "next-auth/react";

const providers = [
  { name: "Google", icon: <GoogleIcon boxSize="5" />, id: "google" },
  { name: "Twitter", icon: <TwitterIcon boxSize="5" />, id: "twitter" },
  { name: "GitHub", icon: <GitHubIcon boxSize="5" />, id: "github" },
];

export const OAuthButtonGroup = () => (
  <ButtonGroup variant="outline" spacing="4" width="full">
    {providers.map(({ name, icon, id }) => (
      <Button key={name} width="full" onClick={() => signIn(id)}>
        <VisuallyHidden>Sign in with {name}</VisuallyHidden>
        {icon}
      </Button>
    ))}
  </ButtonGroup>
);

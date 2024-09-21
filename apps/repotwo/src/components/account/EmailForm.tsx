import React from "react";
import { Button, Input } from "@chakra-ui/react";
import { signIn } from "next-auth/react";

const EmailForm: React.FC = () => {
  const [email, setEmail] = React.useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        signIn("email", { email });
      }}
    >
      <label>
        Email address
        <Input
          type="email"
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <Button type="submit" width={"100%"} padding={2} marginTop={2}>
        Continue with email
      </Button>
    </form>
  );
};

export default EmailForm;

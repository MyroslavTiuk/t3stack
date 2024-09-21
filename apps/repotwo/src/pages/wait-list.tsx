import React from "react";
import Image from "next/image";
import styles from "@styles/Wait.module.css";
import { useState } from "react";
import { Flex, Box, Button, Heading } from "@chakra-ui/react";
import { trpc } from "@utils/trpc";

const WaitList: React.FC = () => {
  function LeftSide() {
    return (
      <div className={styles.column}>
        <h1 className={styles.title}>
          Option Trading Secrets
          <br />
          <span className={styles.titleKeyword}>Waitlist + $500 discount</span>
        </h1>
        <div className={styles.subtitle}>
          Enter your information below to get $500 discount to the option
          trading secrets program, set to launch December 24th
        </div>
        <Form />
      </div>
    );
  }

  function Form() {
    const [email, setEmail] = useState("");
    const joinWaitlist = trpc.waitlist.joinWaitlist.useMutation();

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      joinWaitlist.mutate({ email });
    };

    if (joinWaitlist.isSuccess) {
      return (
        <Flex
          flexDirection="column"
          margin={"auto"}
          padding="4"
          maxWidth={"100%"}
        >
          <Box>
            <span>Thanks for signing up!</span>
          </Box>
          <Box>
            <Heading as={"h3"} fontSize="2rem" color="white">
              Join our community to stay in touch
            </Heading>
            <Flex flexDirection={"column"} padding="4">
              <Button margin={"2"} colorScheme="whatsapp">
                <a href="https://discord.gg/4UAYMZvaUj">
                  Discord discussion board
                </a>
              </Button>
              <Button margin={"2"} colorScheme="whatsapp">
                {" "}
                <a href="https://www.facebook.com/groups/optionscout">
                  Facebook discussion board
                </a>
              </Button>
            </Flex>
          </Box>
        </Flex>
      );
    }

    return (
      <form className={styles.formWrapper} onSubmit={submit}>
        <input
          type="email"
          required
          placeholder="Email"
          className={[styles.formInput, styles.formTextInput].join(" ")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={joinWaitlist.isLoading}
        />

        <button
          type="submit"
          className={[styles.formInput, styles.formSubmitButton].join(" ")}
        >
          Join Waitlist
        </button>

        {joinWaitlist.isError ? (
          <div className={styles.error}>{joinWaitlist.error.message}</div>
        ) : null}
      </form>
    );
  }
  function RightSide() {
    return (
      <div className={styles.column}>
        <Image
          src={"/waitlist.png"}
          alt="option trading secrets waitlist"
          width="900"
          height="600"
        />
      </div>
    );
  }
  return (
    <div className={styles.container}>
      <LeftSide />
      <RightSide />
    </div>
  );
};

export default WaitList;

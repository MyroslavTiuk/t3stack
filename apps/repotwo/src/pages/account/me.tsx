import React from "react";

import {
  Avatar,
  Button,
  Container,
  Flex,
  Heading,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { trpc } from "@utils/trpc";
import ErrorPage from "@atoms/ErrorPage";
import SavedTrades from "@atoms/SavedTrades";

const ProfilePage: React.FC = () => {
  const { data, status } = useSession();
  const isLoaded = status !== "loading" && !!data;
  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation();

  if (createCheckoutSession.status === "success") {
    window.location.assign(createCheckoutSession.data);
  }

  if (status === "unauthenticated") {
    return <ErrorPage message="Please log in to view your profile." />;
  }

  return (
    <Container maxW="xl" py={{ base: "12", md: "24" }}>
      <Stack spacing="8">
        <Skeleton isLoaded={isLoaded}>
          <Heading as="h1">My Profile</Heading>
        </Skeleton>
        <Flex>
          <Skeleton isLoaded={isLoaded}>
            <Avatar
              size="lg"
              src={data?.user?.image ?? undefined}
              name={data?.user?.name ?? undefined}
            />
          </Skeleton>
          <Stack ml="4" spacing={1}>
            <Text fontSize="lg">{data?.user?.name}</Text>
            <Text>{data?.user?.email}</Text>
          </Stack>
        </Flex>
        <Skeleton isLoaded={isLoaded}>
          <Heading size="lg">Subscription</Heading>
        </Skeleton>
        {/*@ts-ignore*/}
        {data?.user?.isActive ? (
          <Text>Subscription is active.</Text>
        ) : (
          <Skeleton isLoaded={isLoaded}>
            <Stack spacing={4}>
              <Text>
                You have not subscribed yet. Subscribe now to get access to all
                our premium tools for only $29.99 / month.
              </Text>
              {createCheckoutSession.status === "error" && (
                <Text>Failed to subscribe, please try again.</Text>
              )}
              {createCheckoutSession.status === "loading" ? (
                <Spinner />
              ) : (
                <Button onClick={() => createCheckoutSession.mutate()}>
                  Subscribe now
                </Button>
              )}
            </Stack>
          </Skeleton>
        )}
        <Heading size="lg">Saved Trades</Heading>
        <SavedTrades />
      </Stack>
    </Container>
  );
};

export default ProfilePage;

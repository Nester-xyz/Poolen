import { PublicClient, testnet } from "@lens-protocol/client";

export const client = PublicClient.create({
  environment: testnet,
  storage: window.localStorage,
  //   origin: "https://yourappdomain.xyz", // Replace with your app's domain
});

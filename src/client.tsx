import { PublicClient, testnet } from "@lens-protocol/client";

export const client = PublicClient.create({
  environment: testnet,
//   origin: "https://yourappdomain.xyz", // Replace with your app's domain
});
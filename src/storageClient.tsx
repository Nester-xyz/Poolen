import { StorageClient, testnet as storageEnv } from "@lens-protocol/storage-node-client";


export const storageClient = StorageClient.create(storageEnv);


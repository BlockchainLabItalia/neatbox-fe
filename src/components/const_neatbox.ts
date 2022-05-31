import { apiClient, cryptography } from "@liskhq/lisk-client";
import { digitalAsset, registeredAssets, listaAssetAddress, details, digitalAssetHistory } from "./types_neatbox";

let clientCache:apiClient.APIClient;

export const RPC_ENDPOINT = 'wss://api.neatbox.it/ws';

export const getClient = async () => {
    if (!clientCache) {
        clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
    }
    return clientCache;
};


export async function fetchRequest(address: string) {
    const client = await getClient();
  
    const ipfsAsset: listaAssetAddress =await client.invoke(`digitalAsset:getAccountAssets`, { address: address });
    
    
    return ipfsAsset;
  }

export async function fetchAssetByM(merkle: string) {
    const client = await getClient();
  
    const ipfsAsset: digitalAsset =(await client.invoke(`digitalAsset:getAsset`, { merkleRoot: merkle }));
  
  
    return ipfsAsset;
  }

  export async function getAssetPaged(elements: number, page: number) {
    const client = await getClient();
  
    const ipfsAsset: registeredAssets =(await client.invoke(`digitalAsset:getAllAssetsPaged`, { elements: elements, page: page }));
  
  
    return ipfsAsset;
  }


  export async function getAssetHistory(merkle: string) {
    const client = await getClient();
  
    const ipfsAsset: digitalAssetHistory =(await client.invoke(`digitalAsset:getAssetHistory`, { merkleRoot: merkle }));
  
  
    return ipfsAsset;
  }

  export async function getAssetDet(merkle: string) {
    const client = await getClient();
  
    const ipfsAsset: details =(await client.invoke(`digitalAsset:getAssetDetail`, { merkleRoot: merkle }));
  
  
    return ipfsAsset;
  }
  
export const networkIdentifier = cryptography.getNetworkIdentifier(
    cryptography.hexToBuffer("d1518f5697efc3c3bd1cbaa904e13d8999fb974925e8454855c285d927f54757"),
    "neatbox",
);



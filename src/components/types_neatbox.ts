export type createT = {
    fileName: string;
    fileSize: number;
    fileHash: Buffer;
    merkleRoot: Buffer;
    merkleHeight: number;
    secret: string;
}

export type createForm = {
    secret: string;
}

export type requestT = {
    merkleRoot: Buffer;
    mode: string
}

export type responseT = {
	address: Buffer,
	merkleRoot: Buffer,
	response: string,
	newSecret: string
}

export type claimT = {
	oldMerkleRoot: Buffer,
	newMerkleRoot: Buffer,
	newMerkleHeight: number,
	newHosts: Buffer[],
	newSecret: string
}

export type transaction = {
    moduleID: number;
    assetID: number;
    fee: bigint;
    nonce: bigint;
    senderPublicKey: Buffer;
    asset: Buffer | createT | requestT | responseT | claimT;
    signatures: any[];
}

export type digitalAsset = {
    owner:Buffer,
    fileName:string,
    fileSize:number,
    fileHash:Buffer,
    merkleRoot:Buffer,
    merkleHeight:number,
    secret:string,
    transactionID: Buffer,
    previousAssetReference: Buffer
  }

  export type registeredAssets = {
    registeredAssets: digitalAsset[]
  }

  export type listaAssetAddress ={
    allowed : allowed[],
    myFiles : myFiles[],
    pending : pending[],
    requested_to_me: requested_to_me[]
  }
 export type pending = {
    fileName: string,
    merkleRoot: Buffer,
};
export type allowed = {
    fileName: string,
    merkleRoot: Buffer,
    secret: string,
};
export type myFiles = {
    fileName: string,
    merkleRoot: Buffer,
    secret: string,
};

export type requested_to_me= {
    fileName: string,
    merkleRoot: Buffer,
    address: Buffer,
    mode: string
};

export type Wallet = {
    address: string;
    binaryAddress: string;
    passphrase: string;
    publicKey: string;
    privateKey: string;
  };

  export type details = {
    merkleRoot: Buffer,
    owner: Buffer,
    hostedBy: Buffer[],
    requestedBy: {
      address: Buffer,
      requestTransaction: Buffer,
      responseTransaction: Buffer,
      requestType: string,
      status: string
    }[],
    allowedViewers: {
      address: Buffer,
      secret: string
    }[],
}

export type digitalAssetHistory = {
  merkleRoot: string,
  owner: string,
  requests: {
      address: string,
      mode: string,
      status: string
  }[],
  previousVersion?: digitalAssetHistory
}
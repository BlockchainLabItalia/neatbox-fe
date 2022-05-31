export const transactionSchema = {
    "$id":"lisk/transaction",
    "type":"object",
    "required":[
       "moduleID",
       "assetID",
       "nonce",
       "fee",
       "senderPublicKey",
       "asset"
    ],
    "properties":{
       "moduleID":{
          "dataType":"uint32",
          "fieldNumber":1,
          "minimum":2
       },
       "assetID":{
          "dataType":"uint32",
          "fieldNumber":2
       },
       "nonce":{
          "dataType":"uint64",
          "fieldNumber":3
       },
       "fee":{
          "dataType":"uint64",
          "fieldNumber":4
       },
       "senderPublicKey":{
          "dataType":"bytes",
          "fieldNumber":5,
          "minLength":32,
          "maxLength":32
       },
    "asset":{
        "dataType":"bytes",
        "fieldNumber":6
     },
       "signatures":{
          "type":"array",
          "items":{
             "dataType":"bytes"
          },
          "fieldNumber":7
       }
    }
};
export const createAssetSchema = {
    $id: 'digitalAsset/create-asset',
    title: 'CreateAsset transaction asset for digitalAsset module',
    type: 'object',
    required: ['fileName', 'fileSize', 'fileHash', 'merkleRoot', 'merkleHeight', 'secret'],
    properties: {
        fileName:{
            dataType: 'string',
            fieldNumber: 1,
            maxLength: 64
        },
        fileSize: {
            dataType: 'uint32',
            fieldNumber: 2
        },
        fileHash: {
            dataType: 'bytes',
            fieldNumber: 3
        },
        merkleRoot: {
            dataType: 'bytes',
            fieldNumber: 4
        },
        merkleHeight: {
            dataType: 'uint32',
            fieldNumber: 5
        },
        secret: {
            dataType: 'string',
            fieldNumber: 6
        },
    },
};

export const requestAssetSchema = {
    $id: 'digitalAsset/request-asset',
    title: 'RequestAsset transaction asset for digitalAsset module',
    type: 'object',
    required: ['merkleRoot', 'mode'],
    properties: {
        merkleRoot:{
            dataType: 'bytes',
            fieldNumber: 1
        },
        mode: {
            dataType: 'string',
            fieldNumber: 2
        }
    }
}

export const responseAssetSchema = {
    $id: 'digitalAsset/response-asset',
    title: 'ResponseAsset transaction asset for digitalAsset module',
    type: 'object',
    required: ['address','merkleRoot', 'response', 'newSecret'], 
    properties: {
        address:{
            dataType: 'bytes',
            fieldNumber: 1
        },
        merkleRoot:{
            dataType: 'bytes',
            fieldNumber: 2
        },
        response: {
            dataType: 'string',
            fieldNumber: 3
        },
        newSecret: {
            dataType: 'string',
            fieldNumber: 4
        }
    }
}

export const claimAssetSchema = {
    $id: 'digitalAsset/claim-asset',
    title: 'ClaimAsset transaction asset for digitalAsset module',
    type: 'object',
    required: ['oldMerkleRoot','newMerkleRoot', 'newMerkleHeight', 'newHosts'], 
    properties: {
        oldMerkleRoot:{
            dataType: 'bytes',
            fieldNumber: 1
        },
        newMerkleRoot:{
            dataType: 'bytes',
            fieldNumber: 2
        },
        newMerkleHeight: {
            dataType: 'uint32',
            fieldNumber: 3
        },
        newHosts: {
            type: 'array',
            fieldNumber: 4,
            items: {
                dataType: 'bytes'
            }
        },
        newSecret: {
            dataType: 'string',
            fieldNumber: 5
        }
    },
}
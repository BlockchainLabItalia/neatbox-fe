//@ts-ignore
import React, { useState, useEffect } from 'react';
import { transactions, validator } from "@liskhq/lisk-client";

import { List, Select, Button,notification, message, Collapse,Popover } from "antd";
import { Link } from 'react-router-dom';
import { requestAssetSchema, transactionSchema, responseAssetSchema } from "./schemas_neatbox";
import { getClient, networkIdentifier } from "./const_neatbox"
import { transaction } from "./types_neatbox";

const { Option } = Select;

const { Panel } = Collapse;

export const getAssetPath = (id: string) => `/browse/${id}`;






// pass the assets as a chield property
export default function ComponentList({mode, loading, addressR, merkleRoot,FileName, tipo }: {mode: string,loading: any, addressR: string ,merkleRoot: string, FileName: string, tipo: string }){

    const content = (
        <div>
         <p style={{textAlign: 'center'}}>Richiesta di: {mode} </p>
                <p style={{textAlign: 'center'}}>From : {addressR}</p>
        </div>
      );
    const [choose, setChoose] = useState("");
    const [credentials, updateCredentials] = useState({
        address: "",
        binaryAddress: "",
        passphrase: "",
        publicKey: "",
        privateKey: ""
    });
    useEffect(()=>{
        setChoose("");
        const up= localStorage.getItem("walletDetails");
           
        if(up)
        {      
         let a  = JSON.parse(up);
         if(a.address != "")
        {
         updateCredentials({
             address: a.address,
             binaryAddress: a.binaryAddress,
             passphrase: a.passphrase,
             publicKey: a.publicKey,
             privateKey: a.privateKey
         });
       
        
        
     }
  
        }
    },[])
    
    const responseOK = async () =>{
        try {
            const client = await getClient()
    
            const account: any = (await client.invoke('infos:getAccountNonce', {
                address: credentials.binaryAddress
            }))
    
            const response_object = {
                address: Buffer.from(addressR, 'hex'),
                merkleRoot: Buffer.from(merkleRoot, 'hex'),
                response: 'OK',
                newSecret: 'new_secret'
            }
            
            const unsignedTransactionC: transaction = {
                moduleID: Number(1001),
                assetID: Number(2), // aka Token Transfer transaction
                fee: BigInt(10000000),
                nonce: BigInt(account.nonce),
                senderPublicKey: Buffer.from(credentials.publicKey,'hex'),
                asset: Buffer.alloc(0) ,
                signatures: [],
            };
            
            // Validate the transaction oject
            const transactionErrors = validator.validator.validate(transactionSchema, unsignedTransactionC);
            
            if (transactionErrors.length) {
                 console.log(" ### VALIDATE KO ### ")
                throw new validator.LiskValidationError([...transactionErrors]);
            }
            
            unsignedTransactionC.asset = response_object;
            const signedTransaction = transactions.signTransaction(
                responseAssetSchema,
                unsignedTransactionC,
                networkIdentifier,
                credentials.passphrase,
            );
            
          //  console.log(signedTransaction);
    
            const res = await client.transaction.send(signedTransaction);
            console.log(res);
            
        } catch (error) {
            console.log(error);
        }
        window.location.reload();
    }







    
    const executeView = async () => {
    
        try {
            const client = await getClient()
    
            const account: any = (await client.invoke('infos:getAccountNonce', {
                address: credentials.binaryAddress
            }))
    
    
            const request_object = {
                "merkleRoot":Buffer.from(merkleRoot, 'hex'),
                "mode" : "VIEW"
            }
            
            const unsignedTransactionC: transaction = {
                moduleID: Number(1001),
                assetID: Number(1), // aka Token Transfer transaction
                fee: BigInt(10000000),
                nonce: BigInt(account.nonce),
                senderPublicKey: Buffer.from(credentials.publicKey,'hex'),
                asset: Buffer.alloc(0) ,
                signatures: [],
            };
            
            // Validate the transaction oject
            const transactionErrors = validator.validator.validate(transactionSchema, unsignedTransactionC);
            
            if (transactionErrors.length) {
                  console.log(" ### VALIDATE KO ### ")
                throw new validator.LiskValidationError([...transactionErrors]);
            }
            
            unsignedTransactionC.asset = request_object;
            const signedTransaction = transactions.signTransaction(
                requestAssetSchema,
                unsignedTransactionC,
                networkIdentifier,
                credentials.passphrase,
            );
            
            // console.log(signedTransaction);
                
            const res = await client.transaction.send(signedTransaction);
           // console.log(res);
           
        } catch (error) {
            message.error("ERRORE");
        }
    }
    







    const executeOwn = async () => {
        
        try {
            const client = await getClient()
    
            const account: any = (await client.invoke('infos:getAccountNonce', {
                address: credentials.binaryAddress
            }))
    
            const request_object = {
                "merkleRoot":Buffer.from(merkleRoot, 'hex'),
                "mode" : "OWN"
            }
            
            const unsignedTransactionC: transaction = {
                moduleID: Number(1001),
                assetID: Number(1), // aka Token Transfer transaction
                fee: BigInt(10000000),
                nonce: BigInt(account.nonce),
                senderPublicKey: Buffer.from(credentials.publicKey,'hex'),
                asset: Buffer.alloc(0) ,
                signatures: [],
            };
            
            // Validate the transaction oject
            const transactionErrors = validator.validator.validate(transactionSchema, unsignedTransactionC);
            
            if (transactionErrors.length) {
                console.log(" ### VALIDATE KO ### ")
                throw new validator.LiskValidationError([...transactionErrors]);
            }
            
            unsignedTransactionC.asset = request_object;
            const signedTransaction = transactions.signTransaction(
                requestAssetSchema,
                unsignedTransactionC,
                networkIdentifier,
                credentials.passphrase,
            );
            
            console.log(signedTransaction);
    
            const res = await client.transaction.send(signedTransaction);
            
            
        } catch (error) {
            message.error("ERRORE");
        }
    }
    
    
    
    
    
    function handleChange(value: string) {
        console.log(`selected ${value}`);
        setChoose( value);
      }



      const openNotificationR = () => {
        notification.open({
          message: 'Stato richiesta',
          description:
            'La richiesta è stata effettuata correttamente.',
          onClick: () => {
            //console.log('Notification Clicked!');
          },
        });
      };

      
      function Submit (){
        //   if(choose === "visione")
        //     executeView();
        //   else
        //     executeOwn()
        
        setChoose("");
        openNotificationR();
        if(choose === "ownership")
            executeOwn();
        else
            executeView();
        
        
    }
    if(tipo === "explorer")
        return(
        
              
            
            <List.Item  style ={{marginTop: 20}}>
            <List.Item.Meta
                title={<Link to={getAssetPath(merkleRoot)}>{FileName} </Link>} 
            />
               <Select value={choose} defaultValue={choose} style={{ width: 120 }} onChange={handleChange}>
                    <Option value="visione">Visione</Option>
                    <Option value="ownership">Ownership</Option>
                    
                </Select>
              
                <Button onClick={Submit} type="primary">Richiedi  </Button>
                

        </List.Item>

          
    )
    else if (tipo === "myfile")
    return(
        <List.Item  style ={{marginTop: 20}}>
        <List.Item.Meta
            title={<Link to={getAssetPath(merkleRoot)}>{FileName} </Link>} 
        />
    

    </List.Item>
    )

    else
    return(
        <Popover content={content} title={"Dettagli richiesta: "+ FileName}>
        <List.Item  >
        <List.Item.Meta
            title={<Link to={getAssetPath(merkleRoot)}>{FileName} </Link>} 
        />
        
                   
      
        <Button type='primary'  onClick={responseOK}> Accetta </Button>
        <Button type='primary' style ={{marginLeft: 10}}> Rifiuta </Button>

    </List.Item>
    </Popover>
    )

}


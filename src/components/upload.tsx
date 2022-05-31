import React, { useState, useEffect } from 'react';
import NavBar1 from './NavBar1'
import { Layout, Form, Input, Button, message, Upload, Card} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import image from "./2705.png"
import { apiClient, transactions, validator } from "@liskhq/lisk-client";
import { createAssetSchema, transactionSchema } from "./schemas_neatbox";
import { getClient, networkIdentifier } from "./const_neatbox"
import { transaction, createForm } from "./types_neatbox";
import { hash } from '@liskhq/lisk-cryptography';
import { Link } from 'react-router-dom';



const { Content } = Layout;
const { Dragger } = Upload;




 

function UploadNeatbox ()  {

    const [file, setFile] = useState({
        fileU: "",
        name: "",
        size: Number(0)
    }
    );
   
    const [credentials, updateCredentials] = useState({
        address: "",
        binaryAddress: "",
        passphrase: "",
        publicKey: "",
        privateKey: ""
    });
   
    const [caricato, updateCaricato] = useState(false);

    useEffect(() => {
        let isMounted = true;
        if (isMounted)
        { // add conditional check
           const wallet_storage= localStorage.getItem("walletDetails");
           
           if(wallet_storage)
           {      
            let a  = JSON.parse(wallet_storage);
            if(a.address != "")
           {
            
            updateCredentials({
                address: a.address,
                binaryAddress: a.binaryAddress,
                passphrase: a.passphrase,
                publicKey: a.publicKey,
                privateKey: a.privateKey
            });
            
           
            return ;
        }
           }

        }
        
           return () => { isMounted = false }
          
    }, [])   
    const onFileChange = (event: any)  => { 
        // Update the state 
        
        setFile({ fileU: event.target.files[0], name: event.target.files[0].name, size: event.target.files[0].size });
        
      };
    

    
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };
    
  

    const onFinish = async (values: createForm) => {
        
        getClient().then(async (client: apiClient.APIClient) => {
                
                
                const account: any = (await client.invoke('infos:getAccountNonce', {
                    address: credentials.binaryAddress
                }))
                
              
                const formData = new FormData(); 
    
                // Update the formData object 
                formData.append( 
                  "myFile", file.fileU
                ); 
                

               
              //  console.log(credentials);
                const nome: Buffer = Buffer.from(file.name, 'utf8');
                const sha256: Buffer = hash(nome)
                const string_format = sha256.toString('hex');
               // console.log("Il nome è "+ file.name  )
               
                const s: Buffer = Buffer.from(values.secret, "utf-8");
                const shaM: Buffer = hash(s);
                const string_format2 = shaM.toString('hex');
               // console.log("Il secret è "+ values.secret  )7

                const sum = string_format + string_format2;
                const sumB: Buffer = Buffer.from(sum,'utf-8');
                const sumBsha: Buffer = hash(sumB);
                const string_merkleroot = sumBsha.toString('hex');

                //console.log("Il  merkleroot è "+ string_merkleroot  )
                const create_object = {
                    "fileName":file.name, // INPUT FORM
                    "fileSize":file.size, // fileName.length
                    "fileHash":sha256, // sha256(filename)
                    "merkleRoot":sumBsha, // sha256(fileHash + secret)
                    "merkleHeight":0, //0
                    "secret":values.secret // INPUT FORM
                }
                const unsignedTransactionC: transaction = {
                    moduleID: Number(1001),
                    assetID: Number(0), // aka Token Transfer transaction
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
                

                unsignedTransactionC.asset = create_object;
                const signedTransaction = transactions.signTransaction(
                    createAssetSchema,
                    unsignedTransactionC,
                    networkIdentifier,
                    credentials.passphrase,
                );
                
                // console.log(signedTransaction);
        
                try {
                    const res = await client.transaction.send(signedTransaction);
                    updateCaricato(true);  
                } catch (error) {
                    console.log(error);
                    message.error("Upload non riuscito");
                }
                
               // console.log(res);
                
            
        })
    }

 if(!caricato)
    return (
        <div >
            <NavBar1/>
            
           
           <Card style={{marginTop: 40}} headStyle={{textAlign: 'center', alignItems: "center"}} bordered = {false}  title="Upload a file in the storage:">
            
            <p style={{textAlign: 'center'}}>Per caricare un file è necessario inserire un secret (parola segreta) che verrà utilizzato per la cifratura del file.</p>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                >       
                    <Form.Item
                    label="Inserisci Secret"
                    name="secret"
                    rules={[{ required: true, message: 'Please input the secret!' }]}
                    >
                <Input />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }} >
                <input style={{alignSelf: "center"}}  type='file' required={true}  onChange={onFileChange}/>
                </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
             <Button  type="primary" htmlType="submit">
                 Submit
                </Button>
                <p>*per effettuare l'upload è necessario di disporre di 0,1 crediti</p>
            </Form.Item>
        </Form>
        </Card>
        
           
       
        </div>
    );
    
    else
    return (
        <div >
            <NavBar1/>
            
            <div style={{marginTop: 80, textAlign: "center", justifyContent: "center"}} >
            <img style={{width: 100, height: 100}} src={image} alt="Logo" />
            <h2 style={{marginTop: 39}}>ASSET CARICATO CORRETTAMENTE</h2>
            <p> Potrebbero passare alcuni secondi prima di visualizzarlo</p>
            <Link to="/"> 
            <Button> Torna alla home</Button>
            </Link>
            </div>
        
        
           
       
        </div>
    );
}



export default UploadNeatbox;
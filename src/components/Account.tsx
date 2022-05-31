import { cryptography , passphrase, transactions} from '@liskhq/lisk-client';

import React, { useState, useEffect } from 'react';
import NavBar1 from './NavBar1';
import { Layout, Button, message, Collapse, Card, Row, Typography, List, Spin} from 'antd';
import { useAuth0, User } from '@auth0/auth0-react';
import ButtonGroup from 'antd/lib/button/button-group';
import { fetchRequest, getClient } from './const_neatbox';
import { listaAssetAddress, myFiles, Wallet } from './types_neatbox';
import ComponentList from './ComponentList';



const { Panel } = Collapse;
const { Paragraph } = Typography;

const { Content } = Layout;



function Account (props: User) {
    
  const [credentials, updateCredentials] = useState({
        address: "",
        binaryAddress: "",
        passphrase: "",
        publicKey: "",
        privateKey: ""
    });

    const [account, setAccount] = useState(null)

    const [generate, updateGenerate] = useState(false)
    const [balance, setBalance] = useState(0)
    let files: myFiles[] = [] ;
    const [file, setFile] = useState({
       prova : files
    });

    const [isLoading, updateLoading] = useState(true)
    const { logout , isAuthenticated, error} = useAuth0();

    let utente: User = props.utente;
    let a = localStorage.getItem("utente");
    if(utente)
        localStorage.setItem("utente", JSON.stringify(utente));
    else
     {
         utente=JSON.parse(a ? a : "");
         console.log(error);
     }
           
       
       
    let ah: listaAssetAddress = {allowed: [],myFiles: [], pending: [], requested_to_me: []};
    async function Sinc(pr: any){
        try {
            ah= await fetchRequest(pr.binaryAddress);
        } catch (error) {
            return ah;
        }
       
        return ah;
    }
   
    
    useEffect(() => {
       
    
         // add conditional check
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
            updateCredentials((state) => {
                
                const fetchdata = async () => {
                    setFile({prova: (await Sinc(state))?.myFiles})
                    
                   }
                   
           
                   fetchdata();
                   return state
              });
            updateGenerate(true);
            updateLoading(false);
        }
           }

           const updateB = async () => {
            try {
                const client = await getClient();
                const account: any = (await client.invoke('infos:getAccountNonce', {
                  address: credentials.binaryAddress
              }))
            setBalance(Number(account.balance) / Math.pow(10,8) )
            } catch (err) {
              setBalance(0);
            }
          };
      
          updateB();
      
          const interval = setInterval(() => {
            updateB();
          }, 1000);
      
          return () => {
            clearInterval(interval);
            
          };
        
          
    }, [isLoading, balance])    

    const downloadFile = (data: any, fileName: string, fileType: string ) => {
        // Create a blob with the data we want to download as a file
        const blob = new Blob([data], { type: fileType })
        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        const a = document.createElement('a')
        a.download = fileName
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
      }

      const exportToJson = () => {
        downloadFile(
        JSON.stringify(credentials),
          'wallet details.json',
          'text/json',
        )
      }
    
    async function newCredentials () {
        
        await generateC();
        
    };

   async function generateC(){
        updateGenerate(false);
        updateLoading(true);
        const pass =  passphrase.Mnemonic.generateMnemonic();
        const keys =  cryptography.getPrivateAndPublicKeyFromPassphrase(pass);
         updateCredentials({
            address:  cryptography.getBase32AddressFromPassphrase(pass),
            binaryAddress:  cryptography.getAddressFromPassphrase(pass).toString("hex"),
            passphrase: pass,
            publicKey:  keys.publicKey.toString("hex"),
            privateKey:  keys.privateKey.toString("hex")
        })
        updateCredentials((state) => {
            localStorage.setItem("walletDetails", JSON.stringify(state)) // "React is awesome!"
            updateGenerate(true);
            
            try {
                console.log("R$IORHB$NHUkl")
                crediti(state.binaryAddress);
            } catch (error) {
                console.log(error);
            }
            
            
           
            return state;
          });
         
          updateLoading(false);
          return;
   
     
    }

    const crediti = async (ina: string) => {
        const client = await getClient();
        const input = {
            address: ina
          };
        
          try {
            console.log("CJIEIWPWop")
            await client.invoke('faucet:fundTokens', input);
            message.success("Ti sono stati accreditati 10 token di benvenuto")
            return;
    
          } catch (error) {
              console.log(error);
          }
        
                };

    async function importWallet () {
        const passphrase = prompt(`Please enter your passphrase`)

        if(!passphrase) {
            message.error(`No passphrase specified`)
            return
        }

        const wallet = createCredentials(passphrase);
        updateLoading(true);
        message.success(`Wallet successfully imported from the passphrase`);
        updateCredentials(wallet)
        localStorage.setItem("walletDetails", JSON.stringify(wallet)) // "React is awesome!"
    }

    function createCredentials(inputPassphrase?: string): Wallet {
        const pass = inputPassphrase || passphrase.Mnemonic.generateMnemonic();
        const keys = cryptography.getPrivateAndPublicKeyFromPassphrase(pass);
      
        const wallet: Wallet = {
          address: cryptography.getBase32AddressFromPassphrase(pass),
          binaryAddress: cryptography.getAddressFromPassphrase(pass).toString('hex'),
          passphrase: pass,
          publicKey: keys.publicKey.toString('hex'),
          privateKey: keys.privateKey.toString('hex'),
        };

        return wallet;
    }

    
    if(generate)
    return (
        <div>
            <NavBar1/>
        
        <div style={{marginTop: 60.5, display:'flex', flexDirection:"column", alignItems: "center"}}> 
            <div style={{width: 600}} >
     
            <Card title="Profile">
           
                <img style={{borderRadius: 70, padding: 2, border: 5, width:100}} src={utente.picture} />
                <h5 style={{padding: 2}}>{utente.name}</h5>
           
            <div style={{display: 'flex', marginRight: 110, marginTop: -100, flexDirection: "column", alignItems: "flex-end" }}>
            
            <div  style={{justifyContent: "initial"} }>
                <p>Email:   {utente.email}</p>
                <p >Nickname: {utente.nickname}</p>
                <p> Locale:  {utente.locale}</p>
                </div>
            </div>
            </Card>
            </div>
            <Card style={{marginTop: 60.5, display:'flex', flexDirection:"column", alignItems: "center"}} title="Wallet">
            
            <h4>Address: <p>{(credentials.address)}</p></h4>
            <h4> Passphrase: <p>{credentials.passphrase}</p></h4>
            
            <Row style={{justifyContent: "center"}}  >
                <ButtonGroup>
                    <Button onClick={newCredentials}> Crea Wallet </Button>
                    <Button onClick={importWallet} > Importa Wallet </Button>
                    <Button onClick={exportToJson}> Download Credenziali</Button>
                </ButtonGroup>
            </Row>
            </Card>

            <Card style={{marginTop: 30}}>
                <p> Crediti: {balance}</p>
            </Card>
         
         {isLoading ? <Spin /> : 
         <Card style={{marginTop: 50, alignItems: "center"}} title="I miei Asset">
         <List
            className={"UWG"}
            bordered
            style ={{ width: 470}}
            dataSource={file.prova}
            pagination={{
                onChange: page => {
                 
                  
                },
                pageSize: 5,
              }}
              renderItem={item => (
                
                    <ComponentList mode="" loading="" addressR='' merkleRoot={item.merkleRoot.toString()} FileName={item.fileName} tipo="myfile"/>
                   
              )}
                >
           
            </List>
            </Card>}
            
         
        
      
        </div>
        </div>
    );
    else
    return (
        <div>
            <NavBar1/>
        
        <div style={{marginTop: 0.5, display:'flex', flexDirection:"column", alignItems: "center"}}> 
            <div style={{width: 600}} >
     
            <Card title="Profile">
           
                <img style={{borderRadius: 70, padding: 2, border: 5, width:100}} src={utente.picture} />
                <h5 style={{padding: 2}}>{utente.name}</h5>
           
            <div style={{display: 'flex', marginRight: 110, marginTop: -100, flexDirection: "column", alignItems: "flex-end" }}>
            
            <div  style={{justifyContent: "initial"} }>
                <p>Email:   {utente.email}</p>
                <p >Nickname: {utente.nickname}</p>
                <p> Locale:  {utente.locale}</p>
                </div>
            </div>
            </Card>
            </div>
            <Card style={{marginTop: 60.5, display:'flex', flexDirection:"column", alignItems: "center"}} title="Wallet">
            <Row>
                <ButtonGroup>
                    <Button onClick={newCredentials}> Crea Wallet </Button>
                    <Button onClick={importWallet} > Importa Wallet </Button>
                </ButtonGroup>
            </Row>
            </Card>
            
              
        </div>
        </div>
    );
}
export default Account;
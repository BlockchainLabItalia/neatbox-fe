import React, { useState, useEffect } from 'react';
import NavBar1 from './NavBar1';
import { Layout, Collapse,Typography, List, Spin,notification, Select, Card, Radio} from 'antd';
import { fetchRequest } from './const_neatbox';
import { listaAssetAddress, allowed, pending, requested_to_me } from './types_neatbox';
import ComponentList from './ComponentList';


const { Panel } = Collapse;
const { Paragraph } = Typography;
const { Option } = Select;

const { Content } = Layout;

function Gestione_Richieste () {


  const openNotificationE = () => {
    notification.open({
      message: 'ERRORE!',
      description:
        'Il tuo binary address non sembra essere valido',
      onClick: () => {
       // console.log('Notification Clicked!');
      },
    });
  };

  

  const [credentials, updateCredentials] = useState({
        address: "",
        binaryAddress: "",
        passphrase: "",
        publicKey: "",
        privateKey: ""
    });

    let rp: pending[] = [] ;
    let a: allowed[] = [] ;
    let rt: requested_to_me[] = [];
    const [file, setFile] = useState({
       r_pending : rp,
       r_allowed : a,
       r_tome : rt
    });

    const [isLoading, updateLoading] = useState(true);
    const [errore, updateErrore] = useState(false);
    const [scelta, setScelta ] = useState("richiesteS");
   
    let lista_address: listaAssetAddress = {allowed: [],myFiles: [], pending: [], requested_to_me: []};
    async function Sinc(pr: any){
     
        
      try {
        
        lista_address= await fetchRequest(pr.binaryAddress);  //credentials.binaryaddress
      } catch (error) {

        updateErrore((state) => {
        
        if(!state)
        {
          
          console.log(errore);
        openNotificationE();
        }
     
             return state
        })
        updateErrore(true);
        return lista_address;
      }  
      
        return lista_address;
    }
   
    
    useEffect(() => {
      const wallet_storage= localStorage.getItem("walletDetails");
           
      if(wallet_storage)
      {      
       let wallet_parse  = JSON.parse(wallet_storage);
       if(wallet_parse.address != "")
      {
       updateCredentials({
           address: wallet_parse.address,
           binaryAddress: wallet_parse.binaryAddress,
           passphrase: wallet_parse.passphrase,
           publicKey: wallet_parse.publicKey,
           privateKey: wallet_parse.privateKey
       });
     
      
      
   }

      }
        
      updateCredentials((state) => {

        const fetchdata = async () => {
          setFile({r_pending: (await Sinc(state))?.pending,r_allowed: (await Sinc(state))?.allowed, r_tome:  (await Sinc(state))?.requested_to_me}) 
          updateLoading(false);}
 
 
         fetchdata();             // note mutable flag
   
           return state
      });   

    }, [isLoading])        
   

    function handleChange(value: string) {
      console.log(`selected ${value}`);
      setScelta(value);
    }
    

    return (
      <div>
        <NavBar1/>
      
        <div style={{marginTop: 0.5, display:'flex', flexDirection:"column", alignItems: "center"}}> 
            
        <Card  style={{marginTop: 50, textAlign: "center" }}>

        <h3 style={{textAlign: "center"}} >Seleziona dal menu a tendina quali richieste vuoi visualizzare e/o gestire</h3>

        <Select  defaultValue="richiesteS" style={{ width: 230 }} onChange={handleChange}>
              <Option value="richiesteS">Richieste effettuate in sospeso</Option>
              <Option value="accettate">Richieste effettuate Accettate</Option>
              <Option value="tome">Richieste ai miei Asset</Option>
        </Select>
        </Card>
        
         {isLoading ? <Spin/> :
         scelta!=="richiesteS" ? null :
         <div style={{marginTop: 50, textAlign: "center" }}>
            <h3>RICHIESTE EFFETTUATE IN SOSPESO</h3>
         <List
            className={"UWG"}
            bordered
            style ={{ width: 600}}
            dataSource={file.r_pending}
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
            </div>
            
            }
         
         {isLoading ? <Spin/> : 
         
         scelta!=="accettate" ? null :
         <div style={{marginTop: 50, textAlign: "center" }}>
            <h3>RICHIESTE EFFETTUATE ACCETTATE</h3>
         <List
            className={"UWG"}
            bordered
            style ={{ width: 600}}
            dataSource={file.r_allowed}
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
            </div>
            }

{isLoading ? <Spin/> :

scelta!=="tome" ? null :
         <div style={{marginTop: 50, textAlign: "left" }}>
            <h3>RICHIESTE AI MIEI ASSET</h3>
         <List
            className={"UWG"}
            bordered
            style ={{ width: 600}}
            dataSource={file.r_tome}
            pagination={{
                onChange: page => {
                  
                  
                },
                pageSize: 5,
              }}
              renderItem={item => (
                
                    <ComponentList mode= {item.mode.toString()} loading={updateLoading} addressR={item.address.toString()} merkleRoot={item.merkleRoot.toString()} FileName={item.fileName} tipo="gest"/>
                   
              )}
                >
           
            </List>
            </div>
            }
      
        </div>
        </div>
    );
}
export default Gestione_Richieste;
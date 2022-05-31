import React, { useState, useEffect } from 'react';
import { getAssetPaged, getClient, networkIdentifier } from "./const_neatbox"
import { registeredAssets, digitalAsset, transaction } from "./types_neatbox";
import { Layout, Input, Button, Divider, List,Select, Radio, Card, notification, message , Pagination} from 'antd';
import Loading from './Loading';
import ComponentList, { getAssetPath } from './ComponentList';
import NavBar1 from './NavBar1'
import { useAuth0 } from '@auth0/auth0-react';
import { transactions, validator } from '@liskhq/lisk-client';
import { requestAssetSchema, transactionSchema } from './schemas_neatbox';
import { Link } from 'react-router-dom';

const { Content} = Layout;
const { Search } = Input;

const { Option } = Select;




const BrowseAssets = () => {

    let array_vuoto: digitalAsset[] = [] ;
    const { isAuthenticated, user } = useAuth0();
    const [file, setFile] = useState({
       array_asset : array_vuoto
    });
    
    const [checked, setchecked] = useState(0);
    let pageC=1;
    const [isLoading, setIsLoading] = useState(true);
    
    const [choose, setChoose] = useState("");
   
    const [nAsset, setNAsset] = useState(1);
    const [isSorting, setIsSorting] = useState(false);

    const [filtroNome, setFiltroNome] = useState(false);
    const [credentials, updateCredentials] = useState({
      address: "",
      binaryAddress: "",
      passphrase: "",
      publicKey: "",
      privateKey: ""
  });

    function onChange(i: number){
     setchecked(i)
   }
    
    const [nome, setNome] = useState("");
       
    
async function getFiles (elements: number, page: number){
    
  const client = await getClient()


  const files: registeredAssets = await getAssetPaged(elements,page);
  setFile({array_asset: files.registeredAssets})
  setNAsset((await client.invoke('digitalAsset:getAmountOfDigitalAssets')));
  
  

}

async function getFilesNome (elements: number, page: number){
    
  const client = await getClient()


  const files: registeredAssets = await getAssetPaged(elements,page);
  setFile({array_asset: files.registeredAssets})
  setNAsset((await client.invoke('digitalAsset:getAmountOfDigitalAssets')));
  
  return files;

}
    useEffect(()=>{
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
        }}
       
        const fetchdata = async () => {
         await getFiles(5,1);
         setIsLoading(false);}


        fetchdata();
        
    },[isLoading])

    async function ordineND(){
        await setIsSorting(true);
        await file.array_asset.sort((a,b) => (a.fileName.split(".",2)[0].localeCompare( b.fileName.split(".",2)[0])));
        setIsSorting(false);
    }

 
    async function handleSearch (value: string) {
        await setIsSorting(true);
        
        if(value.length === 0)
        { setFile({array_asset: (await getFilesNome(5,pageC)).registeredAssets})
       return}
        await file.array_asset.sort((a, b) =>
        b.fileName.split(".",2)[0].toLowerCase().search(value.toLocaleLowerCase()) - a.fileName.split(".",2)[0].toLowerCase().search(value.toLocaleLowerCase())
          
    );
        
        setIsSorting(false);
      };
    
      const handleChange = (value: string) => {
        
        setNome( value );
      
      };

      
    function handleChangeS(value: string) {
      console.log(`selected ${value}`);
      setChoose( value);
    }

    function cambioPagina(page : number) {
      pageC = page
      getFiles(5,pageC);
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


    const executeView = async () => {
    
      try {
          const client = await getClient()
  
          const account: any = (await client.invoke('infos:getAccountNonce', {
              address: credentials.binaryAddress
          }))
  
        
         
          console.log(file.array_asset[checked].transactionID);
          const request_object = {
              "merkleRoot": Buffer.from(file.array_asset[checked].merkleRoot.toString(), 'hex'),
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
        console.log(error);
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
              "merkleRoot": Buffer.from(file.array_asset[checked].merkleRoot.toString(), 'hex'),
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
        console.log(error);
          message.error("ERRORE");
      }
  }
  




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


  if(!file.array_asset)
    return(
      <div >
      <NavBar1/>
      <div style={{marginTop: 0.5, display:"flex", flexDirection: "column", alignItems: "center"}}>
          
          <h3 >Browse Digital Assets</h3>
          <Divider />
          
          <List
          className={"UWG"}
          bordered
          style ={{ width: 600}}
          dataSource={file.array_asset}
          pagination={{
              onChange: page => {
                
                
              },
              pageSize: 5,
            }}
            renderItem={item => (
           
                <ComponentList mode="" loading="" addressR='' merkleRoot={""} FileName={""} tipo="myfile"/>
                
            )}
              >
         
          </List>
      </div>
      </div>
    );

  if(isAuthenticated)
    return isLoading || isLoading ? (<Loading/>) : (
      <div >
        <NavBar1/>
        <div style={{marginTop: 20, display:"flex", flexDirection: "column", alignItems: "center"}}>
           
            <h3 >Browse Digital Assets</h3>
            <div style={{marginTop: 29, alignItems: "left"}}> 
         <Card>   
            <Button onClick={ordineND}> Ordina per Nome Ascendente</Button>
            
            <Select
        showSearch
        
        
        placeholder={"Cerca per nome"}
        defaultActiveFirstOption={false}
        style={{marginLeft: 30, width: 200}}
        showArrow={false}
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
      ></Select>
      </Card>
      <Card style={{marginTop: 30}}>   
            {
                file.array_asset.map((option,i)=>{
                    if(credentials.binaryAddress != option.owner.toString())
                      return <label style={{display:"flex", flexDirection: "column", alignItems: "left"}} key={option.fileName}>
                             
                         <input 
                                    type="radio"
                                    style={{marginTop: 20}} 
                                    checked={checked == i? true: false}
                                    key={option.fileName}
                                    onChange={onChange.bind(this,i)} 
                                    value={option.fileName} />
                                <Link style={{ alignContent: "left" , textJustify:"initial", width:100, marginLeft: 30, alignItems: "center" , justifyItems: "left"}} to={getAssetPath(option.merkleRoot.toString())}>
                                <p style={{color: "black", marginTop: -20}}>{option.fileName}  </p>
                              </Link>
                              
                            </label>
                    else
                    return <label style={{display:"flex", flexDirection: "column", alignItems: "left"}} key={option.fileName}>
                             
                        
                             <Link to={getAssetPath(option.merkleRoot.toString())}>
                                <p style={{textAlign: "left", color: "black", marginTop: 20, marginLeft: 28}}>{option.fileName}  </p>
                                </Link>
                            </label>
                })
            }
           <Pagination defaultCurrent={1} onChange={page => cambioPagina(page)} pageSize={1} total={Math.ceil(nAsset/5)} />
           </Card>
             <Select aria-required= {true} style={{ width: 130, marginLeft: 300, marginTop: 10}} onChange={handleChangeS}>
                    <Option value="visione">Visione</Option>
                    <Option value="ownership">Ownership</Option>
                    
                </Select>
              
                <Button onClick={Submit}  type="primary">Richiedi  </Button>
              
        </div>
        </div>
        </div>
    );

    else
    return isLoading || isLoading ? (<Loading/>) : (
      <div >
      <NavBar1/>
      <div style={{marginTop: 20, display:"flex", flexDirection: "column", alignItems: "center"}}>
         
          <h3 >Browse Digital Assets</h3>
          <div style={{marginTop: 29, alignItems: "center"}}> 
       <Card>   
          <Button onClick={ordineND}> Ordina per Nome Ascendente</Button>
          
          <Select
      showSearch
      
      
      placeholder={"Cerca per nome"}
      defaultActiveFirstOption={false}
      style={{marginLeft: 30, width: 200}}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
    ></Select>
    </Card>
    <Card style={{marginTop: 30}}>   
          {
              file.array_asset.map((option,i)=>{
                  if(credentials.binaryAddress != option.owner.toString())
                    return <label style={{display:"flex", flexDirection: "column", alignItems: "left"}} key={option.fileName}>
                           
                       
                              <Link style={{ alignContent: "center" , textJustify:"initial", width:100, marginLeft: 30, alignItems: "center" , justifyItems: "left"}} to={getAssetPath(option.merkleRoot.toString())}>
                              <p style={{color: "black", marginTop: 20}}>{option.fileName}  </p>
                            </Link>
                            
                          </label>
                  else
                  return <label style={{display:"flex", flexDirection: "column", alignItems: "left"}} key={option.fileName}>
                           
                      
                           <Link to={getAssetPath(option.merkleRoot.toString())}>
                              <p style={{textAlign: "center", color: "black", marginTop: 20, alignItems: "left"}}>{option.fileName}  </p>
                              </Link>
                          </label>
              })
          }
         <Pagination defaultCurrent={1} onChange={page => cambioPagina(page)} pageSize={1} total={Math.ceil(nAsset/5)} />
         </Card>
          
      </div>
      </div>
      </div>
    );
}

export default BrowseAssets;
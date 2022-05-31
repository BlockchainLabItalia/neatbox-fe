//@ts-ignore
import * as React from 'react'
import { useState, useEffect } from 'react'
import { Divider, Timeline, Card, Row , Col, Spin } from 'antd'
import { useParams } from 'react-router-dom'

import { digitalAsset, digitalAssetHistory, registeredAssets } from './types_neatbox'
import {fetchAssetByM, getAssetDet, getAssetHistory} from './const_neatbox'
import NavBar1 from './NavBar1'



const Asset = () => {

    const [asset, setAsset] = useState<digitalAsset>()
    const [storia, setStoria] = useState<digitalAssetHistory>()
    const [isLoading, updateLoading] = useState(true)
    const [precedente, updatePrecedente] = useState<digitalAssetHistory[]>([])
    //const [history, setHistory] = useState<HistoryResult[] | null>(null)
    let a: digitalAssetHistory[] = [];

    const { id } = useParams<{id: string}>()

    async function updateAsset() {
        if(id){
        const asset = await fetchAssetByM(id);
        const history = await getAssetHistory(id);
        const det = await getAssetDet(id);
        let previous = history.previousVersion;
        
     while(previous != undefined)
        {
          console.log("SONO QUA");
          precedente.push(previous);
          console.log(precedente);
          previous = previous.previousVersion;
        }
        console.log(history);
        setStoria(history);
    
        setAsset(asset);
      
        updateLoading(false);
        }
    }

    
    useEffect(() => {
        updateAsset()
        
    }, [id])    

    return (
      <div>
      <NavBar1/>
     { isLoading ? <Spin /> : 
      
        <div style={{marginTop: 50, display:"flex", flexDirection: "column", alignItems: "center"}}>
            <h4 >Digital Asset</h4>
            

          <Card title={"Description"} style={{ width: 500 }}>
          <Row >
                <Col span={20}>Filename: {asset?.fileName}</Col>
                
              </Row>
              <Row >
                <Col span={20}>Filesize: {asset?.fileSize}</Col>
                
              </Row>
              <Row >
                <Col span={20}>Owner: {asset?.owner.toString()}</Col>
                
              </Row>
              <Row >
                <Col span={20}>Transaction ID: {asset?.transactionID.toString()}</Col>
                
              </Row>
        </Card>  
         
          <Card title={"Asset History"} style={{ width: 400, marginTop: 39 }}>
          <Timeline>

          <Timeline.Item> Owner: {asset?.owner.toString()}</Timeline.Item>
          {storia?.requests.map(item => (
            
            <Timeline.Item>Request From: {item.address}, Mode : {item.mode}, Status: {item.status}</Timeline.Item>

           )
            
            
            )}

    {   
        console.log(precedente)}
          {  
          precedente.forEach(item =>{
            {console.log(item.owner)}

             <Timeline.Item>{item.owner}</Timeline.Item>
             // <Timeline.Item>Own: {item.owner}</Timeline.Item>
            {item.requests.map(item2 => {
              <Timeline.Item>From: {item2.address}, Mode: {item2.mode}, Status: {item2.status}</Timeline.Item>
            })}
          })
          }

      
          
          </Timeline>
          </Card> 

         
        </div>
}
        </div>
          
    )
}


export default Asset;
import React from "react";
import {
    BrowserRouter as Router,
    
    Route,
    Routes
} from "react-router-dom";
import "regenerator-runtime/runtime.js";
import Gestione_Richieste from './components/Gestione_Richieste';
import Account from './components/Account';
import UploadNeatbox from './components/upload';
import BrowseAssets from './components/BrowseAssets';
import Asset from './components/Asset';
import { useAuth0 } from "@auth0/auth0-react";



export function App (){
   
const { user } = useAuth0();

    return (
        <Router>
            
                <Routes>
                
                    <Route path="/" element={ <BrowseAssets/>}>
                        
                               
                    </Route>
                    <Route path="/gestioneRichieste" element={ <Gestione_Richieste />}>
              
                       
                    </Route>
                    <Route path="/account" element={<Account utente={user}/>}>
                        
                
                       
                    </Route>
                    <Route path="/upload" element={ <UploadNeatbox/>}>
                    
                       
                    </Route>
                    <Route path="/browse/:id" element={ <Asset/>}>
                       
                    </Route>
                </Routes>
           
        </Router>
    );
}

export default App;
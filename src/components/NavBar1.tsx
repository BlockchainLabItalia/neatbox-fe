
import { Menu, Spin } from 'antd';
import 'antd/dist/antd.css';
import {
      
    
    Link
} from "react-router-dom";
import {
    HomeOutlined,
    ProfileOutlined,
    SendOutlined
  } from '@ant-design/icons';
import { useAuth0 } from "@auth0/auth0-react";
import { link } from 'fs';




function NavBar1(){
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user } = useAuth0();
 

  async function handleMenuClick(item: any) {
    switch (item.key) {
      case "login":
       await loginWithRedirect();
       
        
        break;
      case "logout":
       await logout({ returnTo: window.location.origin });
       localStorage.removeItem("walletDetails");
       localStorage.removeItem("utente");
        break;
      default:
    }
  };


return(

      <div>
           <a href='/' style={{textAlign: "left" , height: 0, marginLeft: 65, justifyContent: "start", color: "black"}}>Neatbox</a>
         
      <Menu  key="Menu" mode="horizontal"  style={{display: "flex", flexShrink: 0 , justifyContent: "end", marginTop: -25}}>
                            
                            <Menu.Item key="1" > <li><Link to="/"> {<ProfileOutlined/>} Esplora Asset</Link></li></Menu.Item>
                            <Menu.Item disabled={isAuthenticated ? false : true} key="3"> <li><Link to="/gestioneRichieste"> {<ProfileOutlined />} Gestione Richieste</Link></li></Menu.Item>
                            {/* <Menu.Item key="4"> <li><Link to="/send-hello">{<SendOutlined />}  Send Hello</Link></li></Menu.Item> */}
                          
                            <Menu.Item disabled={isAuthenticated ? false : true} key="6">  <li><Link to="/account">{<ProfileOutlined />} Profilo</Link></li></Menu.Item>
                            <Menu.Item disabled={isAuthenticated ? false : true} key="8" > <li><Link to="/upload"> {<ProfileOutlined/>} Upload</Link></li></Menu.Item>
                            <Menu.Item onClick={handleMenuClick} key={isAuthenticated ? "logout" : "login"}>
                  {isLoading ? <Spin /> : isAuthenticated ? "Logout" : "Login"}
                </Menu.Item>
                </Menu>
              
                </div>         
);
}


export default NavBar1;

function useHistory() {
  throw new Error('Function not implemented.');
}


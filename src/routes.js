import { BrowserRouter, Switch, Route } from "react-router-dom";

import Layout from "./components/Layout/index";

import Main from "./pages/Main/index";
import Login from "./pages/Login/index";
import SignUp from "./pages/SignUp/index";
import NotFound from "./pages/NotFound/index";

import ControlPanel from "./pages/private/ControlPanel/index";


import { AuthProvider } from "./context/authContext";

const Routes = () => (
  <AuthProvider>
    <BrowserRouter key={"browserRouter"}>
      <Layout>
        <Switch key={"SwitcherRouter"}>
          <Route key={"pag1"} exact path="/" component={Main} />
          <Route key={"pag2"} exact path="/login" component={Login} />  
          <Route key={"pag3"} exact path="/cadastro" component={SignUp} /> 
          <Route key={"pag4"} path="/control" component={ControlPanel} /> 
          <Route key={"RDefault"} path="*" component={NotFound} />
          
        </Switch>
      </Layout>
    </BrowserRouter>
  </AuthProvider>

  );
  
  export default Routes;
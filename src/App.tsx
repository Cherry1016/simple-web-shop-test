import React, { useReducer } from 'react';
import ProductCatalog from "./Page/ProductCatalog";
import BasketSummary from "./Page/BasketSummary";
import { TopBar } from "./components";
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'
import { AppContext, AppReducer } from "./Context/AppContext";
import "./css/App.scss"
import './css/ProductCatalog.scss';
import './css/BasketSummary.scss';

function App() {
  const [state, dispatch] = useReducer(AppReducer, {products: {}});

  return (
    <div className="App">
      <AppContext.Provider value={[state, dispatch]}>
        <BrowserRouter>
          <div className="App">
            <Switch>
              <Route exact path="/basket-summary" render={(props) => (
                <TopBar {...props}>
                  <BasketSummary {...props} />
                </TopBar>
              )} />
              <Route path="/:id?" render={(props) => (
                <TopBar {...props}>
                  <ProductCatalog {...props} />
                </TopBar>
              )} />
            </Switch>
          </div>
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;

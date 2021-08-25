import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import GraphiQL from "graphiql";

function App(props: any) {
  function graphQLFetcher(graphQLParams: any) {
    return fetch(props.subgraphUri, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphQLParams),
    }).then(response => response.json());
  }

  const [route, setRoute] = useState("");
  useEffect(() => {
    console.log("SETTING ROUTE", window.location.pathname);
    setRoute(window.location.pathname);
  }, [window.location.pathname]);

  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Switch>
            <Route path="/">
              <div style={{ height: 500, marginTop: 32, textAlign: "left" }}>
                <GraphiQL fetcher={graphQLFetcher} docExplorerOpen={true} query={EXAMPLE_QUERY} />
              </div>
            </Route>
          </Switch>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;

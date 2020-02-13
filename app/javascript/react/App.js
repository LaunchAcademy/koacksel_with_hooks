import React from 'react';
import { BrowserRouter, Route, Switch} from 'react-router-dom';
import ChatContainer from './containers/ChatContainer';
import ChatIndexContainer from './containers/ChatIndexContainer';

const App = props => {
  return(
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={ChatIndexContainer}/>
        <Route exact path="/chats" component={ChatIndexContainer}/>
        <Route exact path="/chats/:id" component={ChatContainer}/>
      </Switch>
    </BrowserRouter>
  )
}

export default App;

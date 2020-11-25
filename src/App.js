import React, { PureComponent } from 'react';
import { Route, Switch } from 'react-router';
import './App.css';
import Login from './components/Login/Login';
import Home from './views/Home/Home';
import { ThemeProvider } from '@material-ui/styles';
import theme from './theme';

class App extends PureComponent {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/" exact component={Home} />
        </Switch>
      </ThemeProvider>
    )
  }
}

export default App

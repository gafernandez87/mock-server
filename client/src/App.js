import React from 'react';
import './App.css';
import "antd/dist/antd.css";
import { Layout, Menu } from 'antd';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import MockList from './components/MockList';
import EndpointList from './components/EndpointList';
import {Link} from 'react-router-dom'

const { Header, Content } = Layout;

class App extends React.Component {

  render() {
    return (
      <Router>
        <Header className="header">
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item onClick={() => {}} key="1">
              <Link to="/">Home</Link>
            </Menu.Item>
          </Menu>
        </Header>
          
          <Layout style={{ padding: '20px' }}>
            <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>

                <Route exact path="/" render={ (props) => {return <MockList {...props} /> }} />
                <Route exact path="/mocks" render={ (props) => {return <MockList {...props} /> }} />
                <Route exact path="/mocks/:mock_id/endpoints" render={ (props) => {return <EndpointList {...props} /> }} />
                {/* <Route path="/*" render={ () => {return <h2>404 NOT FOUND</h2>}} /> */}
            
            </Content>
          </Layout>
      </Router>

    )
  }
}


export default App;

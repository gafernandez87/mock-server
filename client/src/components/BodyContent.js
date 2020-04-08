import React from 'react'
import MockList from './MockList';
import EndpointList from './EndpointList';
import axios from 'axios';
import Constants from '../config/Constants'
import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'

class BodyContent extends React.Component{

  showMock = (mockId, name, prefix) => {
      axios.get(`${Constants.API_URL}/mocks/${mockId}/endpoints`)
      .then(response => {
        this.setState({mock_id: mockId, mock_name: name, mock_prefix: prefix})
        this.props.updateEndpointList(response.data)
        this.props.changePage("endpoints")
      })
      .catch(err => {
        // TODO: "Handle this case"
        console.error(err)
        this.props.changePage("mocks")
      })
  }

  getMockId = () => {
    return this.state.mock_id
  }

  getMockName = () => {
    return this.state.mock_name
  }

  getMockPrefix = () => {
    return this.state.mock_prefix
  }

  renderBody = (page) => {
      switch(page){
          case "mocks":
            return (<MockList 
                list={this.props.mockList} 
                showMock={this.showMock} 
                deleteMock={this.props.deleteMock} 
                cloneMock={this.props.cloneMock} 
                refreshMockList={this.props.refreshMockList}
                />)

          case "endpoints":
            return (<EndpointList 
                list={this.props.endpointList} 
                refreshEndpointList={this.props.refreshEndpointList}
                getMockId={this.getMockId}
                getMockName={this.getMockName}
                getMockPrefix={this.getMockPrefix}
                changePage={this.props.changePage}
                />)
          default:
            return (<div>You should not be here... RUN!</div>)
      }
  } 

  render(){
    return(

      <Router>
        <Route exact path="/mocks" render={ (props) => {return <MockList {...props} /> }} />
        {/* <Route exact path="/mocks" render={ (props) => <MockList {...props} />}/> */}
        
        {/* <Route exact path="/mocks/:mock_id/endpoints" render={props => this.renderEndpoints(, props)} />
        <Route exact path="/endpoints" component= {() => {
          if(this.props.mock_id){
            return <EndpointList 
              list={this.props.endpointList} 
              refreshEndpointList={this.props.refreshEndpointList}
              getMockId={this.getMockId}
              getMockName={this.getMockName}
              getMockPrefix={this.getMockPrefix}
              changePage={this.props.changePage}
            />
          }else{
            return <Redirect to="/mocks"/>
          }
        }
          
        }/> */}
        

      </Router>

          // <div>{this.renderBody(this.props.page)}</div>
    )
  }
}

export default BodyContent
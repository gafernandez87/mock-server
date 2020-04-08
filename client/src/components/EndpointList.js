import React from 'react';
import { Row, Col, PageHeader, Icon, Button, Steps } from 'antd';
import Endpoint from './Endpoint'
import EndpointCard from './EndpointCard'
import endpointService from '../services/EndpointService'
import mockService from '../services/MockService'

const emptyEndpoint = {
    name: "new endpoint",
    httpRequest: {
        path: "",
        method: "GET"
    },
    httpResponse: {
        status_code: 200
    },
    newHeaders: [],
    saveStatus: "",
    errorMessage: ""
}
const Step = Steps.Step

class EndpointsList extends React.Component {

    constructor(props){
        super(props)

        const mock_id = props.match.params.mock_id
        
        this.state = {
            parentMock: {
                _id: mock_id
            },
            currentEndpoint: {...emptyEndpoint},
            newEndpoint: true
        }
    }

    componentDidMount = () => {
        this.getParentMock()
        this.refreshEndpointList()
    }

    closeAlert = () => {
        this.setState({saveStatus: ""})
    }

    addNewHeader = () => {
        let currentEndpoint = {...this.state.currentEndpoint}
        let newHeaders = [...currentEndpoint.newHeaders]
        
        const index = Object.keys(newHeaders).length
        const input = `input_${index}`
        let subObject = {} 

        subObject[input] = {"":""}
        newHeaders[index] = subObject

        currentEndpoint.newHeaders = newHeaders
        this.setState({currentEndpoint})
    }

    deleteHeader = (index) => {
        let currentEndpoint = {...this.state.currentEndpoint}
        let newHeaders = [...currentEndpoint.newHeaders]
        newHeaders.splice(index, 1)
        currentEndpoint.newHeaders = newHeaders
        this.setState({currentEndpoint})
    }
    
    getNewHeaders = (headers) => {
        if(headers){
            const newHeader = Object.keys(headers).map((key, i) => {
                const input = `input_${i}`
                let header = {}
                let subObject = {}

                subObject[key] = headers[key]
                header[input] = subObject
                return header
            })
            return newHeader
        }else{
           return []
        }
    }

    changeHeader = (index, input, isKey, headerValue, headerKey, newHeaderKey) => {
        const newHeaders = {...this.state.currentEndpoint.newHeaders}
        
        if(!isKey){
            newHeaders[index][input][headerKey] = headerValue
        }else{
            delete newHeaders[index][input][headerKey]
            newHeaders[index][input][newHeaderKey] = headerValue
        }

        this.setState({newHeaders})
    }

    convertToHeader = () => {
        let newHeaders = {...this.state.currentEndpoint.newHeaders}
        let l = Object.keys(newHeaders).length
        let result = {}
        for(let i = 0; i < l; i++){
            try{
                const input = Object.keys(newHeaders[i])[0]
                result = Object.assign(newHeaders[i][input], result)
            }catch(e){
                //do nothing
            }
        }
        return result
    }

    getBody = () => {
        const {bodyType, body} = this.state.currentEndpoint.httpResponse

        if(bodyType === "json"){
            return JSON.parse(body)
        }else {
            return body
        }
    }

    saveEndpoint = () => {
        const updatedEndpoint = { ...this.state.currentEndpoint}

        if ( updatedEndpoint.httpRequest.path.substring(0, 1) !== "/" ) {
            this.setState({
                saveStatus: "error",
                errorMessage: 'The first character of the path must be "/"'
            })
            return updatedEndpoint;
        }
        updatedEndpoint.httpResponse.headers = this.convertToHeader()

        //Saco los datos que no quiero guardar
        const {newHeaders, ...endpointToSave} = {...updatedEndpoint};
        const mockId = this.state.parentMock._id


        let promise
        if(this.state.newEndpoint){
            promise = endpointService.create(mockId, endpointToSave)
        }else{
            promise = endpointService.update(mockId, endpointToSave._id, endpointToSave)
        }
        
        promise.then(_ => {
            this.setState({
                currentEndpoint: {
                    ...updatedEndpoint,
                    httpRequest: { ...updatedEndpoint.httpRequest },
                    httpResponse: { ...updatedEndpoint.httpResponse },
                    newHeaders: this.getNewHeaders(updatedEndpoint.httpResponse.headers)
                },
                saveStatus: "success",
                newEndpoint: false
            })

            setTimeout(this.closeAlert, 2000)

            this.refreshEndpointList()
        }).catch(err => {
            console.error("Error", err)
            this.setState({saveStatus: "error"})
        })
    }

    deleteEndpoint = () => {
        const mockId = this.state.parentMock._id
        const endpointId = this.state.currentEndpoint._id

        endpointService.remove(mockId, endpointId)
        .then(_ => {
            this.setState({currentEndpoint: emptyEndpoint})
            this.refreshEndpointList()
        }).catch(err => {
            console.error(err)
            this.setState({saveStatus: "error"})
        })
    }

    cloneEndpoint = () => {
        const mockId = this.state.parentMock._id
        const endpointId = this.state.currentEndpoint._id

        endpointService.clone(mockId, endpointId)
        .then(_ => {
            this.refreshEndpointList()
        }).catch(err => {
            console.error(err)
            this.setState({saveStatus: "error"})
        })
    }

    refreshEndpointList = () => {
        endpointService.getAllByMock(this.state.parentMock._id)
        .then(response => {
            this.setState({endpointList: response.data})
        })
    }

    getParentMock = () => {
        mockService.get(this.state.parentMock._id)
        .then(response => {
            this.setState({parentMock: response.data[0]})
        })
        
    }

    checkValidBody = (body) => {
        const bodyType = this.state.currentEndpoint.httpResponse.bodyType
        let bodyClass = ""
        
        if(bodyType === "json"){
            try{
                JSON.parse(body)
            }catch(err){
                bodyClass = "error"
            }
        }else if(bodyType === "xml"){
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(body,"text/xml");
            if (xmlDoc.getElementsByTagName('div').length === 0) {
                bodyClass = ""
            } else {
                bodyClass = "error"
            }
        }

        this.setState({bodyClass})
    }

    handleChange = (e, model) => {
        let currentEndpoint = { ...this.state.currentEndpoint };
        if(model) {
            currentEndpoint[model][e.target.name] = e.target.value;
            console.log(e.target.name)
            if(e.target.name === "body"){
                this.checkValidBody(e.target.value)
            }
        } else {
            currentEndpoint[e.target.name] = e.target.value;
        }
        this.setState({ currentEndpoint }); 
    }

    renderEndpoint = () => {
        return (<Endpoint
            data={this.state.currentEndpoint}
            saveEndpoint={this.saveEndpoint}
            deleteEndpoint={this.deleteEndpoint}
            handleChange={this.handleChange}
            saveStatus={this.state.saveStatus}
            errorMessage={this.state.errorMessage}
            closeAlert={this.closeAlert}
            bodyClass={this.state.bodyClass}
            isNewEndpoint={this.state.newEndpoint}
            addNewHeader={this.addNewHeader}
            changeHeader={this.changeHeader}
            deleteHeader={this.deleteHeader}
        />)
    }

    renderEndpointList = () => {
        return this.state.endpointList && this.state.endpointList.map( (endpoint, index) => {
            return (
                <EndpointCard 
                    selectedId={this.state.currentEndpoint._id}
                    key={index} 
                    endpoint={endpoint} 
                    index={index} 
                    prefix={this.state.parentMock.prefix}
                    selectEndpoint={this.selectEndpoint}
                    cloneEndpoint={this.cloneEndpoint} />
            )
        })
    }

    selectEndpoint = (endpoint) => {
        this.setState({
            currentEndpoint: {
                ...endpoint,
                httpRequest: { ...endpoint.httpRequest },
                httpResponse: { ...endpoint.httpResponse },
                newHeaders: this.getNewHeaders(endpoint.httpResponse.headers)
            },
            newEndpoint: false
        })
    }

    newEndpoint = () => {
        this.setState({
            currentEndpoint: emptyEndpoint,
            newEndpoint: true
        })
    }

    getTitle = () => {
        return (`Mock GROUP: ${this.state.parentMock.name}`)
    }

    getSubTitle = () => {
        const prefix = this.state.parentMock.prefix
        if(prefix){
            return (`Path prefix: ${prefix}`)
        }else{
            return ""
        }
        
    }

    getListClasses = () => {
        return this.state.newEndpoint ? "blured" : ""
    }

    goBack = () => {
        this.props.history.push("/");
    }    

    render(){
        return (
            <div>
                <Row>
                    <Col>
                        <PageHeader
                            onBack={() => this.goBack()}
                            title={this.getTitle()}
                            subTitle={this.getSubTitle()}
                        >
                            <div>
                                    <Button type="dashed" onClick={this.newEndpoint}>
                                        <Icon type="plus" />Add Enpoint
                                    </Button>
                            </div>
                        </PageHeader>
                    </Col>
                </Row>
                <Row style={{marginTop: 10}}>
                    <Col span={8}>
                        <Steps current={1}>
                            <Step status="finish" title="Endpoint list" icon={<Icon type="ordered-list" />} />
                        </Steps>
                        <div className={this.getListClasses()}>
                            {this.renderEndpointList()}
                        </div>
                    </Col>
                    <Col span={16}>
                        {this.renderEndpoint()}
                    </Col>
                </Row>
                
            </div>
        )
    }
}

export default EndpointsList
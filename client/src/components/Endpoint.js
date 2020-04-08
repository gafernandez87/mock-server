import React from 'react'
import { Card,  Form, Input, Select, Button, Affix, Alert, Modal, Icon, Steps, Popover } from 'antd';

const { Option } = Select;
const confirm = Modal.confirm;
const Step = Steps.Step;

class Endpoint extends React.Component{

    getSaveMessage = () => {
        return this.props.isNewEndpoint ? "Endpoint created successfully" : "Endpoint saved successfully"
    }

    getButtonText = () => {
        return this.props.isNewEndpoint ? "Create" : "Save"
    }
    
    showAlert = () => {
        var message="An error occurred while saving the endpoint. Please try again";
        if ( this.props.errorMessage !== undefined) {
            message = this.props.errorMessage
        } 
        switch(this.props.saveStatus){
            case "success":
                return <Alert 
                        message={this.getSaveMessage()}
                        type="success" banner closable
                        onClose={this.props.closeAlert}/>
            case "error":
                return <Alert 
                    message={message} 
                    type="error" banner closable
                    onClose={this.props.closeAlert}/>
            default:
                break;
        }
    }

    showDeleteConfirm = (deleteEndpoint) => {
        confirm({
            title: 'Are you sure delete this Endpoint?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteEndpoint()
            }
        });
    }

    renderHeaders = (headers) => {
        headers = headers || []
        return (
            <Form.Item label="Headers">
                <Button type="dashed" onClick={(e) => this.props.addNewHeader()}><Icon type="plus" />Add header</Button>
                {headers.map( (header, index) => {
                    if(!header){
                        this.props.changeHeader(index, `input_${index}`, true, "", "")
                        return ""
                    }
                    const inputNum = Object.keys(header)[0] //Ej: Input_0
                    const headerKey = Object.keys(header[inputNum])[0] //Content-type
                    const headerValue = header[inputNum][headerKey]   //application/json

                    return(
                        <div key={index}>
                            <Input
                                style={{width: 200, marginRight: 20}}
                                key={`${inputNum}_key`} value={headerKey} name={headerKey}
                                onChange={(e) => this.props.changeHeader(index, inputNum, true, headerValue, headerKey, e.target.value)}
                            />
                            <Input
                                style={{width: 200}}
                                key={`${inputNum}_value`} value={headerValue} name={headerValue}
                                onChange={(e) => this.props.changeHeader(index, inputNum, false, e.target.value, headerKey, null)}
                            />
                            <a onClick={() =>{this.props.deleteHeader(index)}} style={{marginLeft: 5}}><Icon type="minus-circle"/></a>
                            <br />

                        </div>
                    )
                })}
                
            </Form.Item>
        )
    }
    methodTooltipContent = (prefix, path) => {
        return (<div>
                    <p>Path where you want to do your request.</p>
                    <p>Example: /api/v1/users/1</p>
                    <p>Path MUST start with <b>/</b></p>
                    <p>Be aware of the prefix. Your current path is: {prefix}{path}</p>
                </div>)
    }

    delayTooltipContent = () => {
        return (<div>
                    <p>Time that the server wait before sending the repsonse in milliseconds.</p>
                    <p>Example: 5000 (5 seconds).</p>
                    <p>Default 1</p>
                </div>)
    }

    handleChange = (e, model) => {
        const reg = /\b[0-9]{1,3}\b/;
        const value = e.target.value
        if ((!Number.isNaN(value) && reg.test(value)) || value === '') {
            this.props.handleChange(e, model);
        }
    }

    getBodyErrorMessage = () => {
        return `Invalid ${this.props.data.httpResponse.bodyType.toUpperCase()}. Please fix it before hitting save`
    }

    render() {
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 5 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 16 }
            }
        };
        const isNewEndpoint = this.props.isNewEndpoint
        return (
            <Affix offsetTop={10}>
                {this.showAlert()}
                {this.props.isNewEndpoint && 
                    <Steps current={1}>
                        <Step status="finish" title="New endpoint data..." icon={<Icon type="plus-square" />} />
                    </Steps> }
                {!this.props.isNewEndpoint && 
                    <Steps current={1}>
                        <Step status="finish" title={this.props.data.name} icon={<Icon type="right" />} />
                    </Steps> }    
                <Card>
                    <Form {...formItemLayout}>
                        <h2>Request</h2>
                        <Form.Item label="Name">
                            <Input 
                                id="name" value={this.props.data.name} name="name"
                                onChange={(e) => this.props.handleChange(e)}
                            />
                        </Form.Item>
                        <Form.Item label="Author">
                            <Input 
                                id="author" value={this.props.data.author} 
                                name="author" readOnly={!isNewEndpoint}
                                onChange={(e) => this.props.handleChange(e)}
                            />
                        </Form.Item>
                        <Form.Item label="Method">
                            <Select defaultValue={this.props.data.httpRequest.method} style={{ width: "17%" }} 
                                onChange={(e) => this.props.handleChange({ target: { name: "method", value: e } }, 'httpRequest')}
                                id="method" value={this.props.data.httpRequest.method} name="method"
                            >
                                <Option value="GET">GET</Option>
                                <Option value="POST">POST</Option>
                                <Option value="PUT">PUT</Option>
                                <Option value="PATCH">PATCH</Option>
                                <Option value="DELETE">DELETE</Option>
                            </Select>
                            <Popover title="Path" placement="bottomRight" trigger="hover"
                                    content={this.methodTooltipContent(this.props.data.httpRequest.prefix, this.props.data.httpRequest.path)}>
                                <Input 
                                    id="path" value={this.props.data.httpRequest.path} name="path"
                                    onChange={(e) => this.props.handleChange(e, 'httpRequest')}
                                    style={{width: "81%", marginLeft: 10}} autoComplete="off"
                                />
                            </Popover>
                        </Form.Item>
                        
                        <hr />

                        <h2>Response</h2>

                        <Form.Item label="Status code">
                            <Input style={{ width: 90 }}
                                maxLength={3}
                                id="status_code" value={this.props.data.httpResponse.status_code} name="status_code"
                                onChange={(e) => this.handleChange({...e}, 'httpResponse')}
                            />
                        </Form.Item>

                        <Form.Item label="Delay">
                            <Popover title="Delay" placement="rightTop" trigger="hover"
                                    content={this.delayTooltipContent()}>
                                <Input style={{ width: 90 }}
                                    id="timeout" value={this.props.data.httpResponse.timeout || 1} name="timeout"
                                    onChange={(e) => this.props.handleChange(e, 'httpResponse')}
                                />
                            </Popover>

                        </Form.Item>
                        
                        {this.renderHeaders(this.props.data.newHeaders)}
                        
                        <Form.Item label="Body Type">
                            <Select defaultValue={this.props.data.httpResponse.bodyType || "json"} 
                                    onChange={(e) => this.props.handleChange({ target: { name: "bodyType", value: e } }, 'httpResponse')}
                                    style={{ width: "17%" }}
                                    id="bodyType" name="bodyType"
                                    value={this.props.data.httpResponse.bodyType}
                            >
                                <Option value="json">JSON</Option>
                                <Option value="text">TEXT</Option>
                                <Option value="xml">XML</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Body" className={this.props.bodyClass}>
                            <Input.TextArea 
                                rows={6} id="body" 
                                value={this.props.data.httpResponse.body} name="body"
                                onChange={(e) => this.props.handleChange(e, "httpResponse")}
                            />
                            {this.props.bodyClass === "error" ? <p>{this.getBodyErrorMessage()}</p> : ""}
                        </Form.Item>
                        <Button type="primary" disabled={this.props.bodyClass === "error"} onClick={() => this.props.saveEndpoint()} style={{float: "right"}}>{this.getButtonText()}</Button>
                        {!this.props.isNewEndpoint && <Button type="danger" onClick={() => this.showDeleteConfirm(this.props.deleteEndpoint)}>Delete</Button> }
                    </Form>
                </Card>
            </Affix>
        )
    }
}

export default Endpoint
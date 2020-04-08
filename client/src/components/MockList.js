import React from 'react';
import { Row, Col, Table, Menu, Icon, Modal, Form,
     Input, Select, Button, Alert, Popover, Timeline } from 'antd';
import Highlighter from 'react-highlight-words';
import mockService from '../services/MockService'
import {Link} from 'react-router-dom'

const {Option} = Select
const emptyMock = {
    name: "New mock",
    author: "",
    description: "",
    prefix: "/mock",
    country: "",
    product: ""
}
const countryList = ["AR", "UY", "ES", "MX"]
const productList = ["WELP", "PRESTO", "POSTA", "MANGO", "LUQUITAS"]
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

const content = (
  <Timeline>
    <Timeline.Item>Create a new MOCK group or edit one.</Timeline.Item>
    <Timeline.Item>Add or edit endpoints to your group.</Timeline.Item>
    <Timeline.Item>Define the endpoint path, the http response status, http verb,<br/> response body, and the response headers.</Timeline.Item>
    <Timeline.Item color="green">Use them to mock up your project.</Timeline.Item>
  </Timeline>
);

const confirm = Modal.confirm;

class MockList extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            modal: {
                visible: false,
                confirmLoading: false,
                data: emptyMock,
                buttonText: "Create",
                title: "New mock"
            },
            searchText: ""
        }
    }

    componentDidMount = () => {
        this.refreshMockList()
    }

    refreshMockList = () => {
        mockService.getAll()
        .then(response => {
          this.setState({mockList: response.data})
        }).catch(err => {
          console.error(err)
          this.setState({currentPage: "mocks"})
        })
    }

    createMock = () => {        
        const modal = {...this.state.modal}
        modal.confirmLoading = true
        this.setState({modal});
        
        mockService.create(this.state.modal.data)
        .then(_ => {
            this.refreshMockList()
            modal.confirmLoading = false;
            modal.data = emptyMock;
            modal.buttonText = "Create";
            this.setState({
                modal,
                saveStatus: "success"
            });

            setTimeout(this.closeAlert, 2000)
        })
        .catch(err => {
            console.log(err)
            this.setState({saveStatus: "error"})
        })
    }

    deleteMock = (mockId) => {
        mockService.remove(mockId)
        .then(_ => {
            this.refreshMockList()
        }).catch(err => {
            console.error(err)
            this.setState({saveStatus: "error"})
        })
    }

    editMock = () => {
        const {mockId, ...data} = this.state.modal.data
        const modal = {...this.state.modal}

        modal.confirmLoading = true
        this.setState({modal});
        
        mockService.update(mockId, data)
        .then(_ => {
            this.refreshMockList()
            modal.confirmLoading = false;
            this.setState({
                modal,
                saveStatus: "success"
            });

            setTimeout(this.closeAlert, 2000)
            
        }).catch(err => {
            console.error(err)
            this.setState({saveStatus: "error"})
        })
    }

    cloneMock = (mockId) => {
        mockService.clone(mockId)
        .then(_ => {
            this.refreshMockList()
            this.setState({saveStatus: "success"});
            setTimeout(this.closeAlert, 2000)
        }).catch(err => {
            console.error(err)
            this.setState({saveStatus: "error"})
        })
    }

    //Modal
    showEditModal = (mockId) => {
        const toEdit = this.state.mockList.filter(mock => mockId === mock._id)[0]
        const data = {
            mockId: mockId,
            name: toEdit.name,
            author: toEdit.author,
            description: toEdit.description,
            prefix: toEdit.prefix,
            country: toEdit.country,
            product: toEdit.product
        }

        const modal = {...this.state.modal}
        modal.visible = true;
        modal.data = data;
        modal.buttonText = "Edit";
        modal.title = "Edit mock";
        modal.submit = this.editMock;

        this.setState({modal});
    }

    showCreateModal = () => {
        const modal = {...this.state.modal}
        modal.visible = true;
        modal.buttonText = "Create";
        modal.title = "New mock";
        modal.submit = this.createMock
        modal.data = emptyMock;
        this.setState({modal});
    }

    showAlert = () =>{
        switch(this.state.saveStatus){
            case "success":
                return <Alert 
                        message="Mock created successfully"
                        type="success" banner closable
                        onClose={this.closeAlert}/>
            case "error":
                return <Alert 
                    message="An error occurred while creating the mock. Please try again" 
                    type="error" banner closable
                    onClose={this.closeAlert}/>
            default:
                break;
        }
    }

    closeAlert = () => {
        this.setState({saveStatus: ""})
    }

    handleCancel = () => {
        const modal = {...this.state.modal}
        modal.visible = false
        this.setState({modal});
    }

    showDeleteConfirm = (mockId, deleteMock) => {
        confirm({
            title: 'Are you sure delete this Mock?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteMock(mockId)
            }
        });
    }

    //Actions
    generateActions = (mockId, name, prefix) => {
        return (<div>
            <Select style={{width: 130}} value="" 
                onChange={(e) => this.executeAction(e, mockId, name, prefix)}>

                <Option key="" value="" disabled>actions</Option>
                <Option key="show" value="SHOW">
                    <Link to={`/mocks/${mockId}/endpoints`}>ENDPOINTS</Link>
                </Option>
                <Option key="edit" value="EDIT">EDIT</Option>
                <Option key="clone" value="CLONE">CLONE</Option>
                <Option key="delete" value="DELETE">DELETE</Option>
            </Select>
        </div>)
    }

    executeAction = (e, mockId) => {
        switch(e){
            case "EDIT":
                this.showEditModal(mockId);
                break;
            case "DELETE":
                this.showDeleteConfirm(mockId, this.deleteMock);
                break;
            case "CLONE":
                this.cloneMock(mockId);
                break;
            default:
                //DO NOTHING
                break;
        }

    }

    handleChange = (e) => {
        let modal = {...this.state.modal}
        modal.data[e.target.name] = e.target.value
        this.setState({modal})
    }
    
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }
    
    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    //Table
    generateTableStructure(structure){
        return structure.map(column => {
            let obj = {}

            if(column.name !== "actions") {
                obj = {
                    ...this.getColumnSearchProps(column.name)
                }
            }

            obj.title = column.title
            obj.dataIndex = column.name
            obj.key = column.name
            obj.width = column.width
            
            return obj
        })
    }

    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
          setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
          <div style={{ padding: 8 }}>
            <Input
              ref={node => { this.searchInput = node; }}
              placeholder={`Search ${dataIndex}`}
              value={selectedKeys[0]}
              onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
              style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm)}
              icon="search"
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Search
            </Button>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex] !== undefined ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : "",
        onFilterDropdownVisibleChange: (visible) => {
          if (visible) {
            setTimeout(() => this.searchInput.select());
          }
        },
        render: (text) => (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text !== undefined ? text.toString() : ""}
          />
        ),
    })

    popOverTitle = () => {
        return (<div>
                    <p>Everyy endpoints under this mock will begin with this <b>prefix</b></p>
                    <p>Example: /mock</p>
                </div>)
    }

    render(){
        const data = this.state.mockList && this.state.mockList.map( (mock, index) => {
            return {
                key: index,
                name: mock.name,
                description: mock.description,
                prefix: mock.prefix,
                author: mock.author,
                country: mock.country,
                product: mock.product,
                creation_date: mock.creation_date,
                actions: this.generateActions(mock._id, mock.name, mock.prefix)
            }
        })
        const columns = this.generateTableStructure([
            {title: "Name", name: "name", width:"15%"},
            {title: "Description", name: "description", width:"20%"},
            {title: "Prefix", name: "prefix", width:"10%"},
            {title: "Author", name: "author", width:"15%"},
            {title: "Country", name: "country", width:"5%"},
            {title: "Product", name: "product", width:"5%"},
            {title: "Creation date", name: "creation_date", width:"15%"},
            {title: "Actions", name: "actions", width:"15%"}])

        return (
            <div>
                <Modal
                    title={this.state.modal.title}
                    visible={this.state.modal.visible}
                    confirmLoading={this.state.modal.confirmLoading}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button key="back" onClick={this.handleCancel}>Close</Button>,
                        <Button key="submit" type="primary" 
                                onClick={this.state.modal.submit} 
                                loading={this.state.modal.confirmLoading}>
                          {this.state.modal.buttonText}
                        </Button>,
                      ]}
                    >
                        {this.showAlert()}
                        <Form {...formItemLayout}>
                            <Form.Item label="Name">
                                <Input 
                                    id="name" name="name"
                                    value={this.state.modal.data.name}
                                    onChange={(e) => this.handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label="Author">
                                <Input 
                                    id="author" name="author"
                                    value={this.state.modal.data.author}
                                    onChange={(e) => this.handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label="Description">
                                <Input 
                                    id="description" name="description"
                                    value={this.state.modal.data.description}
                                    onChange={(e) => this.handleChange(e)}
                                />
                            </Form.Item>
                            <Form.Item label="Prefix">
                                <Popover content={this.popOverTitle()} title="Prefix" placement="rightTop" trigger="hover">
                                    <Input 
                                    id="prefix" name="prefix"
                                    value={this.state.modal.data.prefix}
                                    onChange={(e) => this.handleChange(e)}
                                />
                                </Popover>
                            </Form.Item>
                            <Form.Item label="Country">
                                <Select 
                                    onChange={(e) => this.handleChange({ target: { name: "country", value: e } })}
                                    id="country" value={this.state.modal.data.country} name="country"
                                >
                                    {countryList.map(country => {
                                        return (<Option key={country} value={country}>{country}</Option>)
                                    })}
                                </Select>
                                
                            </Form.Item>
                            <Form.Item label="Product">
                                <Select 
                                    onChange={(e) => this.handleChange({ target: { name: "product", value: e } })}
                                    id="product" value={this.state.modal.data.product} name="product"
                                >
                                    {productList.map(product => {
                                        return (<Option key={product} value={product}>{product}</Option>)
                                    })}
                                </Select>
                            </Form.Item>
                        </Form>
                </Modal>
                <Row style={{marginBottom: 10}}>
                    <Col>
                        <Menu mode="horizontal">
                            <Menu.Item key="newEndpoint" onClick={this.showCreateModal}>
                                <Icon type="plus" />NEW MOCK
                            </Menu.Item>
                            <Menu.Item key="help" style={{marginLeft: "auto", background: "none"}}>
                                <Popover content={content} title="Route" placement="leftTop" trigger="hover">
                                    <Icon type="question" />
                                </Popover>
                            </Menu.Item>
                        </Menu>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table columns={columns} dataSource={data} />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default MockList
import React from 'react'
import { Badge, Button, Table, Card, Modal } from 'react-bootstrap'
import { useLocation, Link } from 'react-router-dom'
import EmployeeFilter from './EmployeeFilter.jsx'
import EmployeeAdd from './EmployeeAdd.jsx'

function EmployeeTable(props) {
    // GET THE URL
    const { search } = useLocation()
    // GET THE PARAMETERS FROM THE URL
    const query = new URLSearchParams(search)
    // GET THE 'EMPLOYED' PARAMETER SPECIFICALLY
    const q = query.get('employed')

    const employeeRows = props.employees
        .filter(employee => (q ? String(employee.currentlyEmployed) === q : true))
        .map(employee => 
        <EmployeeRow 
            key={employee._id} 
            employee={employee} 
            deleteEmployee={props.deleteEmployee} />)
    return (
        <Card>
            <Card.Header as="h5">All Employees <Badge bg="secondary">{employeeRows.length}</Badge></Card.Header>
            <Card.Body>
                <Card.Text>
                    <Table striped size="sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Extension</th>
                                <th>Email</th>
                                <th>Title</th>
                                <th>Date Hired</th>
                                <th>Currently Employed?</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeRows}
                        </tbody>
                    </Table>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

class EmployeeRow extends React.Component {
    constructor() {
        super()
        this.state = { modalVisible: false }
        this.toggleModal = this.toggleModal.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
    }
    handleDelete() {
        this.props.deleteEmployee(this.props.employee._id)
        this.setState({ modalVisible: false, })
    }
    toggleModal() {
        this.setState({ modalVisible: !this.state.modalVisible })
    }
    render() {
        return (
            <tr>
                <td><Link to={`/edit/${this.props.employee._id}`}>{this.props.employee.name}</Link></td>
                <td>{this.props.employee.extension}</td>
                <td>{this.props.employee.email}</td>
                <td>{this.props.employee.title}</td>
                <td>{this.props.employee.dateHired.toDateString()}</td>
                <td>{this.props.employee.currentlyEmployed ? 'Yes' : 'No'}</td>
                <td>
                    <Button variant="danger" size="sm" onClick={this.toggleModal}>X</Button>                
                    <Modal show={this.state.modalVisible} onHide={this.toggleModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Delete Employee?</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>Are you sure you want to delete this employee?</Modal.Body>

                        <Modal.Footer>
                            <Button type="submit" variant="danger" className="mt-4" onClick={this.toggleModal}>Cancel</Button>
                            <Button type="submit" variant="success" className="mt-4" onClick={this.handleDelete}>Yes</Button>
                        </Modal.Footer>
                    </Modal>
                </td>
            </tr>
        )
    }
}

export default class EmployeeList extends React.Component {
    constructor() {
        super()
        this.state = { employees: [] }
        this.createEmployee = this.createEmployee.bind(this)
        this.deleteEmployee = this.deleteEmployee.bind(this)
    }
    
    componentDidMount() {
        this.loadData()
    }

    async loadData() {
        const response = await fetch('/api/employees')
        const data = await response.json()
        data.employees.forEach(employee => {
            employee.dateHired = new Date(employee.dateHired)
        })
        this.setState({ employees: data.employees })
    }

    async createEmployee(employee) {
        const response = await fetch('/api/employees', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(employee),
        })
        const data = await response.json()
        data.employee.dateHired = new Date(data.employee.dateHired)
        const newEmployees = this.state.employees.concat(data.employee)
        this.setState({ employees: newEmployees })
    }

    async deleteEmployee(id) {
        const response = await fetch(`/api/employees/${id}`, { method: 'DELETE' })
        if (!response.ok) {
            console.log('Failed to delete employee.')
        } else {
            this.loadData()
        }
    }
    
    render() {
        return (
            <React.Fragment>
                <EmployeeAdd createEmployee={this.createEmployee} />
                <EmployeeFilter />
                <EmployeeTable employees={this.state.employees} deleteEmployee={this.deleteEmployee} />
            </React.Fragment>
        )
    }
}
import React, { useState, useEffect }  from 'react'
import { useParams } from 'react-router-dom'
import { Button, Card, Container, Row, Col, Alert } from 'react-bootstrap'

export default function EmployeeEdit() {
    const [ employee, updateEmployee ] = useState('')
    const [ modalProps, setModalProps ] = useState({ visibility: false, msg: '', })
    const { id } = useParams()

    useEffect(() => {
        fetchEmployee()
    }, [])

    async function fetchEmployee() {
        const response = await fetch(`/api/employees/${id}`)
        const data = await response.json()
        updateEmployee(data.employee)    
    }

    async function handleSubmit(e) {
        e.preventDefault()
        const form = document.forms.employeeUpdate
        let id = form.id.value

        const response = await fetch(`/api/employees/${id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify({
                'name': form.name.value,
                'extension': form.extension.value,
                'email': form.email.value,
                'title': form.title.value,
                'currentlyEmployed': form.currentlyEmployed.checked
            }),
        })
        const data = await response.json()
        updateEmployee(data.employee)
        setModalProps({ visibility: true, msg: data.msg })
    }

    return (
        <Card>
            <Card.Header as="h5">Edit {employee.name}</Card.Header>
            <Card.Body>
                <Card.Text>
                    <Container fluid>
                        <form name="employeeUpdate" onSubmit={handleSubmit}>
                            <Row>
                                <Col md={2}>ID:</Col>
                                <Col md="auto"><input type="text" name="id" readOnly="readOnly" defaultValue={employee._id} /></Col>
                            </Row>
                            <Row>
                                <Col md={2}>Name:</Col>
                                <Col md="auto"><input type="text" name="name" defaultValue={employee.name} /></Col>
                            </Row>
                            <Row>
                                <Col md={2}>Extension:</Col>
                                <Col md="auto"><input type="text" name="extension" defaultValue={employee.extension} /></Col>
                            </Row>
                            <Row>
                                <Col md={2}>Email:</Col>
                                <Col md="auto"><input type="text" name="email" defaultValue={employee.email} /></Col>
                            </Row>
                            <Row>
                                <Col md={2}>Title:</Col>
                                <Col md="auto"><input type="text" name="title" defaultValue={employee.title} /></Col>
                            </Row>
                            <Row>
                                <Col md={2}>Date Hired:</Col>
                                <Col md="auto"><input type="text" name="dateHired" readOnly="readOnly" defaultValue={employee.dateHired} /></Col>
                            </Row>
                            <Row>
                                <Col md={2}>Currently Employed?</Col>
                                <Col md="auto"><input type="checkbox" name="currentlyEmployed" defaultChecked={employee.currentlyEmployed} /></Col>
                            </Row>                    
                            <Button type="submit" variant="primary" size="sm" className="my-3">Update Employee</Button>
                            <Alert 
                                variant="success" 
                                show={modalProps.visibility} 
                                onClose={(e) => setModalProps({ visibility: false })} dismissible>{modalProps.msg}</Alert>
                        </form>
                    </Container>
                </Card.Text>
            </Card.Body>
        </Card>
    )
}
import React, { Component, Fragment } from 'react'
import { isUserLoggedIn, isAdmin } from '../auth/auth'
import { Navbar,Nav } from 'react-bootstrap'




export class NavBar extends Component<any> {
    


    render() {
          
        return (
            <div className="navBar">
                <div className="row">
                <div className="col-md-12">
                    <nav>
                        <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="m-auto" activeKey= {this.props}>
                        {!isUserLoggedIn() ? (<Nav.Link href="/login">login</Nav.Link>) : (
                            <Fragment>
                               
                            <Nav.Link   href="/logout">logout</Nav.Link>
                            
                            <Nav.Link  href="/vacations" >Vacations</Nav.Link>
                            
                            </Fragment>
                        )}
                        {isAdmin() ? (<Nav.Link  href="/admin">admin chart</Nav.Link>): ("")}
                        </Nav>
                        
                        </Navbar.Collapse>
                        </Navbar>
                    </nav>
                </div>
                </div>
            </div>
  
        )}

}







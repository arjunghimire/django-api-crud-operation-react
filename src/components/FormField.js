import React, { Component } from 'react';
import {Table, InputGroup,InputGroupAddon, Input,Button,Card,CardHeader,CardBody} from 'reactstrap';
import axios from 'axios';


const access_token = "tokQZFR6DnSdtFJYOVJuF78kFZAz1U";
class FormField extends Component {

  constructor(props){
  	super(props);
  	this.state = {
  		countries : [],
  		countryId: '',
  		countryName: '',
  		countryCode: '',
  		isToggleOn: "Add"
  	};
  	 this.deleteMe = this.deleteMe.bind(this)
  	this.editMe = this.editMe.bind(this)
  }

  componentDidMount() {
	this.getLoadAll();
  }
  getLoadAll(){
  	axios({
	    method: "get",
	    url: "http://127.0.0.1:8000/address/country/" ,
	    headers: {
	      "Content-Type": "application/json",
	      Authorization: "Bearer " + access_token
	    }
	  })
	.then(response => { 
      	this.setState({ countries: response.data });
	})
	.catch(error => {
		console.log(error.response)
    });
  }

  handleChange = e => {
  	this.setState({[e.target.name]: e.target.value})
  }
  onSubmitForm = e => {
  	const countryName = this.state.countryName;
  	const countryCode = this.state.countryCode;
  	const countryId = this.state.countryId;	
  	if(this.state.isToggleOn === "Add"){
		axios({
		    method: "post",
		    url: "http://127.0.0.1:8000/address/country/" ,
		    data: {name: countryName,countryCode: countryCode },
		    headers: {
		      "Content-Type": "application/json",
		      Authorization: "Bearer " + access_token
		    }
		  })
		.then(response => { 
	      	console.log(response);
	      	 this.getLoadAll();
	      	 this.setState({
	      	 	countryName: '',
	      	 	countryCode: ''
	      	 })
			})
			.catch(error => {
			    console.log(error.response)
	    });

  	 console.log(this.state.isToggleOn);
  	}else{
  	console.log(this.state.isToggleOn + countryId);
		axios({
		    method: "put",
		    url: 'http://127.0.0.1:8000/address/country/' + countryId + '/' ,
		    data: {name: countryName,countryCode: countryCode },
		    headers: {
		      "Content-Type": "application/json",
		      Authorization: "Bearer " + access_token
		    }
		  })
		.then(response => { 
	      	console.log(response);
	      	 this.getLoadAll();
	      	 this.setState({
	      	 	countryName: '',
	      	 	countryCode: '',
	      	 	isToggleOn: "Add"

	      	 })
			})
			.catch(error => {
			    console.log(error.response)
	    });
  	}

  }
	editMe(id){
  	  this.setState({isToggleOn: "Edit" });
		axios({
		    method: "get",
		    url: 'http://127.0.0.1:8000/address/country/' + id + '/' ,
		    headers: {
		      "Content-Type": "application/json",
		      Authorization: "Bearer " + access_token
		    }
		  })
		.then(response => { 
      	this.setState({
      			countryId : response.data.id,
	      	 	countryName: response.data.name,
	      	 	countryCode: response.data.countryCode
	    })
		})
		.catch(error => {
		    console.log(error.response)
		});
	}
   	deleteMe(id){
		axios({
		    method: "DELETE",
		    url: 'http://127.0.0.1:8000/address/country/' + id + '/' ,
		    headers: {
		      "Content-Type": "application/json",
		      Authorization: "Bearer " + access_token
		    }
		  })
		.then(response => { 
	      	console.log(response)
	      	this.getLoadAll();
	      	this.onSubmitForm();
	      	this.setState({
	      		isToggleOn: "Add",
	      	 	countryName: '',
	      	 	countryCode: ''
	      	 });

			})
			.catch(error => {
			    console.log(error.response)
			});
   	}
 	render() {
 		const isToggleOn = this.state.isToggleOn;
  	const style  = {
	  	marginTop : '50px'
	};
    return (
	<div className="container" style={style}>
	  <div className="row">
		<div className="col-sm">
		  <Card>
	        <CardHeader>{isToggleOn} Country</CardHeader>
	        <CardBody>
	            <InputGroup>
		          <Input type="text" name="countryName" placeholder="Country Name" className="default-form-control" value={this.state.countryName} onChange={this.handleChange} />
		          <Input type="text" name="countryCode" placeholder="Country Code" className="default-form-control" value={this.state.countryCode} onChange={this.handleChange} />
		          <InputGroupAddon addonType="append"><Button color="info" onClick={this.onSubmitForm} >{isToggleOn}</Button></InputGroupAddon>
		        </InputGroup>
	        </CardBody>
	      </Card>
	    </div>
	    <div className="col-sm">
		 <Card>
	        <CardHeader>All Countries</CardHeader>
	        <CardBody>
	            <Table striped>
		        <thead>
		          <tr>
		            <th>Country Name</th>
		            <th>Country Code</th>
		            <th>Option</th>
		          </tr>
		        </thead>
		        <tbody>
		        {this.state.countries.map((c) => {
		        	return(
			          <tr key={c.id}>
			            <td>{c.name}</td>
			            <td>{c.countryCode}</td>
			            <td><Button onClick={() => this.editMe(c.id)}> Edit</Button></td>
			            <td><Button onClick={() => this.deleteMe(c.id)}> Delete</Button></td>
			          </tr>
			        ) })}
	            </tbody>
              </Table>
	        </CardBody>
	      </Card>
	    </div>
	  </div>
	</div>
    );
  }
}

export default FormField;

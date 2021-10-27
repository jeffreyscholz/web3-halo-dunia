import React, { Component } from 'react';
import Web3 from 'web3';
import {ADDRESS, CONTRACT_ABI} from './config';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";



class App extends Component {

  async loadBlockchainData() {

    if (!window.web3) {
      console.log('no web3')
    }
    else {
      const web3 = new Web3(Web3.givenProvider);
      await window.ethereum.enable();

      const accounts = await web3.eth.getAccounts();

      this.setState({
        'account': accounts[0]
      })
      const smartContract = new web3.eth.Contract(CONTRACT_ABI, ADDRESS);
      this.setState({smartContract});

      const magicNumber = await smartContract.methods.retrieve().call();
      
      this.setState({magicNumber})
      this.setState({loading: false})
      console.log(magicNumber)
    }

  }


  constructor(props) {
    super(props)
    this.state = {
      account: 'not set',
      magicNumber: 'loading...',
      loading: true,
      value: '',
      transactionHash: '',
      transactionPending: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loader = this.loader.bind(this);
  }

  componentDidMount() {
    this.loadBlockchainData();
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  async handleSubmit(event) {
    event.preventDefault();
    const bigNumber = this.state.value.toString()
    console.log('sending to blockchain...')
    console.log(bigNumber)
    console.log(this.account)
    this.setState({transactionPending: true})
    const response = await this.state.smartContract.methods.store(bigNumber).send({from:this.state.account})
    this.setState({transactionPending: false})
    console.log('got txnhash')
    console.log(response)
    console.log(response['transactionHash'])
    this.setState({transactionHash: response['transactionHash']})

    const magicNumber = await this.state.smartContract.methods.retrieve().call();
    this.setState({magicNumber})
    //this.setState({
    //  transactionHash: response['transactionHash']
    //});
    
    
  }

  loader() {
    return <div>
    <p>waiting for the blockchain, please be patient...</p>
    <Loader type="Puff" color="#873e23" height={100} width={100}/>
    </div>
  }

  render() {
    if (this.state.loading) {
      return (<div>{this.loader()}</div>);
    }
    else {
      return (
        <div className="container">
            
          <h1>Magic Number</h1>
          <p>This is an extremely simple web3 app that stores a number in a smart contract. Anyone can change the number using this web3 app.<br/>
             The number you see below is the last number someone put in. Masuk nomor baru yuk!<br/>
             <b>This runs on the Rinkby Ether Blockchain, <h3>DO NOT USE REAL ETH TO PAY GAS!</h3></b>
          </p>
          <p><a href="https://rinkeby.etherscan.io/address/0xdff66d22db476183f54ff1386c1a786c49ebca7b#readContract" target="_blank">https://rinkeby.etherscan.io/address/0xdff66d22db476183f54ff1386c1a786c49ebca7b#readContract</a></p>
          <p>Your account: {this.state.account}</p>
          <p>The magic number is <b>{this.state.magicNumber}</b></p>
          <form onSubmit={this.handleSubmit}>
            <input id="newNumber" type="number" value={this.state.value} onChange={this.handleChange} className="form-control" placeholder={1337} required/>
            <input type="submit" hidden={this.state.transactionPending}/>
          </form>
          {this.state.transactionPending ? this.loader() : ''}
          <p>{this.state.transactionHash}</p>

        </div>
      )

    }
 
  }

}

export default App;

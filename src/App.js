import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import {get_yearly_rate} from './calculator.js'

function myFocus(initial_value){
  return (props) => {if (props.target.value === initial_value) {
    props.target.value = ''}}
}

function myBlur(initial_value){
  return (props) => {if (props.target.value === '') {
    props.target.value = initial_value}}
}


function makeForm(){
  return (
    <form className='T-Form'> 
      <input type="text" defaultValue="Deposit"
      onFocus={myFocus("Deposit")}
      onBlur={myBlur("Deposit")}
      className="Deposit">

      </input>
      &nbsp;
      <input type="date" className="Deposit Date">

      </input>
      &nbsp;
      &nbsp;

      <input type="text" defaultValue="Withdrawal"
      onFocus={myFocus("Withdrawal")}
      onBlur={myBlur("Deposit")}
      className="Withdrawal">

      </input>
      &nbsp;
      <input type="date" className="Withdrawal Date">

      </input>
      
    </form>
  )
}


function App() {
  let num = 0;
  const [inputs, setInputs] = useState([makeForm()]);
  const [output, setOutput] = useState(-100.78);
  return (
    <div className="App">
      <header className="App-header">
        {/* display the value of the output variable if it's not zero */}
        {/* div should be purple with pink text */}
        {output !== -100.78 && <div style={{color: "white", fontFamily: "serif"}}>
          <p>Rate of return: <u>{output}%</u></p>
        </div>}
        <div className='start'>
          <div style={{fontFamily: "serif", fontSize: "20px"}}>
            Starting Balance</div>
          {/* a text input form with a default value of "Starting Balance" that disappears on focus */}
          <input type="text" defaultValue="Starting Balance" 
            onFocus={myFocus("Starting Balance")}
            onBlur={myBlur("Starting Balance")}
            className='Starting Balance'>
          </input>
          &nbsp;
          <input type="date" className='Starting Date'>
          </input>
        </div>
        &nbsp;
        <div style={{fontFamily: "serif", fontSize: "20px"}}>
            Ending Balance</div>
        <div className="end">
          <input type="text" defaultValue="Ending Balance" 
            onFocus={myFocus("Ending Balance")}
            onBlur={myBlur("Ending Balance")}
            className="Ending Balance">
          </input>
          &nbsp;
          <input type="date" className='Ending Date'>
          </input>
        </div>
        &nbsp;
        <div style={{fontFamily: "serif", fontSize: "20px"}}>
            Transactions</div>
        <div>
          {inputs}
        </div>
        &nbsp;
        <div>
          <button onClick={() => {
              let new_inputs = inputs.concat([makeForm()]);
              setInputs(new_inputs);
            }}>
            Add New Transaction
          </button> 
          &nbsp;
          {/* this button console.logs the value of Starting Balance */ }
          <button onClick={() => {
            let results = {};
            let count = 0;
            for (let i in document.body.getElementsByClassName("T-Form")){
              let form = document.body.getElementsByClassName("T-Form")[i];
              try {
                results["Transaction" + count] = 
                  {"Amount": form.getElementsByClassName("Deposit")[0].value,
                    "Date": form.getElementsByClassName("Deposit Date")[0].value,
                    "Type": "Deposit"};
                count += 1
                results["Transaction" + count] = 
                  {"Amount": form.getElementsByClassName("Withdrawal")[0].value,
                    "Date": form.getElementsByClassName("Withdrawal Date")[0].value,
                    "Type": "Withdrawal"};
                count += 1;
              }
              catch (err){
                console.log(err);
              }
            }
            results["Starting Balance"] = document.body.getElementsByClassName("start")[0].getElementsByClassName("Starting Balance")[0].value;
            results["Starting Date"] = document.body.getElementsByClassName("start")[0].getElementsByClassName("Starting Date")[0].value;
            results["Ending Balance"] = document.body.getElementsByClassName("end")[0].getElementsByClassName("Ending Balance")[0].value;
            results["Ending Date"] = document.body.getElementsByClassName("end")[0].getElementsByClassName("Ending Date")[0].value;
            console.log(results);
            console.log(results);
            setOutput(get_yearly_rate(results));
          }}>
            Submit
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;

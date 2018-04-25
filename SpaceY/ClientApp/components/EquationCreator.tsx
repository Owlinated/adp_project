import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IEvaluationResult } from "../interface/IEvaluationResult";
import { IRestEquation } from "../interface/IRestEquation";
import { IRestEquationParam } from "../interface/IRestEquationParam";

//--- The creator interface which defines the data structure of our component  
interface ICreatorState
{
    EquationText: string;
    CurrentDisabledButtons: any;
    OpenBrackets: number;
    NumberStatus: NumberStatus;
    Result: any;
    DefaultValues: number[];
}

//--- Functional Component for creating the buttons of our component
function CreatorButton(props: any)
{
    return (<button type="button" className="creatorbutton" disabled={props.disabled} onClick={props.onClick}>{props.text}</button>);
}

//--- The NumberStatus class defines a type that is going to be used later
class NumberStatus
{
    public active: boolean;
    public decimaldot: boolean;
    public zerostarted: boolean;
    public value: string;

    constructor()
    {
        this.active = this.decimaldot = this.zerostarted = false;
        this.value = "";
    }

    Update(active: boolean | null, decimaldot: boolean | null, zerostarted: boolean | null, value: string | null)
    {
        if (active != null) this.active = active;
        if (decimaldot != null) this.decimaldot = decimaldot;
        if (zerostarted != null) this.zerostarted = zerostarted;
        if (value != null) this.value += value;
    }

    Copycat(obj: NumberStatus)
    {
        this.Update(obj.active, obj.decimaldot, obj.zerostarted, obj.value);
    }

    Reset()
    {
        this.active = this.decimaldot = this.zerostarted = false;
        this.value = "";
    }

    Clone()
    {
        let result = new NumberStatus();
        result.Copycat(this);
        return result;
    }
}

//--- The main component of our equation creator
export class EquationCreator extends React.Component<RouteComponentProps<any>, ICreatorState>
{
    AllButtons = ["sin", "cos", "(", ")", "7", "8", "9", "×", "4", "5", "6", "÷", "1", "2", "3", "-", "X", "0", ".", "+", "Y", "Z", "⌫", "Reset"];
    DefaultSet = this.AllButtons.length + 1;        //--- This will be used to set the length of states we have and to access the default set later
    DisButtons = Array(this.DefaultSet);            //--- Here we are using the DefaultSet as length of an array (later it will be used as an index)

    //--- Temporary variables to be used instead of the component's state
    //--- Those variables will hold the status of input to guide the user
    OpenedBrackets = 0;
    NumberStatus = new NumberStatus();
    DefaultValues = new Array(3).fill(0);

    //--- Keep track of history in a local variable (we might need to store this with the equation itself to enable future editing)
    StatesHistory = [this.state];

    //--- Constructor of the component
    constructor(props: any)
    {
        super(props);
        this.SetDisabledButtons();

        //--- Set the initial state
        this.state =
        {
            EquationText: "",
            CurrentDisabledButtons: this.DisButtons[this.DefaultSet],
            OpenBrackets: this.OpenedBrackets,
            Result: 0,
            NumberStatus: this.NumberStatus.Clone(),
            DefaultValues: this.DefaultValues.slice()
        };
    }

    //--- The following function defines the set of buttons that need to be disabled after pressing a certain button
    //--- This is neededto guide the user input and form correct equations
    SetDisabledButtons()
    {
        //--- Next disabled buttons for (+), (-), (×) and (÷)
        this.DisButtons[this.AllButtons.indexOf("+")] =
        this.DisButtons[this.AllButtons.indexOf("-")] = 
        this.DisButtons[this.AllButtons.indexOf("×")] = 
        this.DisButtons[this.AllButtons.indexOf("÷")] = ["+", "-", "×", "÷", ".", ")"];

        //--- Next disabled buttons for (Open Bracket), (sin) and (cos)
        this.DisButtons[this.AllButtons.indexOf("(")] =
        this.DisButtons[this.AllButtons.indexOf("sin")] =
        this.DisButtons[this.AllButtons.indexOf("cos")] = ["+", "×", "÷", ".", ")"];

        //--- Next disabled buttons for (Close Bracket)
        this.DisButtons[this.AllButtons.indexOf(")")] = ["sin", "cos", "(", "7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "X", "Y", "Z"];

        //--- Next disabled buttons for (0 - 9)
        this.DisButtons[this.AllButtons.indexOf("0")] = 
        this.DisButtons[this.AllButtons.indexOf("1")] =
        this.DisButtons[this.AllButtons.indexOf("2")] =
        this.DisButtons[this.AllButtons.indexOf("3")] = 
        this.DisButtons[this.AllButtons.indexOf("4")] =
        this.DisButtons[this.AllButtons.indexOf("5")] =
        this.DisButtons[this.AllButtons.indexOf("6")] = 
        this.DisButtons[this.AllButtons.indexOf("7")] =
        this.DisButtons[this.AllButtons.indexOf("8")] =
        this.DisButtons[this.AllButtons.indexOf("9")] = ["sin", "cos", "(", "X", "Y", "Z"];

        //--- Next disabled buttons for (.)
        this.DisButtons[this.AllButtons.indexOf(".")] = ["sin", "cos", "(", ")", "×", "÷", "-", ".", "+", "X", "Y", "Z"];

        //--- Next disabled buttons for (X), (Y) and (Z)
        this.DisButtons[this.AllButtons.indexOf("X")] =
        this.DisButtons[this.AllButtons.indexOf("Y")] =
        this.DisButtons[this.AllButtons.indexOf("Z")] = ["sin", "cos", "(", "7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "X", "Y", "Z"];

        //--- Default set of disabled buttons
        this.DisButtons[this.DefaultSet] =
        this.DisButtons[this.AllButtons.indexOf("Reset")] = ["+", "×", "÷", ".", ")", "⌫"];

        //--- Default set of disabled buttons
        this.DisButtons[this.AllButtons.indexOf("⌫")] = []; 
    }

    //--- Function to Reset our component
    ResetCreator()
    {
        this.OpenedBrackets = 0;
        this.ResetNumberStatus();
        this.setState(
        {
            EquationText: "",
            CurrentDisabledButtons: this.DisButtons[this.DefaultSet],
            OpenBrackets: this.OpenedBrackets,
            Result: 0,
            NumberStatus: new NumberStatus(),
            DefaultValues: new Array(3).fill(0)
        });

        //--- We should reset history as well
        this.StatesHistory = [this.state]
    }

    //--- Function to Reset the local NumberStatus variable 
    ResetNumberStatus()
    {
        this.NumberStatus.Reset();
    }

    //--- Undo the last press and go back to a previous state
    BackToPreviousState()
    {
        let PreState = this.StatesHistory.shift();
        if (PreState)
        {
            this.setState(PreState);
            this.OpenedBrackets = PreState.OpenBrackets;
            this.NumberStatus = PreState.NumberStatus.Clone();
            this.DefaultValues = this.DefaultValues.slice();    //--- We keep the current values always
        }
    }

    //--- Do what is necessary for each button we have in our component
    DealWithButton(i: number)
    {
        let Symbol = this.AllButtons[i];

        switch (Symbol)
        {
            case "(":
            case "sin":
            case "cos":
                this.OpenedBrackets++;
                break;
            case ")":
                this.OpenedBrackets--;
                this.ResetNumberStatus();
                break;
            case "0":
                this.NumberStatus.Update(true, null, !this.NumberStatus.active, Symbol);
                break;
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.NumberStatus.Update(true, null, null, Symbol);
                break;
            case ".":
                this.NumberStatus.Update(true, true, false, Symbol);
                break;
            case "Reset":
                this.ResetCreator();
                break;
            case "⌫":
                this.BackToPreviousState();
                break;
            default:
                this.ResetNumberStatus();
                break;
        }
    }

    //--- This is needed because some buttons should generate a value different than their showing texts 
    GetButtonFinalText(i: number)
    {
        let text = this.AllButtons[i];
        if (text === "sin" || text === "cos") text += "(";
        return text;
    }

    //--- This function is called whenever a button is clicked
    OnButtonClick(i: number)
    {
        if (this.DisButtons[i])
        {
            this.DealWithButton(i);
            if (this.AllButtons[i] === "Reset" || this.AllButtons[i] === "⌫") return;   //--- No more changes are needed

            let NextDisabledButtons = this.DisButtons[i].slice();   //--- Copy the values and not the references!

            //--- Special Cases
            if (this.OpenedBrackets === 0) NextDisabledButtons.push(")");
            if (this.NumberStatus.active)
            {
                if (this.NumberStatus.decimaldot) NextDisabledButtons.push(".")
                else if (this.NumberStatus.zerostarted) NextDisabledButtons.push("7", "8", "9", "4", "5", "6", "1", "2", "3", "0");
            }

            //--- Set the new state to update and re-render the component
            this.setState(
            {
                EquationText: this.state.EquationText + this.GetButtonFinalText(i),
                CurrentDisabledButtons: NextDisabledButtons,
                OpenBrackets: this.OpenedBrackets,
                NumberStatus: this.NumberStatus.Clone(),
                DefaultValues: this.DefaultValues.slice()
            });

            this.StatesHistory.unshift(this.state);    //--- Save the last state at beginning of our history array
        }
        else
        {
            alert("Error (001):\nMissing disabled list for the chosen button.\nPlease Contact Administrator.")
        }
    }

    //--- Generate a subset only of the buttons of our component 
    generateButtons(from: number, to: number)
    {
        var elements = [];
        for (let i = from; i < to; i++)
        {
            elements.push(<CreatorButton text={this.AllButtons[i]} disabled={this.state.CurrentDisabledButtons.includes(this.AllButtons[i])} onClick={() => this.OnButtonClick(i)} />);
        }
        return elements;
    }

    //--- Get the value of the current equation which should be sent to the backend
    GetEquationValue() {
        let equationtext = this.state.EquationText;
        let openBrackets = this.state.OpenBrackets;

        // Remove trailing operators
        const trailingOperator = /([×÷\+\-]|sin|cos|\()$/;
        while (equationtext.match(trailingOperator)) {
            if (equationtext.match(/\($/)) openBrackets--;
            equationtext = equationtext.replace(trailingOperator, "");
        }

        if (equationtext) {
            let result = equationtext
                // Replace tokens with interface variants
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/X/g, "var(0)")
                .replace(/Y/g, "var(1)")
                .replace(/Z/g, "var(2)")
                .replace(/sin\(/g, "Sin\(")
                .replace(/cos\(/g, "Cos\(");
            for (let i = 0; i < openBrackets; ++i)
                result += ")";
            return result;
        } else {
            return "";
        }
    }

    //-- Build a rest equation form the current state
    GetRestEquation(): IRestEquation {
        const params = [
            { name: "X", default: this.state.DefaultValues[0] },
            { name: "Y", default: this.state.DefaultValues[1] },
            { name: "Z", default: this.state.DefaultValues[2] }] as IRestEquationParam[];
        return { equation: this.GetEquationValue(), parameters: params } as IRestEquation;
    }

    //-- Called on every change to fetch data from server
    componentDidUpdate(prevProps: any, prevState: ICreatorState) {
        if (prevState.EquationText !== this.state.EquationText || prevState.DefaultValues !== this.state.DefaultValues) {
            // Post current equation to server
            fetch("api/Equations/Evaluate",
                    {
                        method: "POST",
                        headers: {
                            'Accept': "application/json",
                            'Content-Type': "application/json",
                        },
                        body: JSON.stringify(this.GetRestEquation())
                })
            // Interpret answer as result, and update state
                .then(response => response.json() as Promise<IEvaluationResult>)
                .then(data => {
                    if (data.success) {
                        this.setState({ Result: data.value });
                    } else {
                        this.setState({ Result: "Invalid equation" });
                    }
                });
        }
    }


    UpdateDefaultValues(i: number, val: any) 
    {
        if (i === 0) this.DefaultValues[0] = val.target.value;
        if (i === 1) this.DefaultValues[1] = val.target.value;
        if (i === 2) this.DefaultValues[2] = val.target.value;

        this.setState({ DefaultValues: this.DefaultValues.slice() });
    }

    //--- The render function of our component
    render()
    {
        return (
            <div>
                <div><h1>Equation Creator</h1></div>
                <div className="creatorcontainerdiv">
                    <div className="creatorfirstdiv">
                        <div><h4>Equation Description:</h4><input type="text" className="form-control" /></div>
                        <div><h4>Current Input:</h4>
                        <textarea readOnly={true} rows={1} className="form-control creatortextarea" value={this.state.EquationText} />
                        </div>
                        <div><h4>Current Value:</h4>
                            <textarea readOnly={true} rows={1} className="form-control creatortextarea" value={this.GetEquationValue()} /></div>
                        <div>
                            <table>
                                <tr>
                                    <td><h5>X Value:</h5><input type="number" name="DefaultValueX" defaultValue={this.DefaultValues[0].toString()} className="form-control creatordefaultvalue" onChange={val => this.UpdateDefaultValues(0, val)} /></td>
                                    <td><h5>Y Value:</h5><input type="number" name="DefaultValueY" defaultValue={this.DefaultValues[1].toString()} className="form-control creatordefaultvalue" onChange={val => this.UpdateDefaultValues(1, val)} /></td>
                                    <td><h5>Z Value:</h5><input type="number" name="DefaultValueZ" defaultValue={this.DefaultValues[2].toString()} className="form-control creatordefaultvalue" onChange={val => this.UpdateDefaultValues(2, val)} /></td>
                                </tr>
                            </table>
                        </div>
                        <div><h4>Result: </h4></div>
                        <p><strong>{ this.state.Result}</strong></p>
                      <span className="text-danger" hidden={this.OpenedBrackets === 0}>Note: Some open brackets are still not closed!</span>
                    </div>
                    <div className="creatorseconddiv">
                        <div>{this.generateButtons(0, 4)}</div>
                        <div>{this.generateButtons(4, 8)}</div>
                        <div>{this.generateButtons(8, 12)}</div>
                        <div>{this.generateButtons(12, 16)}</div>
                        <div>{this.generateButtons(16, 20)}</div>
                        <div>{this.generateButtons(20, this.AllButtons.length)}</div>
                        <div><button type="button" className="btn btn-success creatorsavebarbutton" disabled={(this.state.EquationText === "") || (this.state.OpenBrackets > 0)}>Save Equation</button></div>
                    </div>
                </div>
            </div>
        );
    }
}
import * as React from "react";
import { RouteComponentProps } from "react-router";

interface ICreatorState
{
    EquationText: string;
    CurrentDisabledButtons: any;
    OpenBrackets: number;
    CurrentNumber: any;
}

/**
 * Functional Component for the creator button
 */
function CreatorButton(props: any)
{
    return (<button type="button" className="creatorbutton" disabled={props.disabled} onClick={props.onClick}>{props.text}</button>);
}

/**
 * Component for the equation creator
 */
export class EquationCreator extends React.Component<RouteComponentProps<any>, ICreatorState>
{
    AllButtons = ["sin", "cos", "(", ")", "7", "8", "9", "×", "4", "5", "6", "÷", "1", "2", "3", "-", "X", "0", ".", "+", "Y", "Z", "⌫", "Reset"];
    DefaultSet = this.AllButtons.length + 1;        //--- This will be used to set the length of states we have and to access the default set of them
    DisButtons = Array(this.DefaultSet);            //--- Here we are using the DefaultSet as length of an array (later it will be used as an index)

    OpenedBrackets = 0;
    CurrentNumber = { active: false, decimaldot: false, zerostarted: false, value: "" };

    StatesHistory = [this.state];
    
    constructor(props: any)
    {
        super(props);
        this.SetDisabledButtons();
        this.SetInitialState();
    }

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

    SetInitialState()
    {
        this.state =
        {
            EquationText: "",
            CurrentDisabledButtons: this.DisButtons[this.DefaultSet],
            OpenBrackets: this.OpenedBrackets,
            CurrentNumber: { active: this.CurrentNumber.active, decimaldot: this.CurrentNumber.decimaldot, zerostarted: this.CurrentNumber.zerostarted, value: this.CurrentNumber.value }   //--- Deep clone since this is an object
        };
    }

    ResetCreator()
    {
        this.OpenedBrackets = 0;
        this.ResetCurrentNumber();
        this.setState(
        {
            EquationText: "",
            CurrentDisabledButtons: this.DisButtons[this.DefaultSet],
            OpenBrackets: this.OpenedBrackets,
            CurrentNumber: { active: this.CurrentNumber.active, decimaldot: this.CurrentNumber.decimaldot, zerostarted: this.CurrentNumber.zerostarted, value: this.CurrentNumber.value }   //--- Deep clone since this is an object
        });
    }

    ResetCurrentNumber()
    {
        //let value = this.CurrentNumber.value;
        this.CurrentNumber.value = "";
        this.CurrentNumber.active =
        this.CurrentNumber.decimaldot =
        this.CurrentNumber.zerostarted = false;
        //return value;
    }

    BackToPreviousState()
    {
        let prestate = this.StatesHistory.shift();
        if (prestate)
        {
            this.setState(prestate);
            this.OpenedBrackets = prestate.OpenBrackets;
            this.CurrentNumber = prestate.CurrentNumber;
        }
    }

    DealWithPress(i: number)
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
                this.ResetCurrentNumber();
                break;
            case "0":
                this.CurrentNumber.value += Symbol;
                this.CurrentNumber.zerostarted = !this.CurrentNumber.active && !this.CurrentNumber.decimaldot;
                this.CurrentNumber.active = true;
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
                this.CurrentNumber.value += Symbol;
                this.CurrentNumber.active = true;
                break;
            case ".":
                this.CurrentNumber.value += Symbol;
                this.CurrentNumber.zerostarted = false;
                this.CurrentNumber.decimaldot = true;
                this.CurrentNumber.active = true;
                break;
            case "Reset":
                this.ResetCreator();
                break;
            case "⌫":
                this.BackToPreviousState();
                break;
            default:
                this.ResetCurrentNumber();
                break;
        }
    }

    GetButtonFinalText(i: number)
    {
        let text = this.AllButtons[i];
        if (text === "sin" || text === "cos") text += "(";
        return text;
    }

    OnButtonClick(i: number)
    {
        if (this.DisButtons[i])
        {
            this.DealWithPress(i);
            if (this.AllButtons[i] === "Reset" || this.AllButtons[i] === "⌫") return;

            let NextDisabledButtons = this.DisButtons[i].slice();   //--- Copy the values and not the references!

            //--- Special Cases
            if (this.OpenedBrackets === 0) NextDisabledButtons.push(")");
            if (this.CurrentNumber.active)
            {
                if (this.CurrentNumber.decimaldot) NextDisabledButtons.push(".")
                else if (this.CurrentNumber.zerostarted) NextDisabledButtons.push("7", "8", "9", "4", "5", "6", "1", "2", "3", "0");
            }

            //--- Set the new state
            this.setState(
            {
                EquationText: this.state.EquationText + this.GetButtonFinalText(i),
                CurrentDisabledButtons: NextDisabledButtons,
                OpenBrackets: this.OpenedBrackets,
                CurrentNumber: { active: this.CurrentNumber.active, decimaldot: this.CurrentNumber.decimaldot, zerostarted: this.CurrentNumber.zerostarted, value: this.CurrentNumber.value }   //--- Deep clone since this is an object
            });

            this.StatesHistory.unshift(this.state);    //--- Save the last state at beginning
        }
        else
        {
            alert("Error (001):\nMissing disabled list for the chosen button.\nPlease Contact Administrator.")
        }
    }

    generateButtons(from: number, to: number)
    {
        var elements = [];
        for (let i = from; i < to; i++)
        {
            elements.push(<CreatorButton text={this.AllButtons[i]} disabled={this.state.CurrentDisabledButtons.includes(this.AllButtons[i])} onClick={() => this.OnButtonClick(i)} />);
        }
        return elements;
    }

    GetEquationValue()
    {
        let equationtext = this.state.EquationText;
        if (equationtext)
            return equationtext.replace("×", "*").replace("÷", "/").replace("X", "var(X)").replace("Y", "var(Y)").replace("Z", "var(Z)")
        else
            return "";
    }

    render()
    {
        return (
            <div>
                <div><h1>Equation Creator</h1></div>
                <div className="creatorcontainerdiv">
                    <div className="creatorfirstdiv">
                        <div><h4>Equation Description:</h4><input type="text" className="form-control" /></div>
                        <div><h4>Current Input:</h4>{this.state.EquationText}</div>
                        <div><h4>Current Value:</h4>{this.GetEquationValue()}</div>
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
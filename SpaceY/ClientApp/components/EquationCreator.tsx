import * as React from "react";
import { RouteComponentProps } from "react-router";
import { IEvaluationResult } from "../interface/IEvaluationResult";
import { IRestEquation } from "../interface/IRestEquation";
import { IRestEquationParam } from "../interface/IRestEquationParam";
import { IRestNestedEquation } from "../interface/IRestNestedEquation";

// --- The creator interface which defines the data structure of our component
interface ICreatorState {
    EquationText: string;
    CurrentDisabledButtons: any;
    OpenBrackets: number;
    NumberStatus: NumberStatus;
    Result: any;
    DefaultValues: number[];
    EquationsList: IRestNestedEquation[];
}

// --- Functional Component for creating the buttons of our component
function CreatorButton(props: any) {
    return (<button type="button" className="creatorbutton" disabled={props.disabled} onClick={props.onClick}>{props.text}</button>);
}

// --- The NumberStatus class defines a type that is going to be used later
class NumberStatus {
    public active: boolean;
    public decimaldot: boolean;
    public zerostarted: boolean;
    public value: string;

    constructor() {
        this.active = this.decimaldot = this.zerostarted = false;
        this.value = "";
    }

    public Update(active: boolean | null, decimaldot: boolean | null, zerostarted: boolean | null, value: string | null) {
        if (active != null) { this.active = active; }
        if (decimaldot != null) { this.decimaldot = decimaldot; }
        if (zerostarted != null) { this.zerostarted = zerostarted; }
        if (value != null) { this.value += value; }
    }

    public Copycat(obj: NumberStatus) {
        this.Update(obj.active, obj.decimaldot, obj.zerostarted, obj.value);
    }

    public Reset() {
        this.active = this.decimaldot = this.zerostarted = false;
        this.value = "";
    }

    public Clone() {
        const result = new NumberStatus();
        result.Copycat(this);
        return result;
    }
}

// --- The main component of our equation creator
export class EquationCreator extends React.Component<RouteComponentProps<any>, ICreatorState> {
    public AllButtons = ["sin", "cos", "(", ")", "7", "8", "9", "×", "4", "5", "6", "÷", "1", "2", "3", "-", "X", "0", ".", "+", "Y", "Z", "⌫", "Reset"];
    public DefaultSet = this.AllButtons.length + 1;        // --- This will be used to set the length of states we have and to access the default set later
    public DisButtons = Array(this.DefaultSet);            // --- Here we are using the DefaultSet as length of an array (later it will be used as an index)

    // --- Temporary variables to be used instead of the component's state
    // --- Those variables will hold the status of input to guide the user
    public OpenedBrackets = 0;
    public NumberStatus = new NumberStatus();
    public DefaultValues = new Array(3).fill(0);

    // --- Keep track of history in a local variable (we might need to store this with the equation itself to enable future editing)
    public StatesHistory: any;

    public IsParsing = false;
    public ShouldRender = false;
    public Description = "";

    // --- Constructor of the component
    constructor(props: any) {
        super(props);
        this.SetDisabledButtons();

        // --- Set the initial state
        this.state = {
            EquationText: "",
            CurrentDisabledButtons: this.DisButtons[this.DefaultSet],
            OpenBrackets: this.OpenedBrackets,
            Result: "",
            NumberStatus: this.NumberStatus.Clone(),
            DefaultValues: this.DefaultValues.slice(),
            EquationsList: [],
        };

        // --- Check if we are in Edit mode and act accordingly
        this.StatesHistory = [this.state];
        this.FetchCurrentEquation();
    }

    // --- The following function defines the set of buttons that need to be disabled after pressing a certain button
    // --- This is neededto guide the user input and form correct equations
    public SetDisabledButtons() {
        // --- Next disabled buttons for (+), (-), (×) and (÷)
        this.DisButtons[this.AllButtons.indexOf("+")] =
        this.DisButtons[this.AllButtons.indexOf("-")] =
        this.DisButtons[this.AllButtons.indexOf("×")] =
        this.DisButtons[this.AllButtons.indexOf("÷")] = ["+", "-", "×", "÷", ".", ")"];

        // --- Next disabled buttons for (Open Bracket), (sin) and (cos)
        this.DisButtons[this.AllButtons.indexOf("(")] =
        this.DisButtons[this.AllButtons.indexOf("sin")] =
        this.DisButtons[this.AllButtons.indexOf("cos")] = ["+", "×", "÷", ".", ")"];

        // --- Next disabled buttons for (Close Bracket)
        this.DisButtons[this.AllButtons.indexOf(")")] = ["sin", "cos", "(", "7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "X", "Y", "Z"];

        // --- Next disabled buttons for (0 - 9)
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

        // --- Next disabled buttons for (.)
        this.DisButtons[this.AllButtons.indexOf(".")] = ["sin", "cos", "(", ")", "×", "÷", "-", ".", "+", "X", "Y", "Z"];

        // --- Next disabled buttons for (X), (Y) and (Z)
        this.DisButtons[this.AllButtons.indexOf("X")] =
        this.DisButtons[this.AllButtons.indexOf("Y")] =
        this.DisButtons[this.AllButtons.indexOf("Z")] = ["sin", "cos", "(", "7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "X", "Y", "Z"];

        // --- Default set of disabled buttons
        this.DisButtons[this.DefaultSet] =
        this.DisButtons[this.AllButtons.indexOf("Reset")] = ["+", "×", "÷", ".", ")", "⌫"];

        // --- Default set of disabled buttons
        this.DisButtons[this.AllButtons.indexOf("⌫")] = [];
    }

    // --- Function to Reset our component
    public ResetCreator() {
        this.OpenedBrackets = 0;
        this.ResetNumberStatus();
        this.setState(
        {
            EquationText: "",
            CurrentDisabledButtons: this.DisButtons[this.DefaultSet],
            OpenBrackets: this.OpenedBrackets,
            Result: "",
            NumberStatus: new NumberStatus(),
            DefaultValues: new Array(3).fill(0),
        });

        // --- We should reset history as well
        this.StatesHistory = [this.state];
    }

    // --- Function to Reset the local NumberStatus variable
    public ResetNumberStatus() {
        this.NumberStatus.Reset();
    }

    // --- Undo the last press and go back to a previous state
    public BackToPreviousState() {
        const PreState = this.StatesHistory.shift();
        if (PreState) {
            this.setState(PreState);
            this.OpenedBrackets = PreState.OpenBrackets;
            this.NumberStatus = PreState.NumberStatus.Clone();
            this.DefaultValues = this.DefaultValues.slice();    // --- We keep the current values always
        }
    }

    // --- Do what is necessary for each button we have in our component
    public DealWithButton(i: number) {
        const Symbol = this.AllButtons[i];

        switch (Symbol) {
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

    // --- This is needed because some buttons should generate a value different than their showing texts
    public GetButtonFinalText(i: number) {
        let text = this.AllButtons[i];
        if (text === "sin" || text === "cos") { text += "("; }
        return text;
    }

    // --- This function is called whenever a button is clicked
    public OnButtonClick(i: number) {
        if (this.DisButtons[i]) {
            this.DealWithButton(i);
            if (this.AllButtons[i] === "Reset" || this.AllButtons[i] === "⌫") { return; }   // --- No more changes are needed

            const NextDisabledButtons = this.DisButtons[i].slice();   // --- Copy the values and not the references!

            // --- Special Cases
            if (this.OpenedBrackets === 0) { NextDisabledButtons.push(")"); }
            if (this.NumberStatus.active) {
                if (this.NumberStatus.decimaldot) { NextDisabledButtons.push("."); } else if (this.NumberStatus.zerostarted) { NextDisabledButtons.push("7", "8", "9", "4", "5", "6", "1", "2", "3", "0"); }
            }

            // --- Set the new state to update and re-render the component
            this.setState(
            {
                EquationText: this.state.EquationText + this.GetButtonFinalText(i),
                CurrentDisabledButtons: NextDisabledButtons,
                OpenBrackets: this.OpenedBrackets,
                NumberStatus: this.NumberStatus.Clone(),
                DefaultValues: this.DefaultValues.slice(),
            });

            this.StatesHistory.unshift(this.state);    // --- Save the last state at beginning of our history array
        } else {
            alert("Error (001):\nMissing disabled list for the chosen button.\nPlease Contact Administrator.");
        }
    }

    // --- Generate a subset only of the buttons of our component
    public generateButtons(from: number, to: number) {
        const elements = [];
        for (let i = from; i < to; i++) {
            elements.push(<CreatorButton text={this.AllButtons[i]} disabled={this.state.CurrentDisabledButtons.includes(this.AllButtons[i])} onClick={() => this.OnButtonClick(i)} />);
        }
        return elements;
    }

    public OnDropdownClicked(EQID: any) {
        const NextDisabledButtons = this.DisButtons[this.AllButtons.indexOf("X")].slice();   // --- Copy the values and not the references!

        // --- Special Cases
        if (this.OpenedBrackets === 0) { NextDisabledButtons.push(")"); }

        // --- Set the new state to update and re-render the component
        this.setState(
            {
                EquationText: this.state.EquationText + "EQ(" + EQID + ")",
                CurrentDisabledButtons: NextDisabledButtons,
                OpenBrackets: this.OpenedBrackets,
                NumberStatus: this.NumberStatus.Clone(),
                DefaultValues: this.DefaultValues.slice(),
            });

        this.StatesHistory.unshift(this.state);    // --- Save the last state at beginning of our history array
    }

    // --- Generate a drop down list of all available equations
    public generateEquationsDropdown() {
        fetch(`api/equations?all=true`)
        .then((response) => response.json() as Promise<IRestNestedEquation[]>)
        .then((data) => { this.setState({ EquationsList: data }); });

        return (
            <div className="dropdown">
                <button className="creatorbutton equationddlbutton dropdown-toggle" type="button" data-toggle="dropdown" disabled={this.state.CurrentDisabledButtons.includes("X")}>Reference an Equation <span className="caret"></span></button>
                <ul className="dropdown-menu scrollable-menu">
                    {this.state.EquationsList.map((item) => <li><a className="eq-nav-link" onClick={() => this.OnDropdownClicked(item.main.id)}>{item.main.description + " (" + item.main.equation + ")"}</a></li>)}
                </ul>
            </div>
        );
    }

    // --- Get the value of the current equation which should be sent to the backend
    public GetEquationValue() {
        let equationtext = this.state.EquationText;
        let openBrackets = this.state.OpenBrackets;

        // Remove trailing operators
        const trailingOperator = /([×÷\+\-\(\.]|sin|cos)$/;
        while (equationtext.match(trailingOperator)) {
            if (equationtext.match(/\($/)) { openBrackets--; }
            equationtext = equationtext.replace(trailingOperator, "");
        }

        if (equationtext) {
            let result = equationtext
                // Replace tokens with interface variants
                .replace(/×/g, "*")
                .replace(/÷/g, "/")
                .replace(/X/g, `var(${this.GetUsedParams().indexOf("X")})`)
                .replace(/Y/g, `var(${this.GetUsedParams().indexOf("Y")})`)
                .replace(/Z/g, `var(${this.GetUsedParams().indexOf("Z")})`)
                .replace(/sin\(/g, "Sin\(")
                .replace(/cos\(/g, "Cos\(")
                .replace(/EQ/g, "Ref");
            for (let i = 0; i < openBrackets; ++i) {
                result += ")";
            }
            return result;
        } else {
            return "";
        }
    }

    // -- Build a rest equation form the current state
    public GetRestEquation(): IRestEquation {
        const usedParams = this.GetUsedParams();
        const params = [];
        for (const param of usedParams) {
            const index = ["X", "Y", "Z"].indexOf(param);
            params.push({ name: param, standard: this.state.DefaultValues[index] } as IRestEquationParam);
        }

        const desc = this.Description === "" ? "Equation with no description" : this.Description;

        if (this.props.match.params.id) {
            return { id: this.props.match.params.id, description: desc, equation: this.GetEquationValue(), parameters: params } as IRestEquation;
        } else {
            return { id: -1, description: desc, equation: this.GetEquationValue(), parameters: params } as IRestEquation;
        }
    }

    // -- Get the used parameters
    public GetUsedParams() {
        const paramnames = ["X", "Y", "Z"];
        const result = [];
        for (const param of paramnames) {
            if (this.state.EquationText.includes(param)) {
                result.push(param);
            }
        }
        return result;
    }

    // -- Called on every change to fetch data from server
    public componentDidUpdate(prevProps: any, prevState: ICreatorState) {
        if (!this.IsParsing && (prevState.EquationText !== this.state.EquationText || prevState.DefaultValues !== this.state.DefaultValues)) {
            this.setState({ Result: "Calculating ..." });

            // Post current equation to evaluator
            fetch("api/Equations/Evaluate",
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.GetRestEquation()),
            })
            // Interpret answer as result, and update state
            .then((response) => response.json() as Promise<IEvaluationResult>)
            .then((data) => { if (data.success) { this.setState({ Result: data.value }); } else { this.setState({ Result: "Invalid equation" }); } });
        }
    }

    public SaveEquation() {
        // Post current equation
        fetch("api/Equations/",
                {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(this.GetRestEquation()),
                })
            // Interpret answer as result, and update state
            .then((response) => {
                if (response.status === 201) {
                    this.props.history.push(response.headers.get("Location") as any);
                }
            });
    }

    public UpdateDefaultValues(i: number, val: any) {
        if (i === 0) { this.DefaultValues[0] = val.target.value; }
        if (i === 1) { this.DefaultValues[1] = val.target.value; }
        if (i === 2) { this.DefaultValues[2] = val.target.value; }

        this.setState({ DefaultValues: this.DefaultValues.slice() });
    }

    // --- This function gets the equation ID we want to edit if available and Prepare the component to deal with it
    public FetchCurrentEquation() {
        if (this.props.match.params.id) {
            this.IsParsing = true;
            fetch(`api/Equations/${this.props.match.params.id}`)
                .then((response) => response.json() as Promise<IRestNestedEquation>)
                .then((data) => { this.ReloadComponentByEquationText(data.main); });
        } else {
            this.IsParsing = false;
            this.ShouldRender = true;
        }
    }

    // --- This function Reloads the component using the text the current equation we want to edit
    public ReloadComponentByEquationText(Eq: IRestEquation) {
        const EqText = Eq.equation;
        const txt = EqText.replace(/\//g, "÷")
                        .replace(/\*/g, "×")
                        .replace(/v/g, "V")
                        .replace(/Var\(0\)/g, "X")
                        .replace(/Var\(1\)/g, "Y")
                        .replace(/Var\(2\)/g, "Z")
                        .replace(/Sin\(/g, "s")
                        .replace(/Cos\(/g, "c")
                        .replace(/Ref\(/g, "e")
                        .replace(/ref\(/g, "e")
                        .replace(/\s/g, "");

        let i = 0;
        while (i < txt.length) {
            let index = -1;

            if (txt[i] === "s") {
                index = this.AllButtons.indexOf("sin");
            } else if (txt[i] === "c") {
                index = this.AllButtons.indexOf("cos");
            } else if (txt[i] === "e") {
                i++;        // --- Ignore the 'e' itself

                let EQID = "";
                while (txt[i] !== ")") {
                    EQID += txt[i];
                    i++;
                }

                this.IsParsing = (i < txt.length - 1);       // --- Just in case the Reference was at the end of equation
                this.OnDropdownClicked(EQID);

                i++;        // --- Ignore the Closing bracket of EQ(id)
                continue;   // --- Continue to the next char
            } else {
                index = this.AllButtons.indexOf(txt[i]);
            }

            this.IsParsing = (i < txt.length - 1);       // --- We finish parsing when dealing with the last symbol.
            this.OnButtonClick(index);

            i++;    // --- increase the index!
        }

        this.Description = Eq.description;
        this.ShouldRender = true;
        this.setState({ Result: "Calculating ..." });   // --- So we force updating results.
        this.StatesHistory.shift();
    }

    public UpdateDescription(val: any) {
        this.Description = val.target.value;
    }

    // --- The render function of our component
    public render() {
        if (!this.ShouldRender) { return (<div><h1>Equation Creator</h1><div><p>Loading..</p></div></div>); }

        return (
            <div>
                <div><h1>Equation Creator</h1></div>
                <div className="creatorcontainerdiv">
                    <div className="creatorfirstdiv">
                        <div><h4>Equation Description:</h4><input type="text" value={this.Description} className="form-control" onChange={(val) => this.UpdateDescription(val)} /></div>
                        <div><h4>Current Input:</h4>
                            <textarea readOnly={true} rows={1} className="form-control creatortextarea" value={this.state.EquationText} />
                        </div>
                        <div><h4>Current Value:</h4>
                            <textarea readOnly={true} rows={1} className="form-control creatortextarea" value={this.GetEquationValue()} /></div>
                        <div>
                            <table>
                                <tr>
                                    <td><h5>X Value:</h5><input type="number" name="DefaultValueX" defaultValue={this.DefaultValues[0].toString()} className="form-control creatordefaultvalue" onChange={(val) => this.UpdateDefaultValues(0, val)} /></td>
                                    <td><h5>Y Value:</h5><input type="number" name="DefaultValueY" defaultValue={this.DefaultValues[1].toString()} className="form-control creatordefaultvalue" onChange={(val) => this.UpdateDefaultValues(1, val)} /></td>
                                    <td><h5>Z Value:</h5><input type="number" name="DefaultValueZ" defaultValue={this.DefaultValues[2].toString()} className="form-control creatordefaultvalue" onChange={(val) => this.UpdateDefaultValues(2, val)} /></td>
                                </tr>
                            </table>
                        </div>
                        <div><h4>Result: </h4></div>
                        <p><strong>{this.state.Result}</strong></p>
                        <span className="text-danger" hidden={this.OpenedBrackets === 0}>Note: Some open brackets are still not closed!</span>
                    </div>
                    <div className="creatorseconddiv">
                        <div>{this.generateButtons(0, 4)}</div>
                        <div>{this.generateButtons(4, 8)}</div>
                        <div>{this.generateButtons(8, 12)}</div>
                        <div>{this.generateButtons(12, 16)}</div>
                        <div>{this.generateButtons(16, 20)}</div>
                        <div>{this.generateButtons(20, 24)}</div>
                        <div>{this.generateEquationsDropdown()}</div>
                        <div><button type="button" className="btn btn-success creatorsavebarbutton" disabled={(this.state.EquationText === "") || (this.state.OpenBrackets > 0)} onClick={() => this.SaveEquation()}>Save Equation</button></div>
                    </div>
                </div>
            </div>
        );
    }
}

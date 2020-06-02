const buttons = [
  { id: "watermark", disp: "HS" },
  { id: "clear", disp: "AC" },
  { id: "divide", disp: "/" },
  { id: "seven", disp: "7" },
  { id: "eight", disp: "8" },
  { id: "nine", disp: "9" },
  { id: "multiply", disp: "*" },
  { id: "four", disp: "4" },
  { id: "five", disp: "5" },
  { id: "six", disp: "6" },
  { id: "subtract", disp: "-" },
  { id: "one", disp: "1" },
  { id: "two", disp: "2" },
  { id: "three", disp: "3" },
  { id: "add", disp: "+" },
  { id: "zero", disp: "0" },
  { id: "decimal", disp: "." },
  { id: "equals", disp: "=" },
];

const operators = /\+|-|\*|\//;

function eval_exp(array) {
  let expression = [...array];
  let running_total = parseFloat(expression[0]);

  if (operators.test(expression[expression.length - 1])) {
    if (operators.test(expression[expression.length - 3])) {
      expression = expression.slice(0, expression.length - 3);
    } else {
      expression = expression.slice(0, expression.length - 2);
    }
  }
  for (let i = 1; i < expression.length; i++) {
    if (operators.test(expression[i])) {
      if (expression[i + 1] === "-") {
        switch (expression[i]) {
          case "+":
            running_total -= parseFloat(expression[i + 2]);
            break;
          case "*":
            running_total *= -1 * parseFloat(expression[i + 2]);
            break;
          case "/":
            running_total /= -1 * parseFloat(expression[i + 2]);
            break;
          default:
            break;
        }
        i++;
      } else {
        switch (expression[i]) {
          case "+":
            running_total += parseFloat(expression[i + 1]);
            break;
          case "-":
            running_total -= parseFloat(expression[i + 1]);
            break;
          case "*":
            running_total *= parseFloat(expression[i + 1]);
            break;
          case "/":
            running_total /= parseFloat(expression[i + 1]);
            break;
          default:
            break;
        }
      }
    }
  }
  return running_total;
}

class Display extends React.Component {
  render() {
    return (
      <div id="display-overall">
        <div id="display-total">{this.props.secondary.join(" ")}</div>
        <div id="display">{this.props.primary}</div>
      </div>
    );
  }
}

class Buttons extends React.Component {
  render() {
    return (
      <div id="buttons">
        {this.props.buttons.map((button) => {
          return (
            <div
              onClick={() => this.props.onPress(button.disp)}
              key={button.id}
              className="button"
              id={button.id}
            >
              {button.disp}
            </div>
          );
        })}
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calcItems: [],
      currentCalc: "A JavaScript Calculator",
      overallCalc: "",
      lastOutput: null,
      operation: "",
      clearExp: true,
      clearLog: false,
    };
  }

  handlePress = (input) => {
    switch (input) {
      case "AC":
        // Reset everything
        this.setState({
          currentCalc: "0",
          calcItems: [],
          clearExp: true,
          lastOutput: null,
        });
        break;
      case "+":
      case "-":
      case "*":
      case "/":
        if (
          this.state.currentCalc.length === 1 &&
          operators.test(this.state.currentCalc)
        ) {
          // Multiple operator selections. Handle exception for subtraction (negative)
          if (this.state.currentCalc === "-") {
            if (input === "-") {
              break;
            } else {
              if (
                operators.test(
                  this.state.calcItems[this.state.calcItems.length - 2]
                )
              ) {
                this.setState({
                  calcItems: [
                    ...this.state.calcItems.slice(
                      0,
                      this.state.calcItems.length - 2
                    ),
                    input,
                  ],
                  currentCalc: input,
                });
                break;
              } else {
                this.setState({
                  calcItems: [
                    ...this.state.calcItems.slice(
                      0,
                      this.state.calcItems.length - 1
                    ),
                    input,
                  ],
                  currentCalc: input,
                });
                break;
              }
            }
          } else {
            if (input === "-") {
              this.setState({
                calcItems: [...this.state.calcItems, input],
                currentCalc: input,
              });
              break;
            } else {
              this.setState({
                calcItems: [
                  ...this.state.calcItems.slice(
                    0,
                    this.state.calcItems.length - 1
                  ),
                  input,
                ],
                currentCalc: input,
              });
              break;
            }
          }
        }
        if (this.state.clearExp === true && this.state.lastOutput != null) {
          // User presses function after a recent calculation
          this.setState({
            calcItems: [String(this.state.lastOutput), input],
            lastOutput: null,
            currentCalc: input,
            operation: input,
            clearExp: true,
            clearLog: false,
          });
          break;
        } else if (this.state.clearLog === true) {
          // New calculation without using previous value
          this.setState({
            calcItems: [this.state.currentCalc, input],
            currentCalc: input,
            clearLog: false,
            clearExp: true,
          });
          break;
        } else {
          this.setState({
            calcItems: [...this.state.calcItems, this.state.currentCalc, input],
            currentCalc: input,
            operation: input,
            clearExp: true,
          });
          break;
        }
      case ".":
        // Ensure no double period usage
        if (this.state.currentCalc.includes(".")) {
          break;
        } else {
          this.setState({
            currentCalc: this.state.currentCalc + input,
          });
          break;
        }

      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
        if (this.state.clearExp === true) {
          // For new entries
          this.setState({
            currentCalc: input,
            lastOutput: null,
            clearExp: false,
          });
          break;
        } else if (
          this.state.currentCalc[0] === "0" &&
          this.state.currentCalc.length === 1
        ) {
          if (input === "0") {
            // Prevent multiple leading zeros
            break;
          } else {
            this.setState({
              currentCalc: input,
            });
            break;
          }
        } else {
          // Regular inputs
          this.setState({
            currentCalc: this.state.currentCalc + input,
          });
          break;
        }

      case "=":
        if (this.state.clearLog === true) {
          // Prevent duplicative calculations
          break;
        }

        let buffer = [...this.state.calcItems, this.state.currentCalc];
        let output = eval_exp(buffer);

        this.setState({
          calcItems:
            operators.test(
              this.state.calcItems[this.state.calcItems.length - 2]
            ) && operators.test(this.state.currentCalc)
              ? [
                  ...this.state.calcItems.slice(
                    0,
                    this.state.calcItems.length - 2
                  ),
                  "=",
                  output,
                ]
              : operators.test(this.state.currentCalc)
              ? [
                  ...this.state.calcItems.slice(
                    0,
                    this.state.calcItems.length - 1
                  ),
                  "=",
                  output,
                ]
              : [...this.state.calcItems, this.state.currentCalc, "=", output],
          lastOutput: output,
          currentCalc: String(output),
          clearExp: true,
          clearLog: true,
        });
        break;
      case "HS":
        this.setState({
          currentCalc: "Brought to you by Hal S.",
          calcItems: [],
          clearExp: true,
          clearLog: true,
        });
        break;
      default:
        this.setState({
          currentCalc: this.state.currentCalc + input,
        });
        break;
    }
  };

  render() {
    return (
      <div id="calculator">
        <Display
          primary={this.state.currentCalc}
          secondary={this.state.calcItems}
        />
        <Buttons buttons={buttons} onPress={this.handlePress} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));

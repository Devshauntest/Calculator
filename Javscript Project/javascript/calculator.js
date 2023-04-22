//creates an object to keep track of values
const Calculator = {
    //this will display 0 on the calculator screen
    Display_Value: '0',
    //This will hold the first opeprand for any expressions, we set it to null for now.
    First_Operand: null,
    //This checks wether or not the second operand has been inputted by the user
    Wait_Second_Operand: false,
    operator: null,
};

//This modifies values each time a button is clicked on.
function Input_Digit(digit) {
    const { Display_Value, Wait_Second_Operand } = Calculator;
    //this checks if the Wait-Second_Oerand id true and sets Display_Value
    //to the key that was clicked on.
    if (Wait_Second_Operand === true) {
        Calculator.Display_Value = digit;
        Calculator.Wait_Second_Operand = false;
    } else {
        //this overwrites Display_Value if the current value is 0
        //otherwise it adds onto it
        Calculator.Display_Value = Display_Value === '0' ? digit : Display_Value + digit;
    }
}

//This section handles decimal points
function Input_Decimal(dot) {
    //this ensures that accidental clicking of the decimal points doesnt 
    //cause bugs in the operation
    if (Calculator.Wait_Second_Operand === true) return;
    if (!Calculator.Display_Value.includes(dot)) {
        //we are saying tht if the Display_value does not contain a decimal point
        //we wanr to add a decimal dot
        Calculator.Display_Value += dot;
    }
}

//This section handles operators
function Handle_Operator(Next_Operator) {
    const { First_Operand, Display_Value, operator } = Calculator;
    //when an operator key is ressed we convert the current number
    //displayed on the screen to a numer and then store the result in
    //calculator.first_Operand if it doesnt alrleady exist
    const Value_of_Input = parseFloat(Display_Value);
    // checks if an operator already exists an if wait_Second_Operand is truee,
    //then updates the operator an exits from the function.
    if (operator && Calculator.Wait_Second_Operand) {
        Calculator.operator = Next_Operator;
        return;
    }

    if (First_Operand == null) {
        Calculator.First_Operand = Value_of_Input;
    } else if (operator) {
        //checks if an operator already exist
        const Value_Now = First_Operand || 0;
        let result = Perform_Calculation[operator](Value_Now, Value_of_Input);
        result = Number(result).toFixed(9);
        //this will remve any trailing 0's
        result = (result * 1).toString();
        Calculator.Display_Value = parseFloat(result);
        Calculator.First_Operand = parseFloat(result);
    }
    Calculator.Wait_Second_Operand = true;
    Calculator.operator = Next_Operator;
}

const Perform_Calculation = {
    '/': (First_Operand, Second_Operand) => First_Operand / Second_Operand,
    '*': (First_Operand, Second_Operand) => First_Operand * Second_Operand,
    '+': (First_Operand, Second_Operand) => First_Operand + Second_Operand,
    '-': (First_Operand, Second_Operand) => First_Operand - Second_Operand,
    '=': (First_Operand, Second_Operand) => Second_Operand
};
function Calculator_Reset() {
    Calculator.Display_Value = '0';
    Calculator.First_Operand = null;
    Calculator.Wait_Second_Operand = false;
    Calculator.operator = null;
}
//Ths function updates the calculator screen with the content of Display_value
function Update_Display() {
    //makes use of the calculator-screen class to target the
    //input tag in the Html document
    const display = document.querySelector('.calculator-screen');
    display.value = Calculator.Display_Value;
}

Update_Display();
//this section monitors button click
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    //the target variable is an object that represents the element
    //that was clicked 
    const { target } = event;
    //if th element that was clicked on is not a button, exit the function
    if (!target.matches('button')) {
        return;
    }
    if (target.classList.contains('operator')) {
        Handle_Operator(target.value);
        Update_Display();
        return
    }

    if (target.classList.contains('decimal')) {
        Input_Decimal(target.value);
        Update_Display();
        return;
    }
    // ensure that AC clears all input from the calculator screen.
    if (target.classList.contains('all-clear')) {
        Calculator_Reset();
        Update_Display();
        return;
    }
    Input_Digit(target.value);
    Update_Display();
})
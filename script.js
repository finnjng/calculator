let num1 = 0;
let toClear = false;
let input = [];
let operator = null;
let operated = false;
let equaled = false;
const OPERATORS = ['+', '-', 'x', '÷'];

const btnContainer = document.querySelector("body");

const numDisplay = document.querySelector(".num");

const op = document.querySelector(".op");

const acc = document.querySelector(".acc");

const add = (num1, num2) => +num1 + +num2;

const subtract = (num1, num2) => num1 - num2;

const multiply = (num1, num2) => num1 * num2;

const divide = (num1, num2) => {
    return num1 / num2;
};

const operate = (operator, num1, num2) => {
    num1 = num1.toString().includes("%") ? parseFloat(num1.slice(0, -1)) / 100 : num1;
    num2 = num2.toString().includes("%") ? parseFloat(num2.slice(0, -1)) / 100 : num2;
    if (operator === '+') return add(num1, num2);
    if (operator === '-') return subtract(num1, num2);
    if (operator === 'x') return multiply(num1, num2);
    if (operator === '÷') return divide(num1, num2);
};

const isOperator = (input) => OPERATORS.some(op => input === op);

const clearInput = () => input.splice(0, input.length);

const toRound = (num) => {
    if (num.toString().length > 9 && num.toString().split(".")[0].length < 9) {
        return num.toFixed(8 - num.toString().split(".")[0].length)
    }
    return parseFloat(num);
};

const display = (str) => {
    if (str.toString().split(".")[0].length > 9 && !str.toString().includes("e")) {
        let percentage = false;
        if (str.toString().includes("%")) {
            str = str.slice(0, -1);
            percentage = true;
        }
        let notation = str.toString().split(".")[0] / (10 ** (str.toString().split(".")[0].length - 1));
        numDisplay.textContent = `${notation.toFixed(2)}e+${str.toString().split(".")[0].length} ${percentage ? "%" : ''}`;
    } else if (str.toString().length > 9 && str.toString().includes(".")) {
        if (str.toString().includes("%")) {
            str = str.slice(0, -1);
            percentage = true;
        }
        numDisplay.textContent = Math.round(str) + "%";
    } else if (str.toString().includes("e")) {
        numDisplay.textContent = parseFloat(str.split(/(?=e)/g)[0]).toFixed(2) + str.split(/(?=e)/g)[1];
    } else if (str === Infinity) {
        numDisplay.textContent = "Undefined";
    } else {
        numDisplay.textContent = str;
    }
};

const negativeToggle = () => {
    if (operated === false) {
        if (input.includes("-")) {
            input.shift();
        } else {
            input.unshift("-");
        }
        display(input.join(''));
    } else {
        num1 *= -1;
        display(num1);
    }
};

display(num1);

btnContainer.addEventListener("click", (e) => {
    if (isOperator(e.target.textContent)) { //if operator is clicked
        if (!operator) {
            num1 = equaled ? num1 : input.join('');
        }
        if (operator && operated === false) {
            num1 = toRound(operate(operator, num1, input.join('')));
            display(num1);
        }
        operator = e.target.textContent;
        op.textContent = e.target.textContent;
        acc.textContent = num1 === '' ? 0 : num1 === Infinity ? "Undefined" : num1;
        operated = true;
        toClear = true;
        equaled = false;
    }
    if (!isNaN(e.target.textContent) &&
        input.length <= 9 &&
        !(e.target.id === "backspace" || e.target.closest("#backspace"))) { //if number is clicked
        if (input.includes("%")) {
            num1 = operator ? operate(operator, num1, input.join('')) : input.join('');
            acc.textContent = num1;
            operator = "x";
            op.textContent = operator;
            operated = true;
        }

        if (toClear) {
            clearInput();
            toClear = false;
        }
        if (input.length < 9 && !(input.length == 0 && e.target.textContent == "0")) {
            input.push(e.target.textContent);
        }
        display(input.length == 0 ? 0 : input.join(''));
        operated = false;
        equaled = false;
    }

    if (e.target.textContent === "=" && operator && operated === false) {
        num1 = toRound(operate(operator, num1, input.join('')));
        display(num1);
        acc.textContent = num1 === Infinity ? "Undefined" : num1;
        toClear = true;
        operator = null;
        op.textContent = operator;
        operated = true;
        equaled = true;
    }

    if (e.target.textContent === "AC") {
        clearInput();
        num1 = 0;
        display(num1);
        operator = null;
        op.textContent = operator;
        acc.textContent = null;
    }

    if (e.target.id === "backspace" || e.target.closest("#backspace")) {
        if (operated === false) {
            input.pop();
            display(input.length == 0 ? 0 : input.join(''));
        } else {
            num1 = Math.floor(num1 / 10);
            display(num1);
        }
    }

    if (e.target.textContent === "+/-") {
        negativeToggle();
    }

    if (e.target.textContent === ".") {
        if (operated === false && !input.includes(".") && !input.includes("0.")) {
            input.push(input.length == 0 ? "0." : ".");
            display(input.join(''));
        } else if (operated === true) {
            clearInput();
            input.push("0.");
            display(input.join(''));
            toClear = false;
        }
    }

    if (e.target.textContent === "%") {
        if (!equaled) {
            if (!input.toString().includes("%")) {
                input.push("%");
                display(input.join(''));
                toClear = true;
            } else {
                input.pop("%");
                display(input.join(''));
            }
        } else {
            if (!num1.toString().includes("%")) {
                num1 = num1 + "%";
                display(num1);
                toClear = true;
            } else {
                num1 = num1.toString().slice(0, -1);
                display(num1);
            }
        }
    }
});

document.addEventListener('keydown', (e) => {
    const keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '+': '+', '-': '-', '/': '÷',
        'Enter': '=', '=': '=',
        'Escape': 'AC',
        'Backspace': 'backspace',
        '.': '.',
        '%': '%'
    };

    if (e.key === '*' || (e.key === '8' && e.shiftKey)) {
        e.preventDefault();
        const buttons = document.querySelectorAll('button');
        const multiplyBtn = Array.from(buttons).find(
            btn => btn.textContent.trim() === 'x'
        );
        if (multiplyBtn) {
            multiplyBtn.classList.add('key-press');
            setTimeout(() => multiplyBtn.classList.remove('key-press'), 100);
            multiplyBtn.click();
        }
    }

    const buttonIdentifier = keyMap[e.key];

    if (buttonIdentifier) {
        e.preventDefault();
        let button;
        button = document.getElementById(buttonIdentifier);
        if (!button) {
            const buttons = document.querySelectorAll('button');
            button = Array.from(buttons).find(
                btn => btn.textContent.trim() === buttonIdentifier
            );
        }
        if (button) {
            button.classList.add('key-press');
            setTimeout(() => button.classList.remove('key-press'), 100);
            button.click();
        }
    }
});

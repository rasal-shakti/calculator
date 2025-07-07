        let currentOperation = '0';
        let previousOperation = '';
        let operationInProgress = false;
        let decimalAdded = false;

        const currentOperationDisplay = document.getElementById('current-operation');
        const previousOperationDisplay = document.getElementById('previous-operation');

        function updateDisplay() {
            currentOperationDisplay.textContent = currentOperation;
            previousOperationDisplay.textContent = previousOperation;
        }

        function appendNumber(number) {
            if (currentOperation === '0' || operationInProgress) {
                currentOperation = number;
                operationInProgress = false;
            } else {
                currentOperation += number;
            }
            updateDisplay();
        }

        function appendDecimal() {
            if (operationInProgress || currentOperation === '0') {
                currentOperation = '0.';
                operationInProgress = false;
            } else if (!currentOperation.includes('.')) {
                currentOperation += '.';
            }
            updateDisplay();
        }

        function appendOperator(operator) {
            if (currentOperation === '0' && previousOperation === '') return;
            
            if (operationInProgress) {
                // Replace the last operator if another operator is clicked
                previousOperation = previousOperation.slice(0, -1) + operator;
            } else {
                previousOperation = currentOperation + operator;
            }
            
            currentOperation = '0';
            operationInProgress = true;
            decimalAdded = false;
            updateDisplay();
        }

        function calculate() {
            if (previousOperation === '' || operationInProgress) return;
            
            let expression = previousOperation + currentOperation;
            
            try {
                // Replace × with * for evaluation
                expression = expression.replace(/×/g, '*');
                
                // Avoid using eval in production - this is just for demonstration
                currentOperation = eval(expression).toString();
                previousOperation = '';
                operationInProgress = false;
                decimalAdded = currentOperation.includes('.');
                updateDisplay();
            } catch (error) {
                currentOperation = 'Error';
                previousOperation = '';
                updateDisplay();
                setTimeout(() => {
                    clearAll();
                }, 1500);
            }
        }

        function clearAll() {
            currentOperation = '0';
            previousOperation = '';
            operationInProgress = false;
            decimalAdded = false;
            updateDisplay();
        }

        function deleteLastChar() {
            if (currentOperation.length === 1) {
                currentOperation = '0';
            } else {
                currentOperation = currentOperation.slice(0, -1);
            }
            updateDisplay();
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
                e.preventDefault();
                if (e.key === '.') {
                    appendDecimal();
                } else {
                    appendNumber(e.key);
                }
            } else if (['+', '-', '*', '/', '(', ')'].includes(e.key)) {
                e.preventDefault();
                const operator = e.key === '*' ? '×' : e.key;
                appendOperator(operator);
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                calculate();
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                deleteLastChar();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                clearAll();
            }
        });
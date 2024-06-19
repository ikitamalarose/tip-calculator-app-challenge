const inputList = document.querySelectorAll('input');
const inputWrapperList = document.querySelectorAll('.input-wrapper');

const inputWrapperBill = document.querySelector('.input-wrapper--bill');
const inputWrapperPeople = document.querySelector('.input-wrapper--people');

const inputCustom = document.getElementById('custom');

const form = document.getElementById('form');

/* Initialisation */

setupInputClickHandlers(inputList);
/* form.addEventListener('submit', validateForm);
 */
function setupInputClickHandlers(inputs) {
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            removeAllBorders();
            setBorder(getWrapper(input.id));
            enableRealTimeValidation(input);

        });
        input.addEventListener('blur', () => {
            validateForm();
        });
    });


}

function removeAllBorders() {
    inputWrapperList.forEach(wrapper => wrapper.classList.remove('input-wrapper-color'));
    inputCustom.classList.remove('input-wrapper-color');
}

function setBorder(wrapper) {
    if (wrapper) wrapper.classList.add('input-wrapper-color');
}

function getWrapper(inputId) {
    if (inputId.includes('people')) return inputWrapperPeople;
    if (inputId.includes('bill')) return inputWrapperBill;
    if (inputId.includes('custom')) return inputCustom;
    return null;
}

function enableRealTimeValidation(input) {
    input.addEventListener('input', () => validateField(input));
}

function validateField(input) {
    /*  const input = event.target; */
    const value = input.value;
    const wrapper = input.closest('.input-wrapper');
    const errorMessage = document.getElementById(`error-${input.id}`);

    const isValid = validateValue(value);

    if (!isValid) {
        if (input.id === 'custom') {
            setBorderError(input);
        } else {
            setBorderError(wrapper);
        }
        errorMessage.textContent = getErrorMessage(value);
    } else {
        if (input.id === 'custom') {
            input.classList.remove('input-wrapper-error');
        } else {
            wrapper.classList.remove('input-wrapper-error');
        }
        errorMessage.textContent = '';
    }

    return isValid;
}

function validateValue(value) {
    return !isNaN(value) && value.trim() !== '' && value > 0;
}

function setBorderError(element) {
    element.classList.add('input-wrapper-error');
}

function getErrorMessage(value) {
    if (isNaN(value)) {
        return 'Enter a number';
    } else if (value.trim() === '') {
        return "Can't be space";
    } else if (value < 0) {
        return "Can't be negative";
    } else if (value == 0) {
        return "Can't be zero";
    }
}

function validateForm() {
    let isFormValid = validateAllFields();

    if (isFormValid) {
        const formValues = getFormValues();
        console.log('Form Data:', formValues);

        const { bill, customTip, numberOfPeople } = formValues;

        const { tipAmountPerPerson, totalAmountPerPerson } = calculateTipAndTotal(bill, customTip, numberOfPeople);

        updateResults(tipAmountPerPerson, totalAmountPerPerson);
    }else{
        resetResults();
    }
}

function validateAllFields() {
    let isFormValid = true;

    inputList.forEach(input => {
        const isValid = validateField(input);
        if (!isValid) {
            isFormValid = false;
        }
    });

    return isFormValid;
}

function getFormValues() {
    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    return {
        bill: parseFloat(formValues.bill),
        customTip: parseFloat(formValues.custom),
        numberOfPeople: parseInt(formValues.people, 10)
    };
}

function updateResults(tipAmountPerPerson, totalAmountPerPerson) {
    document.getElementById('tipAmount').textContent = `$${tipAmountPerPerson}`;
    document.getElementById('totalAmount').textContent = `$${totalAmountPerPerson}`;
}

function resetResults() {
    document.getElementById('tipAmount').textContent = "$0.00";
    document.getElementById('totalAmount').textContent = "$0.00";
}

function calculateTipAndTotal(bill, tipPercentage, numberOfPeople) {
    const tipAmountPerPerson = (bill * (tipPercentage / 100)) / numberOfPeople;
    const totalAmountPerPerson = (bill + (bill * (tipPercentage / 100))) / numberOfPeople;

    return {
        tipAmountPerPerson: tipAmountPerPerson.toFixed(2),
        totalAmountPerPerson: totalAmountPerPerson.toFixed(2)
    };
}




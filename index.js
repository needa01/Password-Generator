const slider = document.querySelector("[data-lengthSlider]");
const lengthNum = document.querySelector("[data-lengthNum]");

const passDisplay = document.querySelector("[input-PasswordDisplay]");
const CopyMsg = document.querySelector("[data-CopyMsg]");
const CopyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#upperCase");
const lowercaseCheck = document.querySelector("#lowerCase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");
const generateBtn = document.querySelector(".generateButton");
const symbols = '/!@#$%^&*()~`_-+={}[]:";<>?,./|'

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength color to grey
setIndicator("#ccc");

function handleSlider() {
    slider.value = passwordLength;
    lengthNum.textContent = passwordLength;
    const min = slider.min;
    const max = slider.max;
    slider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "%"
}

function setIndicator(color) {
    indicator.style.background = color;
    //shadow 
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
};

function getRndmInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRndmNumber() {
    return getRndmInt(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndmInt(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndmInt(65, 91));
}

function generateSymbol() {
    const num = getRndmInt(0, symbols.length);
    return symbols.charAt(num);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked)
        hasUpper = true;
    if (lowercaseCheck.checked)
        hasLower = true;
    if (numberCheck.checked)
        hasNum = true;
    if (symbolsCheck.checked)
        hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passDisplay.value);
        CopyMsg.innerText = "Copied";
    } catch (e) {
        CopyMsg.innerText = "Failed";
    }
    CopyMsg.classList.add("active");
    setTimeout(() => { CopyMsg.classList.remove("active") }, 2000);

}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        //swapping the elements of array
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allcheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    //special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

}
allcheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})
slider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})
CopyBtn.addEventListener('click', () => {
    if (passDisplay.value) {
        copyContent();
    }
})
generateBtn.addEventListener('click', () => {
    if (checkCount == 0) {
        return;
    }
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    //to find the new password
    //remove the old password
    password = "";
    //lets put the stff mentioned by checkboxes
    // if (uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }
    // if (lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }
    // if (numberCheck.checked) {
    //     password += generateRndmNumber();
    // }
    // if (symbolsCheck.checked) {
    //     password += generateSymbol();
    // }
    let funcArr = [];
    if (uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if (numberCheck.checked)
        funcArr.push(generateRndmNumber);
    if (symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory Addition 
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    //remaining Addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randnum = getRndmInt(0, funcArr.length);
        password += funcArr[randnum]();
    }
    //shuffle the password
    password = shufflePassword(Array.from(password));
    passDisplay.value = password;
    calcStrength();
})
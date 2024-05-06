let apikey = "69e202b48ff675539efac428";
let baseUrl = `https://v6.exchangerate-api.com/v6/${apikey}/latest/`;
let massage = "";
let fromPart = "";
let toPart = "";
let lastInput = "";

const dropdowns = document.querySelectorAll(".dropdown select");

const amount = document.querySelector(".amount input");
let fromCountryCode = document.querySelector(".from select");
let toCountryCode = document.querySelector(".to select");
let conversionMassage = document.querySelector(".conversion");

// -------------Adding Dropdown options-------------------------

for(let select of dropdowns){
    for(currCode in countryList){
        let option = document.createElement("option");
        option.innerText = currCode;
        option.value = currCode;
        if(select.name === "from" && currCode === "USD"){
            option.selected = "selected";
        }
        else if(select.name === "to" && currCode === "INR"){
            option.selected = "selected";
        }
        select.append(option);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}

function defaultConversion (){
    const defaultFrom = "USD";
    const defaultTo = "INR";
    let amountValue = amount.value;
    let apiUrl = `${baseUrl}${defaultFrom}`;
    fetch(apiUrl).then(response => response.json()).then((value) => {
        let fromCountry = countryList[defaultFrom];
        let toCountry = countryList[defaultTo];

        let formattedFromNumber = parseFloat(amountValue);
        formattedFromNumber = formattedFromNumber.toLocaleString(`en-${fromCountry}`, {maximumFractionDigits: 2 });

        let exchangeRate = value.conversion_rates[defaultTo];
        let totalExchangeValue = parseFloat(amountValue * exchangeRate);
        let formattedToNumber = totalExchangeValue.toLocaleString(`en-${toCountry}`, {maximumFractionDigits: 2 });
        conversionMassage.innerText = `${formattedFromNumber} ${fromCountryCode.value} = ${formattedToNumber} ${toCountryCode.value}`;
        massage = conversionMassage.innerText;
        getPreviousMassageCurrencytype();
        
    }).catch(() => {
        conversionMassage.innerText = "Something went wrong :(";
    });
}
defaultConversion();

function getPreviousMassageCurrencytype(){
    let parts = massage.split("=");
    fromPart = parts[0].slice(-5).trim();
    toPart = parts[1].slice(-3).trim();
    lastInput = amount.value;
}


// -----------Swap the curreny conversion------------------------


let change = document.querySelector("form button");
change.addEventListener("click", (event) => {
    event.preventDefault();
    let fromImg = document.querySelector(".from-child img");
    let toImg = document.querySelector(".to-child img");
    let fromCountryCode = document.querySelector(".from select");
    let toCountryCode = document.querySelector(".to select");
    
    let tempImg = fromImg.src;
    fromImg.src = toImg.src;
    toImg.src = tempImg; 
    
    let fromValue = fromCountryCode.value
    let toValue = toCountryCode.value
    
    for(let i = 0; i < fromCountryCode.options.length; i++){
        if (fromCountryCode.options[i].value === toValue) {
            fromCountryCode.options[i].selected = true;
            break;
        }
    }

    for(let i = 0; i < toCountryCode.options.length; i++){
        if (toCountryCode.options[i].value === fromValue) {
            toCountryCode.options[i].selected = true;
            break;
        }
    }
});

let submitBtn = document.querySelector(".show button");
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    getExchangeRate();
});

function getExchangeRate(){
    
    let amountValue = amount.value;
    if(amountValue == "" || amountValue == "0"){
        amount.value = "1";
        amountValue = 1;
    }
    
    let newFromCountryCodeValue = fromCountryCode.value;
    let newToCountryCodeValue = toCountryCode.value;
    let latestAmount = amount.value;
    
    let apiUrl = `${baseUrl}${fromCountryCode.value}`;

    //if the selected value will give same value as the ouput massage then do not fetch api to reduce unwanted multiple api call

    if(fromPart != newFromCountryCodeValue || toPart != newToCountryCodeValue || lastInput != latestAmount){
        console.log("fetching data...");
        fetch(apiUrl).then(response => response.json()).then(result => {
            let fromCountry = countryList[fromCountryCode.value];
            let toCountry = countryList[toCountryCode.value];
            
            let formattedFromNumber = parseFloat(amountValue);
            formattedFromNumber = formattedFromNumber.toLocaleString(`en-${fromCountry}`, {maximumFractionDigits: 2 });
            
            let exchangeRate = result.conversion_rates[toCountryCode.value];
            let totalExchangeValue = parseFloat(amountValue * exchangeRate);
            let formattedToNumber = totalExchangeValue.toLocaleString(`en-${toCountry}`, {maximumFractionDigits: 2 });
            
            conversionMassage.innerText = `${formattedFromNumber} ${fromCountryCode.value} = ${formattedToNumber} ${toCountryCode.value}`;
            massage = conversionMassage.innerText;
            getPreviousMassageCurrencytype();
        }).catch(() => {
            conversionMassage.innerText = "Something went wrong :(";
        });
    }
}
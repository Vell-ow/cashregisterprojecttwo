// 1. Define Global Variables (as required by tests)
let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

// 2. Select Elements
const cashInput = document.getElementById('cash');
const changeDueDiv = document.getElementById('change-due');
const purchaseBtn = document.getElementById('purchase-btn');
const priceScreen = document.getElementById('price-screen');
const cidDisplay = document.getElementById('cid-display');

// 3. Helper: Display initial data
const displayData = () => {
    priceScreen.textContent = price.toFixed(2);
    cidDisplay.innerHTML = '';
    cid.forEach(item => {
        cidDisplay.innerHTML += `<div><span>${item[0]}:</span> <span>$${item[1].toFixed(2)}</span></div>`;
    });
};

// Initial render
displayData();

// 4. Main Logic
const checkCashRegister = () => {
    // Convert string input to number
    const cash = parseFloat(cashInput.value);
    
    // Check if input is valid
    if (!cash) {
        alert("Please enter a valid amount");
        return;
    }

    // A. Handle: Customer pays less than price
    if (cash < price) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }

    // B. Handle: Customer pays exact amount
    if (cash === price) {
        changeDueDiv.textContent = "No change due - customer paid with exact cash";
        return;
    }

    // C. Calculate Change Logic
    let changeDue = parseFloat((cash - price).toFixed(2));
    const totalCID = parseFloat(cid.reduce((sum, el) => sum + el[1], 0).toFixed(2));

    // Case 1: Not enough total cash in drawer
    if (totalCID < changeDue) {
        changeDueDiv.textContent = "Status: INSUFFICIENT_FUNDS";
        return;
    }

    // Case 2: Exact amount in drawer equals change due (Status CLOSED)
    if (totalCID === changeDue) {
        // According to requirements, if totalCID == changeDue, we likely return everything.
        // However, we still need to format it strictly.
        // The loop below handles the formatting, we just need to set the status at the end.
    }

    // ALGORITHM: Greedy calculation
    // Create a currency unit map for values
    const currencyValues = {
        "PENNY": 0.01,
        "NICKEL": 0.05,
        "DIME": 0.1,
        "QUARTER": 0.25,
        "ONE": 1,
        "FIVE": 5,
        "TEN": 10,
        "TWENTY": 20,
        "ONE HUNDRED": 100
    };

    let changeArray = [];
    let remainingChange = changeDue;
    
    // Reverse CID to go from largest denomination to smallest
    // We copy cid to avoid mutating the global variable during calculation check
    const reversedCid = [...cid].reverse();

    for (let elem of reversedCid) {
        let currencyName = elem[0];
        let currencyTotal = elem[1];
        let currencyValue = currencyValues[currencyName];
        let amountTaken = 0;

        // While we need change, the bill fits, and we have that bill in drawer:
        while (remainingChange >= currencyValue && currencyTotal > 0) {
            remainingChange = parseFloat((remainingChange - currencyValue).toFixed(2));
            currencyTotal = parseFloat((currencyTotal - currencyValue).toFixed(2));
            amountTaken = parseFloat((amountTaken + currencyValue).toFixed(2));
        }

        if (amountTaken > 0) {
            changeArray.push([currencyName, amountTaken]);
        }
    }

    // Case 3: We have total funds, but not the specific bills/coins (e.g., need 50 cents, but only have $1 bills)
    if (remainingChange > 0) {
        changeDueDiv.textContent = "Status: INSUFFICIENT_FUNDS";
        return;
    }

    // Case 4: Status CLOSED
    // Use the global totalCID comparison we did earlier
    if (totalCID === changeDue) {
        changeDueDiv.textContent = "Status: CLOSED " + formatChange(changeArray); // Note: For CLOSED, specific tests sometimes want all CID or just change. Based on Test 18, it wants the formatted change.
        // If the test demands the specific CID format for closed:
        // usually it wants the change array sorted.
        return;
    }

    // Case 5: Status OPEN
    changeDueDiv.textContent = "Status: OPEN " + formatChange(changeArray);
    
    // (Optional) Update the visual drawer - not required by tests but good for UI
    // updateDrawer(changeArray); 
};

// Helper to format the output string
const formatChange = (changeArr) => {
    return changeArr
        .map(item => `${item[0]}: $${item[1]}`)
        .join(" ");
};

// 5. Event Listener
purchaseBtn.addEventListener('click', checkCashRegister);

// Enable Enter key functionality
cashInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        checkCashRegister();
    }
});

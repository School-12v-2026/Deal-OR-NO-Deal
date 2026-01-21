document.addEventListener("DOMContentLoaded", (event) => {
    let startContainer = document.getElementsByClassName("start")[0];

    startContainer.children[0].addEventListener("click", () => {
        startContainer.style.display = 'none';
    })
    loadBoxes();

    loadPrices();
    boxesToNextOffer = getNextOfferInterval();
    updateChooseCase();
});


let boxes = [];
const numberBoxes = 26;
let userBox = null;
const dealOrNoDealPrizes = [
    0.01, 1, 5, 10, 25, 50, 75, 100, 200, 300, 400, 500,
    750, 1000, 5000, 10000, 25000, 50000, 75000, 100000,
    200000, 300000, 400000, 500000, 750000, 1000000
];
let boxesOpened = 0;
let boxesToNextOffer = 26;
let round = 1;

function loadBoxes() {
    let boxesCont1 = document.getElementsByClassName("briefcases")[0];
    let boxesCont2 = document.getElementsByClassName("briefcases2")[0];
    let boxesCont3 = document.getElementsByClassName("briefcases3")[0];

    boxes = [...dealOrNoDealPrizes];
    shuffleArray(boxes);
    for (let i = 0; i < numberBoxes; i++) {
        let box = document.createElement("div");
        let p = document.createElement("p");
        box.id = i;
        box.addEventListener("click", () => clickBox(i));
        box.appendChild(p);
        p.innerText = i + 1;

        if (i < 10) {
            box.classList.add('briefcase1');
            boxesCont1.appendChild(box);
        } else if (i >= 10 && i < 16) {
            box.classList.add('briefcase2');
            boxesCont2.appendChild(box);
        } else {
            box.classList.add('briefcase3');
            boxesCont3.appendChild(box);
        }
    }
}

function loadPrices() {
    let pricesCont1 = document.getElementById("prices1");
    let pricesCont2 = document.getElementById("prices2");
    for (let i = 0; i < numberBoxes; i++) {

        if (i < numberBoxes / 2) {
            let price = document.createElement("div");
            price.innerText = dealOrNoDealPrizes[i];
            price.classList.add("button1");
            pricesCont1.appendChild(price);
        } else {
            let price = document.createElement("div");
            price.innerText = dealOrNoDealPrizes[i];
            price.classList.add("button2");
            pricesCont2.appendChild(price);
        }
    }
}

function updateChooseCase() {
    let boxesToOpenDiv = document.getElementById("boxesToOpen");
    if (userBox === null) {
        boxesToOpenDiv.innerText = `Choose Your Case`;
    } else {
        boxesToOpenDiv.innerText = `Boxes to open this round: ${boxesToNextOffer}`;
    }
}

function updateBoxesToOpen() {
    let boxesToOpenDiv = document.getElementById("boxesToOpen");
    boxesToOpenDiv.innerText = `Boxes to open this round: ${boxesToNextOffer}`;
}

function clickBox(i) {
    let box = document.getElementById(i);
    if (box.className.includes("selected") || box.className.includes("opened")) {
        return;
    }
    if (userBox == null) {
        userBox = i;
        box.classList.add("selected");

        box.style.pointerEvents = "none";

        updateChooseCase();
    } else {
        box.children[0].innerText = boxes[i];
        box.children[0].style.color = "white";
        let priceCont = document.getElementById("prices1");
        let priceCont2 = document.getElementById("prices2");
        let prices = [...priceCont.children, ...priceCont2.children];
        box.classList.add("opened");
        prices.forEach(element => {
            if (element.innerText == boxes[i]) {
                element.style.filter = "grayscale(90%) brightness(75%)";
            }
        });
        boxesOpened++;
        boxesToNextOffer--;
        updateBoxesToOpen();
        if (boxesToNextOffer == 0 && boxesOpened < 24) {
            disableAllBoxes();
            let offerAmount = offer();
            setTimeout(() => showOffer(offerAmount), 1000);
        } else if (boxesOpened == 24) {
            disableAllBoxes();
            setTimeout(() => showLastOffer(), 1000);
        }
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function offer() {
    let priceCont = document.getElementById("prices1");
    let priceCont2 = document.getElementById("prices2");
    let prices = [...priceCont.children, ...priceCont2.children];
    let remainingValues = [];

    prices.forEach(element => {
        if (element.style.filter !== "grayscale(90%) brightness(75%)") {
            remainingValues.push(Number(element.innerText));
        }
    });

    if (remainingValues.length === 0) {
        return 0;
    }


    let sum = remainingValues.reduce((a, b) => a + b, 0);
    let average = sum / remainingValues.length;


    let randomFactor = Math.random() * (0.5 - 0.3) + 0.1;
    let dealOffer = average * randomFactor;


    return Math.floor(dealOffer);
}

function getNextOfferInterval() {
    if (boxesOpened < 6) return 6;
    if (boxesOpened < 11) return 5;
    if (boxesOpened < 15) return 4;
    if (boxesOpened < 18) return 3;
    if (boxesOpened < 20) return 2;
    return 1;
}

function resetGame() {
    boxes = [];
    boxesOpened = 0;
    boxesToNextOffer = 6;
    userBox = null;
    const briefcases = document.querySelectorAll('.briefcase1, .briefcase2, .briefcase3');
    briefcases.forEach(box => {
        box.remove();
    });
    const prices1 = document.getElementById("prices1");
    const prices2 = document.getElementById("prices2");
    prices1.innerHTML = '';
    prices2.innerHTML = '';
    yourCase();
    document.getElementById("resultMessage").innerText = '';

    loadBoxes();
    loadPrices();
    document.getElementById("id03").style.display = 'none';
    document.getElementById("id04").style.display = 'none';
    boxesToNextOffer = getNextOfferInterval();
    updateChooseCase();
}
function showOffer(amount) {
    let offerMessage = document.getElementById("offerMessage");
    offerMessage.innerText = "$" + amount;
    document.getElementById('id01').style.display = 'grid';
    window.currentOffer = amount;

}


function showLastOffer() {
    document.getElementById('id02').style.display = 'grid';
}

let playerCaseValue = 0;
let finalCaseValue = 0;

function swapCaseFinal() {
    let newUserBox = null;
    for (let i = 0; i < numberBoxes; i++) {
        if (i !== userBox && !document.getElementById(i).className.includes("opened")) {
            newUserBox = i;
            break;
        }
    }
    if (newUserBox != null) {
        let oldBox = document.getElementById(userBox);
        oldBox.classList.remove("selected");
        oldBox.style.pointerEvents = "auto";
        userBox = newUserBox;
        let newBox = document.getElementById(userBox);
        newBox.classList.add("selected");
        newBox.style.pointerEvents = "none";
    }
    document.getElementById('id02').style.display = 'none';
    revealFinalCases(true);
}

function keepCase() {
    document.getElementById('id02').style.display = 'none'; // Close the modal
    revealFinalCases();
}

function showResultModal(finalAmount, otherBoxAmount) {
    let resultMessage = document.getElementById("dealAmount");
    resultMessage.innerHTML = `$${finalAmount}`;
    let mycase = document.getElementById("case1").children[0];
    mycase.innerText = `$${finalAmount}`;

    let othercase = document.getElementById("case2").children[0];
    othercase.innerText = `$${otherBoxAmount}`;
    document.getElementById('id04').style.display = 'grid';
}

function closeResultModal() {
    document.getElementById('id04').style.display = 'none';
}

function revealFinalCases() {
    let finalAmount = boxes[userBox];
    let otherBox;
    for (let i = 0; i < numberBoxes; i++) {
        if (i !== userBox && !document.getElementById(i).className.includes("opened")) {
            otherBox = i;
            break;
        }
    }
    let otherBoxAmount = boxes[otherBox];

    let userBoxElement = document.getElementById(userBox);
    userBoxElement.children[0].innerHTML = finalAmount;
    userBoxElement.children[0].style.color = "white";

    let otherBoxElement = document.getElementById(otherBox);
    otherBoxElement.children[0].innerHTML = otherBoxAmount;
    otherBoxElement.children[0].style.color = "white";
    otherBoxElement.classList.add("opened");

    disableAllBoxes();
    showResultModal(finalAmount, otherBoxAmount); // Show the result modal
}

function continueGame() {
    let offerDiv = document.getElementById("offer");
    boxesToNextOffer = getNextOfferInterval();
    updateBoxesToOpen();
    enableAllBoxes();
}

function disableAllBoxes() {
    let boxesCont1 = document.getElementsByClassName("briefcases")[0];
    let boxesCont2 = document.getElementsByClassName("briefcases2")[0];
    let boxesCont3 = document.getElementsByClassName("briefcases3")[0];
    let boxes = [...boxesCont1.children, ...boxesCont2.children, ...boxesCont3.children];
    for (let box of boxes) {
        box.style.pointerEvents = "none";
    }
}

function enableAllBoxes() {
    let boxesCont1 = document.getElementsByClassName("briefcases")[0];
    let boxesCont2 = document.getElementsByClassName("briefcases2")[0];
    let boxesCont3 = document.getElementsByClassName("briefcases3")[0];
    let boxes = [...boxesCont1.children, ...boxesCont2.children, ...boxesCont3.children];
    for (let box of boxes) {
        if (!box.className.includes("selected") && !box.className.includes("opened")) {
            box.style.pointerEvents = "auto";
        }
    }
}

function updateBoxesToOpen() {
    let boxesToOpenDiv = document.getElementById("boxesToOpen");
    boxesToOpenDiv.innerText = `Boxes to open this round: ${boxesToNextOffer}`;
}

function acceptOffer() {
    document.getElementById('id01').style.display = 'none'; // Hide offer modal
    disableAllBoxes(window.currentOffer); // End game with accepted offer
    showDealModal(window.currentOffer);
}

function rejectOffer() {
    document.getElementById('id01').style.display = 'none';
    continueGame();
}

function closeResultModal() {
    document.getElementById('id04').style.display = 'none';
}
function showDealModal(amount) {
    let modal = document.getElementById("id03");
    let modalContent = document.getElementById("resultMessage");

    modalContent.innerText = `$${amount}`;
    let yourCase = document.getElementById("inyourcase");

    setTimeout(() => yourCase.innerText = ` in your case: ${boxes[userBox]} $`, 2000);
    modal.style.display = "grid";
}

function closeDealModal() {
    let modal = document.getElementById("id03");
    modal.style.display = "none";
}
function yourCase() {
    document.getElementById("inyourcase").innerHTML = ""
}

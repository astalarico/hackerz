import "../sass/app.scss";
import { faker } from "@faker-js/faker";
import jquery from "jquery";
const $ = jquery;
const rows = 16;
const charactersPerRow = 12;
const memoryAddresses = [];
let attempts = 3;

$("#attempts").text(attempts);
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// generate an array of fake words
const words = [];
for (let i = 0; i < rows / 2; i++) {
    words.push(generatePassword(3, 8));
}

const password = words[random(0, words.length - 1)];
console.log(password);

const getValuesBetweenTag = (string, tag) => {
    const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, "g");
    const regReplace = new RegExp(`<\/?${tag}>`, "g");
    return string.match(regex).map(function (val) {
        return val.replace(regReplace, "");
    })[0];
};

function generatePassword(min, max) {
    const password = faker.random.word();
    if (password.length < min || password.length > max) {
        generatePassword(min, max);
    }
    return password;
}

const generateRandonHexValue = () => {
    const hexValues = "0123456789ABCDEF";
    let hexValue = "0x2A";
    for (let i = 0; i < 3; i++) {
        hexValue += hexValues[random(0, 15)];
    }
    return hexValue;
};

const generateSequence = (count, singleCharacters = false) => {
    const sequence = [];
    const characters = "!@#$%^&*()_+{}|:<>?`-=[]\\;',./";

    for (let i = 0; i < count; i++) {
        if (singleCharacters) {
            sequence.push(
                `<span class="system-object">${
                    characters[random(0, characters.length - 1)]
                }</span>`
            );
        } else {
            sequence.push(characters[random(0, characters.length - 1)]);
        }
    }

    return sequence.join("");
};

const generateMemoryAddress = () => {
    let oddCount = 0;
    for (let i = 0; i < rows; i++) {
        const memoryEntry = {};
        const memoryAddress = generateRandonHexValue();
        memoryEntry.address = memoryAddress;
        memoryEntry.value = null;

        let password = null;
        let sequence = null;
        let row = null;
        let link = null;
        let characters = null;
        // check if even line of the side of the terminal, if so generate a password
        if (i % 2 === 0) {
            password = words[i / 2];
            sequence = generateSequence(
                charactersPerRow - password.length,
                true
            );
            row =
                `<span class="system-object" data-system="password">${password}</span>` +
                sequence;
        } else {
            const sequence = generateSequence(random(1, 5));
            link =
                oddCount % 2 === 0
                    ? `<span class="system-object" data-system="dud"><${sequence}></span>`
                    : `<span class="system-object" data-system="hint"><${sequence}></span>`;
            characters = generateSequence(
                charactersPerRow - sequence.length,
                true
            );
            row = link + characters;
            oddCount++;
        }
        memoryEntry.value = row;
        memoryAddresses.push(memoryEntry);
    }
    return memoryAddresses;
};

generateMemoryAddress().map((memoryAddress) => {
    console.log(memoryAddress);
    const address = document.createElement("div");
    address.classList.add("address", "mr-3");
    address.innerHTML = memoryAddress.address;

    const value = document.createElement("div");
    value.classList.add("value");
    value.innerHTML = memoryAddress.value;

    const row = document.createElement("div");
    row.classList.add("flex", "system-set");
    row.appendChild(address);
    row.appendChild(value);

    document.querySelector("#terminal #left-side").appendChild(row);
});

$(document).on("click", ".system-object", function () {
    const system = $(this).data("system");
    const systemObject = $(this);
    if (system === "password") {
        const selectedPassword = $(this).text();
        if (selectedPassword === password) {
            $("#feedback").append(
                "<div class='feedback-message flex'> <div class='mr-2'> > </div> <div> Success!</div></div>"
            );
        } else {
            attempts--;
            $("#attempts").text(attempts);

            $("#feedback").append(
                "<div class='feedback-message flex'> <div class='mr-2'> > </div> <div>Incorrect</div></div>"
            );

            if (attempts === 0) {
                $("#terminal").addClass("cursor-not-allowed");
                $("#left-side").addClass("pointer-events-none");
                $("#feedback").append(
                    "<div class='feedback-message flex'> <div class='mr-2'> > </div> <div>You have been locked out of the system</div></div>"
                );
            }
        }
    } else if (system === "hint") {
        console.log("hint");
        attempts++;
        $("#attempts").text(attempts);
        $("#feedback").append(
            "<div class='feedback-message flex'> <div class='mr-2'> > </div> <div>Attempts Increased</div></div>"
        );
    } else if (system === "dud") {
        console.log("dud");
        $("#feedback").append(
            "<div class='feedback-message flex'> <div class='mr-2'> > </div> <div>Dud Removed</div></div>"
        );
        $(".system-object").each(function () {
            const system = $(this).data("system");
            if (system === "password") {
                const selectedPassword = $(this).text();
                console.log( selectedPassword, password)
                if (selectedPassword !== password) {
                    $(this).text("........").removeClass("system-object");
                    systemObject.removeClass("system-object");
                    var index = words.indexOf( password );
                    if (index !== -1) {
                        words.splice(index, 1);
                    }
                    console.log( words )
                    return false;
                }
            }
        });
    }
    if (!system) {
        console.log("no system");
        attempts--;
        $("#attempts").text(attempts);

        $("#feedback").append(
            "<div> > You have " + attempts + " attempts left </div>"
        );

        if (attempts === 0) {
            $("#terminal").addClass("cursor-not-allowed");
            $("#left-side").addClass("pointer-events-none");
            $("#feedback").append(
                "<div class='feedback-message flex'> <div class='mr-2'> > </div> <div>You have been locked out of the system</div></div>"
            );
        }
    }
});

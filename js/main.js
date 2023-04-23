import "../sass/app.scss";
import { faker } from "@faker-js/faker";

const rows = 16;
const charactersPerRow = 12;
const memoryAddresses = [];

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const getValuesBetweenTag = (string, tag) => {
    const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`, "g");
    const regReplace = new RegExp(`<\/?${tag}>`, "g");
    return string.match( regex )
    .map(function (val) {
        return val.replace(regReplace, "");
    })[0];
}


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

const generateSequence = (count) => {
    const sequence = [];
    const characters = "!@#$%^&*()_+{}|:<>?`-=[]\\;',./";

    for (let i = 0; i < count; i++) {
        sequence.push(characters[random(0, characters.length - 1)]);
    }

    return sequence.join("");
};

const generateMemoryAddress = () => {
    let oddCount = 0;
    for (let i = 0; i < rows; i++) {
        const memoryEntry = {};
        const memoryAddress = generateRandonHexValue();
        memoryEntry.address = memoryAddress
        memoryEntry.value = null;

        let password = null;
        let sequence = null;
        let row = null;
        let link = null;
        let characters = null;
        // check if even line of the side of the terminal, if so generate a password
        if (i % 2 === 0) {
            // word must be between 4 and 8 characters long, if not generate a new word
            password = generatePassword(3, 8);
            sequence = generateSequence(charactersPerRow - password.length);
            row = `<password>${password}</password>` + sequence;
        } else {
            const sequence = generateSequence(random(1, 5))
            link = oddCount % 2 === 0 ? `<dud>${sequence}</dud>` : `<hint><${sequence}></hint>`
            characters = generateSequence(charactersPerRow - sequence.length);
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
});

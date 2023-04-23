import { useEffect, useState } from "react";
import { faker }  from '@faker-js/faker';

const rows = 16;

// create function that generates a random number between two values
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const generateRandonHexValue = () => {
    const hexValues = "0123456789ABCDEF";
    let hexValue = "0x2A";
    for (let i = 0; i < 3; i++) {
        hexValue += hexValues[random(0, 15)];
    }
    return hexValue;
}
const generateSequence = () => {
    const sequence = [];
    const characters = "!@#$%^&*()_+{}|:<>?`-=[]\\;',./";

    for (let i = 0; i < 12; i++) {
        sequence.push(characters[ random(0, characters.length - 1)]);
    }

    return sequence.join("");

}
console.log(generateRandonHexValue(), generateSequence());

function Game() {
    const [attempts, setAttempts] = useState(3);
    const [leftRows, setLeftRows] = useState(16);
    const [rightRows, setRightRows] = useState(16);

    useEffect(() => {
        for( let i = 0; i < rows; i++) {
            const row = document.createElement("div");
            row.classList.add("flex");
            row.id = `row-${i}`;
            row.innerHTML = `
                <div class="row-left mr-2">
                    <p class='tracking-wide'>${generateRandonHexValue()}</p>
                </div>
                <div class="row-right ">
                    <p class="code hover:cursor-pointer">${generateSequence()}</p>
                </div>
            `;
            document.getElementById("left-side").appendChild(row);
        }
    }, []);
    return (
        <div className="game">
            <div id="header">
                <p>Welcome to ROBCO Industries (TM) Termlink</p>
                <p>Password Required</p>
                <p>Attempts Remaining {attempts}</p>
            </div>
            <div id="left-side"></div>
            <div id="right-side"></div>
        </div>
    );
}

export default Game;

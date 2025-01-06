'use client'

import React, {useEffect} from "react";
import {BingoSquare} from "@/componenets/BingoSquare";
import data from '../resources/squares.json'
import dictionary from '../resources/dictionary_keys.json'

function fakeRandom(seed: number) {
    //used so that we can have a seeded rng
    const x = Math.sin(Math.floor(seed)) * 10000;
    return x - Math.floor(x);
}

function winCheck(state: boolean[]): boolean {
    let passedLeftDiag = true;
    let passedRightDiag = true;
    for (let i = 0; i < 5; i++) {
        let passedHorizontal = true;
        let passedVertical = true;
        for (let j = 0; j < 5; j++) {
            //vertical check
            passedHorizontal &&= state[i * 5 + j]
            passedVertical &&= state[i + j * 5]
        }
        if (passedHorizontal || passedVertical) {
            return true;
        }
        passedLeftDiag &&= state[i * 6]
        passedRightDiag &&= state[4 + 4 * i]
    }
    return passedLeftDiag || passedRightDiag;
}

export function BingoBox() {
    const init = Array(25).fill(false)
    const [seed, setSeed] = React.useState<number>(0);
    const [state, setState] = React.useState<boolean[]>(init);
    useEffect(() => {
        setSeed(Math.random() * 123456789)
    }, []);

    useEffect(() => {
        if (winCheck(state)) {
            alert("YIPE!!")
            setState(init);
            setSeed(Math.random() * 123456789)
        }
    }, [state]);
    init[12] = true
    const squares = []
    const options = data.basic.slice().concat(data.tasks.slice());
    let taskStart = data.basic.length;
    for (let i = 0; i < 5; i++) {
        const next = []
        for (let j = 0; j < 5; j++) {
            const idx = Math.floor(fakeRandom(seed + i * 5 + j) * options.length);
            let text = options[idx]
            if (text.includes("$random")) {
                const idx2 = Math.floor(fakeRandom(seed + i * 5 + j + 123456) * dictionary.length);
                text = text.replace("$random", dictionary[idx2])
            }
            const isTask = idx >= taskStart;
            if (!isTask) {
                taskStart--;
            }
            options.splice(idx, 1)
            next.push(<BingoSquare key={j} index={i * 5 + j} state={state} setState={setState} text={text}
                                   isTask={isTask}/>);
        }
        squares.push(next);
    }
    return <div>
        {squares.map((v, i) => (
            <div style={{display: 'flex', flexDirection: 'row'}} key={i}>{v}</div>
        ))}
    </div>;
}
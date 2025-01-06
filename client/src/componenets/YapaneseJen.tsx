'use client'

import React, {useEffect} from "react";

const defaultValue = 'Write something here!';

import classes from "./button.module.css";
import {getYapaneseJenForName} from "@/componenets/ServerActions";

export function YapaneseJen() {
    const name = localStorage.getItem("name");
    const ref = React.useRef<HTMLInputElement | null>(null);
    const [yappaneseJen, setYappaneseJen] = React.useState<number>(0);
    if (name === null) {
        return <div style={{
            alignItems: "center",
            width: '100%',
            textAlign: "center"
        }}>
            <br></br>
            <br></br>
            <label htmlFor='namePicker'>Name: </label>
            <input id='namePicker' ref={ref} defaultValue={defaultValue} style={{color: 'black',}}></input>
            <br></br>
            <br></br>
            <button className={classes.button} role="button" onClick={
                () => {
                    const name = ref.current?.value ?? null;
                    if (!name || name === defaultValue) return;
                    localStorage.setItem('name', name);
                    location.reload();
                }
            }>Submit!
            </button>
        </div>;
    }
    useEffect(() => {
        getYapaneseJenForName(name).then(setYappaneseJen)
    })
    return <div style={{
        alignItems: "center",
        width: '100%',
        textAlign: "center"
    }}>
        <br></br>
        <br></br>
        <p>My name is {name}. I have {yappaneseJen} Yappanese Jen!</p>
        <br></br>
        <br></br>
        <button
            className={classes.button}
            onClick={
                () => {
                    localStorage.removeItem('name');
                    location.reload();
                }
            }
        >clear
        </button>
    </div>;
}
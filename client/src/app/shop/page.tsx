'use client'
import React, {useEffect} from "react";
import {addYapaneseJenForName, getYapaneseJenForName} from "@/components/ServerActions";


export default function Shop() {
    const [yappaneseJen, setYappaneseJen] = React.useState<number>(0);
    const name: string | null = localStorage.getItem('name')
    useEffect(() => {
        if (name) {
            getYapaneseJenForName(name).then(setYappaneseJen)
        }
    })

    function purchase(cost: number) {
        if (!name) alert('Login first!!');
        getYapaneseJenForName(name!).then((trueBalance) => {
            setYappaneseJen(trueBalance)
            if (cost <= trueBalance) {
                addYapaneseJenForName(name!, cost * -1).then((newAmount) => setYappaneseJen(newAmount));
            } else {
                alert('broke fuck')
            }
        })

    }

    return (
        <div style={{height: "100vh"}}>
            <img src='/cooler-logo.gif'></img>
            <h1 style={{position: 'absolute', top: '0', right: '0', fontSize: '40px'}}>
                you got {yappaneseJen} <img style={{display: 'inline'}} src='/jenny.jpeg' width='50' height='50'/>
            </h1>
            <button onClick={() => purchase(3)}>Buy Le Thing - 3 moneys</button>
            <p/>
            <button onClick={() => addYapaneseJenForName(name!, 5).then((newAmount) => setYappaneseJen(newAmount))}>Get
                Mulah
            </button>
        </div>
    );
}

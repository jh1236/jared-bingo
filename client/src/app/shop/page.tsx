'use client'
import React, {useEffect} from "react";
import {addYapaneseJenForName, getYapaneseJenForName} from "@/components/ServerActions";
import Link from "next/link";
import classes from "./shop.module.css";


export default function Shop() {
    const [yappaneseJen, setYappaneseJen] = React.useState<number>(0);
    const name: string | null = localStorage.getItem('name')
    useEffect(() => {
        if (name) {
            getYapaneseJenForName(name).then(setYappaneseJen)
        }
    })

    function purchase(cost: number) {
        if (cost <= yappaneseJen) {
            addYapaneseJenForName(name!, cost * -1).then((newAmount) => setYappaneseJen(newAmount));
        } else {
            alert('broke fuck')
        }
    }

    return (
        <div>
            <div style={{height: "200px"}}>
                <img src='/cooler-logo.gif'></img>
                <h1 style={{position: 'absolute', top: '96', right: '0', fontSize: '40px'}}>
                    you got {yappaneseJen} <img style={{display: 'inline'}} src='/jenny.jpeg' width='50' height='50'/>
                </h1>
                <Link href='/'>
                    <button style={{position: 'absolute', top: '96', left: '0', fontSize: '40px'}}>
                        To BINGO
                    </button>
                </Link>
            </div>
            <div style={{
                position: 'absolute', top: '200', left: '0',
                fontSize: '20px',
                alignItems: "center",
                width: '100%',
                textAlign: "center"
            }}>
                <button
                    className={classes.shopButton}
                    onClick={() => addYapaneseJenForName(name!, 5).then((newAmount) => setYappaneseJen(newAmount))}>Get
                    Mulah
                </button>
                <br/>
                <button onClick={() => purchase(3)} className={classes.shopButton}>Buy Le Thing - 3 moneys</button>

            </div>
        </div>
    )
        ;
}

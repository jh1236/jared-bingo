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
    }, [])

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
        <div>
            <img src='/cooler-logo.gif' alt={"cooler logo"}></img>
            <div style={{height: "100px"}}>

                <p style={{position: 'absolute', right: '0', fontSize: '35px', margin: '10px'}}>
                    you got {yappaneseJen} <img style={{display: 'inline'}} src='/small_jenny.jpg' width='50'
                                                height='50'/>
                </p>
                <Link href='/'>
                    <button className={classes.rainbow}>
                        to bingo
                    </button>
                </Link>
            </div>
            <div className={classes.background}>
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

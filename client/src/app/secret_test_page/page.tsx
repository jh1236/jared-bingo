'use client'
import React, {useEffect} from "react";
import {addYapaneseJenForName, getYapaneseJenForName, purchaseItemForName} from "@/components/ServerActions";
import Link from "next/link";
import classes from "./shop.module.css";


export default function TestPage() {
    const [yappaneseJen, setYappaneseJen] = React.useState<number>(0);
    const [inventory, setInventory] = React.useState<string[]>([]);
    const name: string | null = localStorage.getItem('name')
    useEffect(() => {
        if (name) {
            getYapaneseJenForName(name).then(setYappaneseJen)
        }
    })
    if (!name) {
        location.href = "/"
        return <></>
    }
    return (
        <div>
            Inventory: [{inventory.map((v) => `${v}, `)}]
            <div style={{height: "200px"}}>
                <img src='/cooler-logo.gif'></img>
                <p style={{position: 'absolute', top: '96', right: '0', fontSize: '35px'}}>
                    you got {yappaneseJen} <img style={{display: 'inline'}} src='/jenny.jpeg' width='50' height='50'/>
                </p>
                <Link href='/'>
                    <button style={{
                        position: 'absolute',
                        top: '96',
                        left: '0',
                        fontSize: '35px',
                        height: '100',
                        margin: "auto",
                        background: "white"
                    }}>
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
                    +5 cash
                </button>
                <br/>
                <button onClick={() => purchaseItemForName(name, "pony")} className={classes.shopButton}>Buy A Pony (costs 4)
                </button>

            </div>
        </div>
    )

}

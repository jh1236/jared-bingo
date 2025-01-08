'use client'
import React, {Fragment, useEffect} from "react";
import {
    addYapaneseJenForName, consumeItemForName,
    getInventoryForName, getPurchasableItems,
    getYapaneseJenForName,
    purchaseItemForName
} from "@/components/ServerActions";
import Link from "next/link";
import classes from "./shop.module.css";
import {ReactFitty} from "react-fitty";


export default function TestPage() {
    const [yappaneseJen, setYappaneseJen] = React.useState<number>(0);
    const [shopItems, setShopItems] = React.useState<{
        formattedName: string;
        name: string,
        cost: number,
        image: string
    }[]>([]);
    const [inventory, setInventory] = React.useState<string[]>([]);
    const name: string | null = localStorage.getItem('name')
    useEffect(() => {
        if (name) {
            getYapaneseJenForName(name).then(setYappaneseJen)
            getInventoryForName(name).then(setInventory)
            getPurchasableItems().then(setShopItems)
        }
    }, [])
    if (!name) {
        location.href = "/"
        return <></>
    }

    function purchase(type: string) {
        purchaseItemForName(name!, type).then(([data, success]) => {
            if (!success) {
                alert("Broke Fuck")
            }
            setInventory(data.inventory)
            setYappaneseJen(data.score)
        })
    }

    function useItem(item: string) {
        consumeItemForName(name!, item).then(([data, success]) => {
            if (!success) {
                alert("????")
            }
            setInventory(data)
        })
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
                    onClick={() => addYapaneseJenForName(name!, 5).then((newAmount) => setYappaneseJen(newAmount))}>
                    Get +5 cash
                </button>
                {shopItems.map((item, index) =>
                    <Fragment key={index}>
                        <br></br>
                        <button onClick={() =>
                            purchase(item.name)
                        } className={classes.shopButton}>
                            <ReactFitty wrapText>
                                <img
                                    style={{display: 'inline'}}
                                    src={item.image} width='15'
                                    height='15'/>
                                {item.formattedName} ({item.cost}
                                <img
                                    style={{display: 'inline'}}
                                    src='/jenny.jpeg' width='15'
                                    height='15'/>)</ReactFitty>
                        </button>
                    </Fragment>
                )}
            </div>
        </div>
    )

}

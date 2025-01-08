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
    const [inventory, setInventory] = React.useState<{
        formattedName: string;
        name: string,
        cost: number,
        image: string
    }[]>([]);
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
                alert("Broke Fuck")
            }
            setInventory(data)
        })
    }


    return (
        <div>
            <img src='/cooler-logo.gif' alt={"cooler logo"}></img>
            <div style={{height: "100px"}}>
                <div style={{
                    borderRadius: '10px',
                    backgroundColor: '#1c1c1c',
                    textAlign: "center",
                    margin: '10px',
                    fontSize: '32px',
                    position: "absolute",
                    width: 'calc(50% - 15px)',
                    height: '60px',
                    border: '2px black solid',
                    right: '0',
                    padding: '0px'
                }}>
                    <p style={{position: "relative", top: "2px"}}>
                        {yappaneseJen} <img style={{display: 'inline'}} src='/small_jenny.jpg' width='50'/>
                    </p>
                </div>

                <Link href='/'>
                    <button className={classes.rainbow}>
                        to bingo
                    </button>
                </Link>
            </div>

            {/*opens the shop section*/}
            <div className={classes.shopSection}>
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
                                <img style={{display: 'inline', width: '25px', height: '50px'}}
                                     src={item.image}/>
                                {item.formattedName}
                                ({item.cost}
                                <img style={{display: 'inline'}}
                                     src='/jenny.jpeg' width='15'
                                     height='15'/>)
                            </ReactFitty>
                        </button>
                    </Fragment>
                )}
            </div>

            {/*inventory*/}
            <div className={classes.shopSection}>
                Inventory: [{inventory.map((v) => `${v.name}, `)}]
            </div>
        </div>
    )
}

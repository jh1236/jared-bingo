'use client'
import React, {Fragment, JSX, useEffect} from "react";
import {
    consumeItemForName,
    getInventoryForName,
    getPurchasableItems,
    getYapaneseJenForName,
    purchaseItemForName,
    inventory,
    purchasableItem
} from "@/components/ServerActions";
import Link from "next/link";
import classes from "./shop.module.css";
import {ReactFitty} from "react-fitty";
import Image from "next/image";
import {PopUp} from "@/components/PopUp";
import {Button} from "@headlessui/react";


type popupDetails = {
    title: string;
    description: string;
    cancel: string;
    buttons: ((arg: (isOpen: boolean) => void) => JSX.Element)[];
}

export default function TestPage() {
    const [yappaneseJen, setYappaneseJen] = React.useState<number>(0);
    const [shopItems, setShopItems] = React.useState<purchasableItem[]>([]);
    const [inventory, setInventory] = React.useState<inventory>({});
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [popupDetails, setPopupDetails] = React.useState<popupDetails>({
        buttons: [],
        cancel: "",
        description: "",
        title: ""
    });
    const name: string | null = localStorage.getItem('name')
    useEffect(() => {
        if (name) {
            getYapaneseJenForName(name).then(setYappaneseJen)
            getInventoryForName(name).then(setInventory)
            getPurchasableItems().then(setShopItems)
        }
    }, [name])
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

    function consumeItem(item: string) {
        consumeItemForName(name!, item).then(([data, success]) => {
            if (!success) {
                alert("Broke Fuck")
            }
            console.log(data)
            setInventory(data)
        })
    }


    function attemptToUse(name: string) {
        const itemDetails = shopItems.find((v) => v.name === name)!;
        // if (!inventory[name] || inventory[name] === 0) {
        //     alert('You dont have any ' + itemDetails.formattedName + "!!")
        //     return
        // }
        setPopupDetails({
            buttons: [(isOpen) => <Button key={1} style={{border: 'solid 1px'}} onClick={
                () => {
                    consumeItem(name)
                    isOpen(false)
                }
            }>Fuck yea baby! Let&#39;s do it!</Button>],
            cancel: "No, I'm just a dummy",
            description: `Are you sure you want to use your ${itemDetails.formattedName}? This cannot be undone!`,
            title: "Use Item"
        })
        setIsOpen(true);

    }

    return (
        <div>
            <Image src='/cooler-logo.gif' alt={"cooler logo"} width={500} height={500}></Image>
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

                {shopItems.map((item, index) =>
                    <Fragment key={index}>
                        <br></br>
                        <button onClick={() =>
                            purchase(item.name)
                        } className={classes.shopButton}
                                style={{backgroundColor: item.cost <= yappaneseJen ? '#c85000' : 'gray'}}>
                            <ReactFitty wrapText>
                                <img style={{
                                    display: 'inline',
                                    width: '25px',
                                    height: '50px',
                                }}
                                     src={item.image}/>
                                {item.cost <= yappaneseJen ?
                                    <>{item.formattedName} ({item.cost}<img style={{display: 'inline'}}
                                                                            src='/jenny.jpeg' width='15'
                                                                            height='15'/>)</> :
                                    <s>{item.formattedName} ({item.cost}<img style={{display: 'inline'}}
                                                                             src='/jenny.jpeg' width='15'
                                                                             height='15'/>)</s>
                                }

                            </ReactFitty>
                        </button>
                    </Fragment>
                )}
            </div>

            {/*inventory*/}
            <div className={classes.invSection}>
                Inventory:
                {
                    shopItems.map((v, i) =>
                        <Fragment key={i}>
                            <br></br>
                            <Image src={v.image} alt={v.formattedName} width={50}
                                   height={50} style={{
                                display: "inline-block",
                                width: '50px',
                                height: '50px'
                            }}
                                   onClick={() => attemptToUse(v.name)}
                            ></Image> : <b>{inventory[v.name]}</b>
                        </Fragment>)
                }
            </div>
            <PopUp isOpen={isOpen} setIsOpen={setIsOpen} title={popupDetails.title}
                   description={popupDetails.description}
                   exitText={popupDetails.cancel}
                   buttons={popupDetails.buttons}
            ></PopUp>
        </div>
    )
}

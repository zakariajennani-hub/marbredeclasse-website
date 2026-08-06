import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./VasqueConfiguratorPage.css";

import VasqueImage from "../assets/vasques/quartz-blanc-vasque.jpeg";
export default function VasqueConfiguratorPage() {

    const navigate = useNavigate();

    /*************************************************
     * DEFAULT VALUES
     *************************************************/

    const [length, setLength] = useState(60);
    const [width, setWidth] = useState(50);

    const [includeShelf, setIncludeShelf] = useState(false);

    const [deliveryType, setDeliveryType] = useState("showroom");

    const [city, setCity] = useState("Rabat");



    /*************************************************
     * DELIVERY
     *************************************************/

    const deliveryPrices = {

        showroom:0,

        Rabat:350,

        Casablanca:650,

        Nord:850,

        Marrakech:1200,

        Autres:null

    };



    /*************************************************
     * PRICE ENGINE
     *************************************************/

    function calculateLengthPrice(value){

        let total = 2400;

        if(value<=60)
            return total;

        let current=60;

        while(current<value){

            current+=10;

            if(current<=100){

                total+=250;

            }

            else if(current<=180){

                total+=500;

            }

            else{

                total+=1000;

            }

        }

        return total;

    }



    function calculateWidthExtra(value){

        if(value<=50)
            return 0;

        let extra=0;

        let current=50;

        while(current<value){

            current+=10;

            extra+=250;

        }

        return extra;

    }



    const vasquePrice = useMemo(()=>{

        return calculateLengthPrice(length)+calculateWidthExtra(width);

    },[length,width]);



    const shelfPrice = useMemo(()=>{

        if(!includeShelf)
            return 0;

        return Math.round(vasquePrice*0.4);

    },[includeShelf,vasquePrice]);



    const deliveryPrice = useMemo(()=>{

        if(deliveryType==="showroom")
            return 0;

        return deliveryPrices[city];

    },[deliveryType,city]);



    const totalPrice = useMemo(()=>{

        if(deliveryPrice===null){

            return vasquePrice+shelfPrice;

        }

        return vasquePrice+shelfPrice+deliveryPrice;

    },[
        vasquePrice,
        shelfPrice,
        deliveryPrice
    ]);



    /*************************************************
     * SUBMIT
     *************************************************/

    function handleDevis(){

        const order={

            product:"Vasque",

            length,

            width,

            shelf:includeShelf,

            delivery:deliveryType,

            city,

            vasquePrice,

            shelfPrice,

            deliveryPrice,

            totalPrice

        };

        localStorage.setItem(
            "vasqueOrder",
            JSON.stringify(order)
        );

        navigate("/devis");

    }
        return (
        <div className="vasque-page">

            <div className="vasque-container">

                {/* IMAGE */}

                <div className="vasque-left">

                    <img
                        src={VasqueImage}
                        alt="Vasque Quartz Blanc"
                        className="vasque-image"
                    />

                </div>

                {/* CONTENT */}

                <div className="vasque-right">

                    <h1>Vasque sur mesure</h1>

                    <div className="rating">

                        ⭐⭐⭐⭐⭐

                    </div>

                    <div className="price">

                        À partir de <strong>2 400 DH</strong>

                    </div>

                    <ul className="features">

                        <li>✔ Matière : Quartz blanc</li>

                        <li>✔ Fabrication sur mesure</li>

                        <li>✔ Livraison partout au Maroc</li>

                    </ul>

                    <hr />

                    <h3>Dimensions</h3>

                    <div className="dimension-row">

                        <label>Longueur</label>

                        <input
                            type="number"
                            min={60}
                            max={250}
                            value={length}
                            onChange={(e)=>setLength(Number(e.target.value))}
                        />

                        <span>cm</span>

                    </div>

                    <div className="dimension-row">

                        <label>Largeur</label>

                        <input
                            type="number"
                            min={40}
                            max={80}
                            value={width}
                            onChange={(e)=>setWidth(Number(e.target.value))}
                        />

                        <span>cm</span>

                    </div>

                    <hr />

                    <div className="checkbox">

                        <input
                            id="etagere"
                            type="checkbox"
                            checked={includeShelf}
                            onChange={(e)=>setIncludeShelf(e.target.checked)}
                        />

                        <label htmlFor="etagere">

                            Ajouter une étagère assortie

                        </label>

                    </div>

                    <hr />

                    <h3>Livraison</h3>

                    <div className="radio">

                        <label>

                            <input
                                type="radio"
                                checked={deliveryType==="showroom"}
                                onChange={()=>setDeliveryType("showroom")}
                            />

                            Retrait au showroom

                        </label>

                    </div>

                    <div className="radio">

                        <label>

                            <input
                                type="radio"
                                checked={deliveryType==="delivery"}
                                onChange={()=>setDeliveryType("delivery")}
                            />

                            Livraison à domicile

                        </label>

                    </div>

                    {

                        deliveryType==="delivery" && (

                            <select
                                value={city}
                                onChange={(e)=>setCity(e.target.value)}
                                className="city-select"
                            >

                                <option value="Rabat">

                                    Rabat / Salé / Témara

                                </option>

                                <option value="Casablanca">

                                    Casablanca

                                </option>

                                <option value="Nord">

                                    Nord

                                </option>

                                <option value="Marrakech">

                                    Marrakech / Agadir

                                </option>

                                <option value="Autres">

                                    Autres villes

                                </option>

                            </select>

                        )

                    }

                    <hr />

                    <div className="summary">

                        <h3>Résumé</h3>

                        <div className="summary-line">

                            <span>Vasque</span>

                            <strong>

                                {vasquePrice.toLocaleString()} DH

                            </strong>

                        </div>

                        {

                            includeShelf && (

                                <div className="summary-line">

                                    <span>Étagère</span>

                                    <strong>

                                        {shelfPrice.toLocaleString()} DH

                                    </strong>

                                </div>

                            )

                        }

                        {

                            deliveryType==="delivery" && (

                                <div className="summary-line">

                                    <span>Livraison</span>

                                    <strong>

                                        {

                                            deliveryPrice===null

                                            ?

                                            "À confirmer"

                                            :

                                            `${deliveryPrice.toLocaleString()} DH`

                                        }

                                    </strong>

                                </div>

                            )

                        }

                        <div className="summary-total">

                            <span>Total</span>

                            <strong>

                                {

                                    deliveryPrice===null

                                    ?

                                    `${totalPrice.toLocaleString()} DH + livraison`

                                    :

                                    `${totalPrice.toLocaleString()} DH`

                                }

                            </strong>

                        </div>

                    </div>

                    <button
                        className="devis-button"
                        onClick={handleDevis}
                    >

                        Demander mon devis

                    </button>

                </div>

            </div>

        </div>

    );

}
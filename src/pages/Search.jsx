import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const province = searchParams.get('province');
    const provinceCode  = searchParams.get('code');
    const typeOfDelivery = searchParams.get('type');  

    return (
        <div>
            <h1>Search</h1>
            <p>Province: {provinceCode}{province}</p>
            <p>Type of Delivery: {typeOfDelivery}</p>
        </div>
    );
}
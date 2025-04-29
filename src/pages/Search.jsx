import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";

export default function Search() {
    const [searchParams] = useSearchParams();
    const province      = searchParams.get('province');
    const provinceCode  = searchParams.get('code');

    return (
        <div>
            <h1>Search</h1>
            <p>Province: {provinceCode}{province}</p>
        </div>
    );
}
import { useSearchParams } from "react-router";
import { useEffect, useState, useMemo } from "react";
import MySelectionBox from "../components/SelectionBox";
import provinces_th from "../assets/geography_th/provinces.json";
import SearchFilter from "./SearchFilter";
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import SwapVertIcon from '@mui/icons-material/SwapVert';

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const provinceCodes = useMemo(() => {
        const rawCode = searchParams.getAll('code').join(',');
        return rawCode ? rawCode.split(',') : [];
      }, [searchParams]);
      
    const typeOfDelivery = searchParams.get('type');  
    const [selectedProvinces, setSelectedProvinces] = useState(null);
    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);
    const provinces = useMemo(() => provinces_th.map(p => ({
        label: p.provinceNameTh,
        value: String(p.provinceCode),
      })), []);
      

      useEffect(() => {
        if (provinceCodes.length === 0) return;
      
        const selectedOptions = provinceCodes
          .map((code) => provinces.find((province) => String(province.value) === code))
          .filter(Boolean);
      
        setSelectedProvinces(selectedOptions);
      }, [provinceCodes, provinces]);

      const handleProvinceChange = (selectedOptions) => {
        setSelectedProvinces(selectedOptions);
        const selectedCodes = selectedOptions.map((option) => option.value);
      
        // Merge existing searchParams with the new 'code' parameter
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('code'); // Remove existing 'code' parameters
        selectedCodes.forEach((code) => newParams.append('code', code)); // Add new 'code' parameters
      
        setSearchParams(newParams); // Update the URL with merged parameters
      };
      
      
    

    return (
        <div className="">
            <SearchFilter open={openFilter} handleClose={handleCloseFilter}/>
            <div className="mb-2">
                <MySelectionBox 
                    options={provinces} 
                    isMulti={true}
                    placeholder={'จังหวัดที่สอน'}
                    className={'z-10'}
                    value={selectedProvinces}
                    onChange={handleProvinceChange}
                />
            </div>
            <div className="flex flex-row gap-2">
                <Button variant="contained" color="primary" onClick={handleOpenFilter} className='w-1/2'>
                    <FilterListIcon className="mr-2" />Filter
                </Button>
                <Button variant="contained" color="primary" onClick={handleOpenFilter} className='w-1/2'>
                    <SwapVertIcon className="mr-2" />Sort
                </Button>
            </div>
            <h1>Search</h1>
            <p>Province: {provinceCodes.join(',')}</p>
            <p>Type of Delivery: {typeOfDelivery}</p>
        </div>
    );
}
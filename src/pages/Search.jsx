import { useSearchParams } from "react-router";
import { useEffect, useState, useMemo } from "react";
import MySelectionBox from "../components/SelectionBox";
import provinces_th from "../assets/geography_th/provinces.json";
import SearchFilter from "./SearchFilter";
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import {getAllProfiles} from "../services/search";
import MyCard from "../components/Card";

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [profiles, setProfiles] = useState([]);
    const [filtered , setFiltered] = useState(false);
    const [loading, setLoading] = useState(true);
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
        const fetchAndFilter = async () => {
          setLoading(true);
          const data = await getAllProfiles();
          console.log(data);
          if (!data) {
            console.error("Error fetching profiles");
            setProfiles([]);
            setLoading(false);
            return;
          }
      
          let results = [...data];
      
          // --- Filter by province
          const rawCode = searchParams.getAll('code').join(',');
          const provinceCodes = rawCode ? rawCode.split(',') : [];
      
          if (provinceCodes.length > 0) {
            results = results.filter((profile) => {
              const profileCodes = profile.swim_teacher_locations.map(loc => String(loc.province_code));
              return provinceCodes.some(code => profileCodes.includes(code));
            });
          }
      
          // --- Filter by price
          const minPrice = Number(searchParams.get('minPrice')) || 0;
          const maxPrice = Number(searchParams.get('maxPrice')) || 1500;
          results = results.filter((profile) => {
            const price = Number(profile.hourly_rate);
            return price >= minPrice && price <= maxPrice;
          });
      
          // --- Filter by travel
          if (searchParams.get('travel') === 'true') {
            results = results.filter((profile) => profile.can_travel);
          }
      
          // --- Filter by online
          if (searchParams.get('online') === 'true') {
            results = results.filter((profile) => profile.can_online);
          }

          if (searchParams.get('levels')) {
            const levels = searchParams.get('levels').split(',');
          
            results = results.filter((profile) => {
              const profileLevels = Array.isArray(profile.levels)
                ? profile.levels.map(String)
                : [];
          
              return levels.some(level => profileLevels.includes(level));
            });
          }
          
          
      
          setProfiles(results);
          setLoading(false);
        };
      
        fetchAndFilter();
      }, [searchParams]);
      
      

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
        <div className="relative">
            <div className="pb-4">
                <SearchFilter open={openFilter} handleClose={handleCloseFilter} setFiltered={setFiltered}/>
                <div className="mb-2">
                    <MySelectionBox 
                        options={provinces} 
                        isMulti={true}
                        placeholder={'จังหวัดที่ต้องการค้นหา'}
                        className={'w-full'}
                        class_select={'z-50'}
                        value={selectedProvinces}
                        onChange={handleProvinceChange}
                    />
                </div>
                <div className="flex flex-row gap-2">
                    <Button 
                        variant="contained" 
                        sx={{
                            backgroundColor: filtered ? 'gray' : 'primary',
                            '&:hover': {
                            backgroundColor: filtered ? 'darkgray' : 'primary.dark',
                            }
                        }}
                        onClick={handleOpenFilter} className="w-1/2"
                    >
                        <FilterListIcon className="mr-2" />{filtered ? 'แก้ไขตัวกรอง' : 'ตัวกรอง'}
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleOpenFilter} className='w-1/2'>
                        <SwapVertIcon className="mr-2" />เรียงลำดับ
                    </Button>
                </div>
            </div>
            { loading ? (
                <div></div>
            ) : (
                <div>
                    <div className="flex flex-start mb-2">
                        <h1 className="text-xs font-normal">ผลการค้นหา - {profiles.length === 0 ?  'ไม่พบผู้สอน' : profiles.length}</h1>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                        {profiles.map((profile) => (
                            <MyCard 
                                display_name={profile.display_name} 
                                bio={profile.bio} 
                                key={profile.id} 
                                image={profile.profile_picture}
                                can_travel={profile.can_travel}
                                can_online={profile.can_online}
                                hourly_rate={profile.hourly_rate}
                                province_code={profile.swim_teacher_locations}
                                handleClick={() => console.log(profile.id)}
                                levels={profile.levels}
                                handleStarClick={() => console.log('Star clicked!', profile.id)}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
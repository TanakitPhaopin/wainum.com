import { useSearchParams, useNavigate, useLocation } from "react-router";
import { useEffect, useState, useMemo } from "react";
import MySelectionBox from "../components/SelectionBox";
import provinces_th from "../assets/geography_th/provinces.json";
import SearchFilter from "./SearchFilter";
import Button from '@mui/material/Button';
import FilterListIcon from '@mui/icons-material/FilterList';
import {getAllProfiles} from "../services/search";
import MyCard from "../components/Card";
import MySelect from "../components/Select";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import SearchIcon from '@mui/icons-material/Search';
import { toggleFavorite } from "../services/search";
import { useAuth } from "../contexts/AuthContext";
import { getStudentFavorites } from "../services/search";
import { toast } from "react-toastify";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Divider } from "@mui/material";

export default function Search() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [profiles, setProfiles] = useState([]);
    const [surroundingTeachers, setSurroundingTeachers] = useState([]);
    const [premiumProfiles, setPremiumProfiles] = useState([]);
    const [filtered , setFiltered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 16; // Adjust this value as needed
    const provinceCodes = useMemo(() => {
        const rawCode = searchParams.getAll('code').join(',');
        return rawCode ? rawCode.split(',') : [];
      }, [searchParams]);
    const [selectedProvinces, setSelectedProvinces] = useState(null);
    const [openFilter, setOpenFilter] = useState(false);
    const handleOpenFilter = () => setOpenFilter(true);
    const handleCloseFilter = () => setOpenFilter(false);
    const provinces = useMemo(() => provinces_th.map(p => ({
        label: p.provinceNameTh,
        value: String(p.provinceCode),
      })), []);

    const itemsToShow_large = premiumProfiles.length < 4 ? premiumProfiles.length : 4;
    const itemsToShow_desktop = premiumProfiles.length < 3 ? premiumProfiles.length : 3;
    const itemsToShow_tablet = premiumProfiles.length < 2 ? premiumProfiles.length : 2;
    const itemsToShow_mobile = premiumProfiles.length < 1 ? premiumProfiles.length : 1;
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 1536 },
            items: itemsToShow_large,
            slidesToSlide: 1,
        },
        largeDesktop: {
            breakpoint: { max: 1536, min: 1280 },
            items: itemsToShow_large,
            slidesToSlide: 1,
        },
        desktop: {
            breakpoint: { max: 1280, min: 1024 },
            items: itemsToShow_desktop,
            slidesToSlide: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 640 },
            items: itemsToShow_tablet,
            slidesToSlide: 1,
        },
        mobile: {
            breakpoint: { max: 640, min: 0 },
            items: itemsToShow_mobile,
            slidesToSlide: 1,
        },
    };

    const [deviceType, setDeviceType] = useState("desktop");
    const updateDeviceType = () => {
        const width = window.innerWidth;
        if (width < 464) {
          setDeviceType("mobile");
        } else if (width < 1024) {
          setDeviceType("tablet");
        } else {
          setDeviceType("desktop");
        }
      };
    
      useEffect(() => {
        updateDeviceType(); // Set initial device type
        window.addEventListener("resize", updateDeviceType);
    
        return () => {
          window.removeEventListener("resize", updateDeviceType);
        };
      }, []);

    const handlePageChange = (event, value) => {
      setCurrentPage(value);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
    };
      

    useEffect(() => {
      const fetchAndFilter = async () => {
        setLoading(true);
        const data = await getAllProfiles();
        if (!data) {
          console.error("Error fetching profiles");
          setProfiles([]);
          setLoading(false);
          return;
        }
        const premiumData = data.filter(profile => profile.is_subscribed);
        setPremiumProfiles(premiumData);
        let results = [...data];      
        results.sort((a, b) => {
        return (b.is_subscribed ? 1 : 0) - (a.is_subscribed ? 1 : 0);
      });
        // --- Filter by province
        const rawCode = searchParams.getAll('code').join(',');
        const provinceCodes = rawCode ? rawCode.split(',') : [];
    
        if (provinceCodes.length > 0) {
          const expandedProvinceCodes = provinceCodes.flatMap(code => {
            const num = parseInt(code, 10);
            return [num - 2, num - 1, num + 1, num + 2];
          }).map(String);

          const uniqueCodes = Array.from(new Set(expandedProvinceCodes));

          // Separate out matching teachers
          const matched = results.filter(profile => {
            const profileCodes = profile.swim_teacher_locations.map(loc => String(loc.province_code));
            return uniqueCodes.some(code => profileCodes.includes(code));
          });
          // Store surrounding teachers
          setSurroundingTeachers(matched);

          results = results.filter((profile) => {
            const profileCodes = profile.swim_teacher_locations.map(loc => String(loc.province_code));
            return provinceCodes.some(code => profileCodes.includes(code));
          });
        }
        // --- Filter by price
        const minPriceParam = searchParams.get('minPrice');
        const maxPriceParam = searchParams.get('maxPrice');

        if (minPriceParam !== null || maxPriceParam !== null) {
          const minPrice = minPriceParam !== null ? Number(minPriceParam) : -Infinity;
          const maxPrice = maxPriceParam !== null ? Number(maxPriceParam) : Infinity;

          results = results.filter((profile) => {
            const price = Number(profile.hourly_rate);
            return price >= minPrice && price <= maxPrice;
          });
        }
    
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
        const newParams = new URLSearchParams(searchParams);
        if (searchParams.get('sort')) {
          const sortBy = searchParams.get('sort');
          if (sortBy === 'popularity') {
            results.sort((a, b) => b.created_at - a.created_at);
          } else if (sortBy === 'newest') {
            results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          } else if (sortBy === 'price_asc') {
            results.sort((a, b) => a.hourly_rate - b.hourly_rate);
          } else if (sortBy === 'price_desc') {
            results.sort((a, b) => b.hourly_rate - a.hourly_rate);
          } else {
            newParams.set('sort', 'popularity');
            setSearchParams(newParams);
            results.sort((a, b) => b.popularity - a.popularity);
          }
        } else {
          newParams.set('sort', 'popularity');
          setSearchParams(newParams);
        }
        setProfiles(results);
        setLoading(false);
      };
      fetchAndFilter();
    }, [searchParams]);

    // Calculate the index range for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProfiles = profiles.slice(startIndex, endIndex);  

    useEffect(() => {
      if (provinceCodes.length === 0) {
        setSurroundingTeachers([]);
        return;
      }
    
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

    // Handle star click
    const handleStarClick = async (teacher_id, student_id) => {
        if (!user) {
          toast.error("กรุณาเข้าสู่ระบบก่อน");
          return;
        }
        if (user.user_metadata.role !== "นักเรียน") {
          toast.error("คุณไม่มีสิทธิ์ในการบันทึกผู้สอน");
          return;
        }
        try {
          const result = await toggleFavorite(teacher_id, student_id);
          if (result) {
            if (result.status === 'added') {
              toast.success("บันทึกผู้สอนเรียบร้อย");
              setMyFavorites(prev => [...prev, teacher_id]);
            } else if (result.status === 'removed') {
              toast.success("ลบผู้สอนออกจากรายการโปรดเรียบร้อย");
              setMyFavorites(prev => prev.filter(id => id !== teacher_id));
            }
          }
        } catch (error) {
          console.error("Error toggling favorite:", error);
        }
    }

    // Get my favorites
    const [myFavorites, setMyFavorites] = useState([]);
    useEffect(() => {
        if (user && user.user_metadata.role === "นักเรียน") {
          getMyFavorites();
        }
    }, [user]);

    const getMyFavorites = async () => {
        if (user && user.user_metadata.role === "นักเรียน") {
          const favorites = await getStudentFavorites(user.id);
          const favoriteIds = favorites.map(fav => fav.teacher_id);
          setMyFavorites(favoriteIds);
        }
    }

    return (
        <div className="relative">
            <div className="pb-4">
                <SearchFilter open={openFilter} handleClose={handleCloseFilter} setFiltered={setFiltered}/>
                {/* Search */}
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
                    {/* Filter */}
                    <Button 
                        variant="contained" 
                        sx={{
                            backgroundColor: filtered ? 'gray' : 'primary',
                            '&:hover': {
                            backgroundColor: filtered ? 'darkgray' : 'primary.dark',
                            }
                        }}
                        onClick={handleOpenFilter} className="w-1/2"
                        size="large"
                        startIcon={<FilterListIcon />}
                    >
                        <span className="break-words line-clamp-1">{filtered ? 'แก้ไขตัวกรอง' : 'ตัวกรอง'}</span>
                    </Button>
                    {/* Sort */}
                    <div className="w-1/2">
                      <MySelect 
                          label={'เรียงลำดับ'}
                          menuItems={[
                              { label: 'ยอดนิยม', value: 'popularity' },
                              { label: 'ใหม่ล่าสุด', value: 'newest' },
                              { label: 'ราคา (น้อยไปมาก)', value: 'price_asc' },
                              { label: 'ราคา (มากไปน้อย)', value: 'price_desc' },
                          ]}
                          onChange={(e) => {
                              const selectedValue = e.target.value;
                              const newParams = new URLSearchParams(searchParams);
                              newParams.set('sort', selectedValue);
                              setSearchParams(newParams);
                          }}
                          value={searchParams.get('sort') || ''}
                      />
                    </div>
                </div>
            </div>
            { loading ? (
                <div></div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                       {profiles.length > 0 ? (
                          <div className="flex flex-start mb-2">
                            <h1 className="text-xs font-normal">ผลการค้นหา - {profiles.length}</h1>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 items-center justify-center my-12">
                              <SearchIcon 
                                className="mx-auto" 
                                fontSize="large" 
                                sx={{width: 100, height: 100}}/>
                              <h1 className="text-md font-normal">ไม่พบผู้สอน</h1>
                              <h1 className="text-md font-normal">กรุณาลองใหม่อีกครั้ง</h1>
                          </div>
                       )}                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                        {currentProfiles.map((profile) => (
                            <MyCard 
                                display_name={profile.display_name} 
                                bio={profile.bio} 
                                key={profile.id} 
                                image={profile.profile_picture}
                                can_travel={profile.can_travel}
                                can_online={profile.can_online}
                                hourly_rate={profile.hourly_rate}
                                province_code={profile.swim_teacher_locations}
                                handleClick={() => {navigate(`/teacher/${profile.id}`, { state: { from: location.pathname + location.search }});}}
                                levels={profile.levels}
                                is_subscribed={profile.is_subscribed}
                                handleStarClick={() => handleStarClick(profile.id, user?.id)}
                                isFavorite={myFavorites.includes(profile.id)}
                            />
                        ))}
                    </div>
                    {currentProfiles.length > 0 && (
                    <Stack spacing={2} className="mt-8" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Pagination
                            count={Math.ceil(profiles.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            size="large"
                            showFirstButton
                            showLastButton
                        />
                    </Stack>
                    )}
                </div>
                <Divider sx={{marginY: 4}}/>
                <div className="p-4">
                  {surroundingTeachers.length > 0 ? (
                  <div className="mb-4">
                    <h1 className="text-lg font-semibold mb-4">บริเวณใกล้เคียง</h1>
                    <Carousel
                      swipeable={true}
                      draggable={true}
                      showDots={true}
                      responsive={responsive}
                      ssr={true} 
                      infinite={true}
                      autoPlay={true}
                      autoPlaySpeed={3000}
                      keyBoardControl={false}
                      customTransition="transform 300ms ease-in-out"
                      transitionDuration={500}
                      containerClass="carousel-container"
                      deviceType={deviceType}
                      dotListClass="custom-dot-list-style"
                      itemClass="px-0 sm:px-2"
                    >
                    {surroundingTeachers.map((profile) => (
                        <MyCard 
                            display_name={profile.display_name} 
                            bio={profile.bio} 
                            key={profile.id} 
                            image={profile.profile_picture}
                            can_travel={profile.can_travel}
                            can_online={profile.can_online}
                            hourly_rate={profile.hourly_rate}
                            province_code={profile.swim_teacher_locations}
                            handleClick={() => {navigate(`/teacher/${profile.id}`, { state: { from: location.pathname + location.search }});}}
                            levels={profile.levels}
                            is_subscribed={profile.is_subscribed}
                            handleStarClick={() => handleStarClick(profile.id, user?.id)}
                            isFavorite={myFavorites.includes(profile.id)}
                        />                  
                      ))}
                    </Carousel>
                    <Divider sx={{marginTop: 4}}/>
                  </div>
                  ) : (
                    <div></div>
                  )}
                  {premiumProfiles.length > 0 ? (
                  <div className="mb-2">
                    <h1 className="text-lg font-semibold mb-4">สปอนเซอร์</h1>
                    <Carousel
                      swipeable={true}
                      draggable={true}
                      showDots={true}
                      responsive={responsive}
                      ssr={true} 
                      infinite={true}
                      autoPlay={true}
                      autoPlaySpeed={5000}
                      keyBoardControl={false}
                      customTransition="transform 300ms ease-in-out"
                      transitionDuration={500}
                      containerClass="carousel-container"
                      deviceType={deviceType}
                      dotListClass="custom-dot-list-style"
                      itemClass="px-0 sm:px-2"
                    >
                    {premiumProfiles.map((profile) => (
                        <MyCard 
                            display_name={profile.display_name} 
                            bio={profile.bio} 
                            key={profile.id} 
                            image={profile.profile_picture}
                            can_travel={profile.can_travel}
                            can_online={profile.can_online}
                            hourly_rate={profile.hourly_rate}
                            province_code={profile.swim_teacher_locations}
                            handleClick={() => {navigate(`/teacher/${profile.id}`, { state: { from: location.pathname + location.search }});}}
                            levels={profile.levels}
                            is_subscribed={profile.is_subscribed}
                            handleStarClick={() => handleStarClick(profile.id, user?.id)}
                            isFavorite={myFavorites.includes(profile.id)}
                        />                  
                      ))}
                    </Carousel>
                  </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            )}
        </div>
    );
}
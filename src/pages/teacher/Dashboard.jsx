import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';
import { Button, Switch, FormControlLabel} from '@mui/material';
import MyTextField from '../../components/TextField';
import MySelectionBox from '../../components/SelectionBox';
import provinces_th from '../../assets/geography_th/provinces.json';
import placeholder_image from '../../assets/placeholder_image.jpg';

export default function TeacherProfileForm() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // Form
  const [is_public, setIs_public] = useState(false);
  const [profile_picture, setProfile_picture] = useState('');
  const [display_name, setDisplay_name] = useState('');
  const [bio, setBio] = useState('');
  const [contacts, setContacts] = useState([
    { type: 'phone', value: '' },
    { type: 'email', value: '' },
    { type: 'line', value: '' },
    { type: 'facebook', value: '' },
    { type: 'instagram', value: '' },
  ]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [about_location, setAbout_location] = useState('');
  const [can_travel, setCan_travel] = useState(false);
  const [travel_note, setTravel_note] = useState('');
  const [can_online, setCan_online] = useState(false);
  const [about_lesson, setAbout_lesson] = useState('');
  const [hourly_rate, setHourly_rate] = useState('');
  const [lesson_package, setLesson_package] = useState('');
  const [experience, setExperience] = useState('');
  const [qualification, setQualification] = useState('');

  const provinces = provinces_th.map((province) => ({
    label: province.provinceNameTh,
    value: province.provinceCode,
  }));

  useEffect(() => {
    if (!user) return;
    try {
      const fetchData = async () => {
        const { data, error } = await supabase
          .from('swim_teacher_profiles')
          .select(`*,
            swim_teacher_locations (
              province_code
            )
          `)
          .eq('id', user.id)
          .single();
        if (error) {
          console.log(error);
        }
        if (data) {
          // Set initial form values
          setIs_public(data.is_public || false);
          setProfile_picture(data.profile_picture || '');
          setDisplay_name(data.display_name || '');
          setBio(data.bio || '');
          setContacts(data.contacts || [
            { type: 'phone', value: '' },
            { type: 'email', value: '' },
            { type: 'line', value: '' },
            { type: 'facebook', value: '' },
            { type: 'instagram', value: '' },
          ]);
          const matched = data.swim_teacher_locations
            ?.map(loc => provinces.find(p => String(p.value) === String(loc.province_code)))
            .filter(Boolean); // remove undefined
          setSelectedProvinces(matched || []);
          setAbout_location(data.about_location || '');
          setCan_travel(data.can_travel || false);
          setTravel_note(data.travel_note || '');
          setCan_online(data.can_online || false);
          setAbout_lesson(data.about_lesson || '');
          setHourly_rate(data.hourly_rate || '');
          setLesson_package(data.lesson_package || '');
          setExperience(data.experience || '');
          setQualification(data.qualification || '');
        }
        setLoading(false);
      };
      fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, [user]);

  const handleChange = (field) => (e) => {
    const value = 
      field === 'can_travel' || field === 'can_online' || field === 'is_public'
        ? e.target.checked // For switches
        : e.target.value;  // For text fields and other inputs
  
    if (field === 'is_public') {
      toast.info('ระบบจะไม่อัปเดตหากคุณลืมบันทึกข้อมูล');
    }

    // Dynamically update the state based on the field name
    switch (field) {
      case 'is_public':
        setIs_public(value);
        break;
      case 'profile_picture':
        setProfile_picture(value);
        break;
      case 'display_name':
        setDisplay_name(value);
        break;
      case 'bio':
        setBio(value);
        break;
      case 'selectedProvinces':
        setSelectedProvinces(e); // Directly set the value from the selection box
        break;
      case 'about_location':
        setAbout_location(value);
        break;
      case 'can_travel':
        setCan_travel(value);
        break;
      case 'travel_note':
        setTravel_note(value);
        break;
      case 'can_online':
        setCan_online(value);
        break;
      case 'about_lesson':
        setAbout_lesson(value);
        break;
      case 'hourly_rate':
        setHourly_rate(value);
        break;
      case 'lesson_package':
        setLesson_package(value);
        break;
      case 'experience':
        setExperience(value);
        break;
      case 'qualification':
        setQualification(value);
        break;
      default:
        console.warn(`Unhandled field: ${field}`);
    }
  };

  const handleContactChange = (index, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index].value = value;
    setContacts(updatedContacts);
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const fileName = `${user.id}-${file.name}`;
    try {
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('profile-images') // Replace with your Supabase storage bucket name
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });
  
      if (error) {
        toast.error('เกิดข้อผิดพลาดในการอัปโหลดรูปโปรไฟล์');
        console.error(error);
        return;
      }
  
      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);
  
      if (publicUrlData) {
        setProfile_picture(publicUrlData.publicUrl); // Update the profile picture state
        console.log('Profile picture uploaded:', publicUrlData.publicUrl);
        toast.success('อัปโหลดรูปโปรไฟล์สำเร็จ');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิด');
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
  
    try {
      // Prepare the profile data
      const profileData = {
        id: user.id,
        is_public,
        profile_picture,
        display_name,
        bio,
        contacts,
        about_location,
        can_travel,
        travel_note,
        can_online,
        about_lesson,
        hourly_rate: Number(hourly_rate),
        lesson_package,
        experience,
        qualification,
      };
  
      // Upsert the profile data
      const { error: profileError } = await supabase
        .from('swim_teacher_profiles')
        .upsert(profileData, { onConflict: 'id' });
  
      if (profileError) {
        toast.error('เกิดข้อผิดพลาดในการบันทึกโปรไฟล์');
        console.error(profileError);
        return;
      }

      // Delete existing provinces for the user
      const { error: deleteError } = await supabase
      .from('swim_teacher_locations')
      .delete()
      .eq('id', user.id);

      if (deleteError) {
        toast.error('เกิดข้อผิดพลาดในการลบจังหวัดเก่า');
        console.error(deleteError);
        return;
      }

      // Prepare the province data
      const provinceRows = selectedProvinces.map((p) => ({
        id: user.id,
        province_code: String(p.value),
      }));
  
      // Upsert the province data
      const { error: insertError } = await supabase
        .from('swim_teacher_locations')
        .upsert(provinceRows, {
          onConflict: ['id', 'province_code'],
        });
  
      if (insertError) {
        toast.error('เกิดข้อผิดพลาดในการเพิ่มจังหวัด');
        console.error(insertError);
        return;
      }
  
      toast.success('บันทึกโปรไฟล์และจังหวัดเรียบร้อยแล้ว');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิด');
    } finally {
      setSubmitting(false);
    }
  };
  

  if (loading) return null;

  return (

    <form
    onSubmit={handleSubmit}
    className="relative max-w-3xl mx-auto bg-white shadow-xl rounded-xl px-3 md:px-8 py-10 flex flex-col gap-6"
    >
        <FormControlLabel control={<Switch checked={is_public} onChange={handleChange('is_public')} />} label="เผยแพร่"  className='flex justify-end'/>
        <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">ข้อมูลทั่วไป</h4>
        <div className="w-full bg-white p-4 rounded-xl shadow-sm">
          <div className="mt-6 flex justify-center">
            <img
              src={profile_picture || placeholder_image}
              alt="โปรไฟล์"
              className="w-32 h-32 rounded-full object-cover border border-gray-300 shadow"
            />
          </div>
          <div className="mt-6 flex justify-center">
            <div className="relative w-fit">
              <input
                type="file"
                id="profilePictureUpload"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="block w-full text-sm text-gray-700
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100
                          overflow-hidden"
              />
            </div>
          </div>
      </div>

        <MyTextField
          id={'ชื่อที่แสดง'}
          label="ชื่อที่แสดง"
          value={display_name}
          onChange={handleChange('display_name')}
          maxLength={32}
          showCounter={true}
        />        
        <MyTextField
          id={'แนะนำตัว'}
          label="แนะนำตัว"
          value={bio}
          onChange={handleChange('bio')}
          multiline
          rows={3}
          maxLength={150}
          showCounter={true}
        />
        <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">รายละเอียดการติดต่อ</h4>
        {contacts.map((contact, index) => (
          <div key={index} className=" w-full">
            <MyTextField
              id={contact.type} // Use the contact type as the ID
              label={contact.type.charAt(0).toUpperCase() + contact.type.slice(1)} // Capitalize the label
              value={contact.value} // Bind the value to the contact's value
              onChange={(e) => handleContactChange(index, e.target.value)} // Update the specific contact's value
              multiline={false} // No need for multiline unless required
              maxLength={100} // Adjust maxLength as needed
            />
          </div>
        ))}
        <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">สถานที่สอน</h4>
        <MySelectionBox 
          options={provinces} 
          isMulti={true}
          placeholder={'จังหวัดที่สอน'}
          className={'z-10'}
          value={selectedProvinces}
          onChange={setSelectedProvinces}
        />
        <MyTextField
          id={'ข้อมูลสถานที่สอน'}
          label="ข้อมูลสถานที่สอน"
          value={about_location}
          onChange={handleChange('about_location')}
          multiline
          rows={4}
          maxLength={1500}
          showCounter={true}
        />
        <FormControlLabel control={<Switch checked={can_travel} onChange={handleChange('can_travel')} />} label="สามารถเดินทางได้" />
        {can_travel && (
            <MyTextField
            id={"หมายเหตุเกี่ยวกับการเดินทาง"}
            label="หมายเหตุเกี่ยวกับการเดินทาง"
            value={travel_note}
            onChange={handleChange('travel_note')}
            multiline
            rows={2}
            maxLength={1000}
            showCounter={true}
          />
        )}
        <FormControlLabel control={<Switch checked={can_online} onChange={handleChange('can_online')} />} label="สอนออนไลน์" />
    
        <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">ข้อมูลการสอน</h4>
        <MyTextField
          id={'ข้อมูลเกี่ยวกับการสอน'}
          label="ข้อมูลเกี่ยวกับการสอน"
          value={about_lesson}
          onChange={handleChange('about_lesson')}
          multiline
          rows={4}
          maxLength={1500}
          showCounter={true}
        />
        <MyTextField
          id={"ราคาต่อชั่วโมง (บาท)"}
          label="ราคาต่อชั่วโมง (บาท)"
          value={hourly_rate}
          onChange={handleChange('hourly_rate')}
          type='number'
        />
        <MyTextField
          id={'แพ็คเกจการสอน'}
          label="แพ็คเกจการสอน"
          value={lesson_package}
          onChange={handleChange('lesson_package')}
          multiline
          rows={2}
          maxLength={500}
          showCounter={true}
        />

        <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">ประสบการณ์และคุณวุฒิ</h4>
        <MyTextField
          id={"ประสบการณ์"}
          label="ประสบการณ์"
          value={experience}
          onChange={handleChange('experience')}
          multiline
          rows={4}
          maxLength={1500}
          showCounter={true}
        />
        <MyTextField
          id={"ใบรับรองคุณวุฒิ"}
          label="ใบรับรองคุณวุฒิ"
          value={qualification}
          onChange={handleChange('qualification')}
          multiline
          rows={4}
          maxLength={1500}
          showCounter={true}
        />

        <div className="sticky bottom-4 left-0 right-0 flex justify-center mt-10 z-20">
            <Button
                type="submit"
                variant="contained"
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-full shadow-lg hover:opacity-90"
            >
                บันทึกข้อมูล
            </Button>
        </div>
    </form>


  );
}

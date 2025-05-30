import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';
import { Button, Switch, FormControlLabel} from '@mui/material';
import MyTextField from '../../components/TextField';
import MySelectionBox from '../../components/SelectionBox';
import provinces_th from '../../assets/geography_th/provinces.json';
import placeholder_image from '../../assets/placeholder_image.jpg';
import { useNavigate } from 'react-router';
import { upsertTeacherProfileField, upsertTeacherLocation } from '../../services/teacher';

export default function Profile() {
  const { user, isSubscribed } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Form
  const [formData, setFormData] = useState({
    is_public: false,
    profile_picture: '',
    display_name: '',
    bio: '',
    contacts: [
      { type: 'phone', value: '' },
      { type: 'email', value: '' },
      { type: 'line link', value: '' },
      { type: 'facebook link', value: '' },
      { type: 'instagram link', value: '' },
    ],
    selectedProvinces: [],
    about_location: '',
    can_travel: false,
    travel_note: '',
    can_online: false,
    selectedLevel: [],
    about_lesson: '',
    hourly_rate: '',
    lesson_package: '',
    experience: '',
    qualification: '',
    is_subscribed: false,
    updated_at: '',
  });

  const [originalData, setOriginalData] = useState(formData); // initially the same


  const provinces = provinces_th.map((province) => ({
    label: province.provinceNameTh,
    value: province.provinceCode,
  }));

  const levels = [
    { label: 'ทารก', value: 'ทารก' },
    { label: 'เด็ก', value: 'เด็ก' },
    { label: 'ผู้ใหญ่', value: 'ผู้ใหญ่' },
    { label: 'ผู้ที่มีความต้องการพิเศษ', value: 'ผู้ที่มีความต้องการพิเศษ' },
    { label: 'ระดับเริ่มต้น', value: 'ระดับเริ่มต้น' },
    { label: 'ระดับกลาง', value: 'ระดับกลาง' },
    { label: 'ระดับสูง', value: 'ระดับสูง' },
    { label: 'ระดับแข่งขัน', value: 'ระดับแข่งขัน' },

  ];

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
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
          setLoading(false);
          return;
        }

        if (data) {
          const matchedProvinces = data.swim_teacher_locations
            ?.map(loc => provinces.find(p => String(p.value) === String(loc.province_code)))
            .filter(Boolean);

          const matchedLevels = data.levels
            ?.map(level => levels.find(l => String(l.value) === String(level)))
            .filter(Boolean);

          const newFormData = {
            is_public: data.is_public || false,
            profile_picture: data.profile_picture || '',
            display_name: data.display_name || '',
            bio: data.bio || '',
            contacts: data.contacts || [
              { type: 'phone', value: '' },
              { type: 'email', value: '' },
              { type: 'line link', value: '' },
              { type: 'facebook link', value: '' },
              { type: 'instagram link', value: '' },
            ],
            selectedProvinces: matchedProvinces || [],
            about_location: data.about_location || '',
            can_travel: data.can_travel || false,
            travel_note: data.travel_note || '',
            can_online: data.can_online || false,
            selectedLevel: matchedLevels || [],
            about_lesson: data.about_lesson || '',
            hourly_rate: data.hourly_rate || '',
            lesson_package: data.lesson_package || '',
            experience: data.experience || '',
            qualification: data.qualification || '',
            is_subscribed: data.is_subscribed || false,
            updated_at: data.updated_at || '',
          };
          console.log('New form data:', newFormData);

          setFormData(newFormData);
          setOriginalData(newFormData); // store original for comparison
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleContactChange = (index, value) => {
    const updatedContacts = [...formData.contacts];
    const updatedContact = { ...updatedContacts[index], value };
    updatedContacts[index] = updatedContact;
    setFormData(prev => ({ ...prev, contacts: updatedContacts }));
    console.log('Updated contacts:', updatedContacts);
    console.log('Original contacts:', originalData.contacts);
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
        handleUpsert('profile_picture', publicUrlData.publicUrl);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิด');
    }
  };

  const handleUpsert = async (field, value) => {
    const fieldValue = value;
    const fieldName = field;
    const teacherId = user.id;
    
    try {
      setSaving(true);
      const data = await upsertTeacherProfileField(fieldName, fieldValue, teacherId);
      if (data) {
        console.log('Field upserted successfully:', data);
        const updatedData = data[0];
        setOriginalData(prev => ({ ...prev, [field]: fieldValue, updated_at: updatedData.updated_at })); // Update original data
        setFormData(prev => ({ ...prev, [field]: fieldValue, updated_at: updatedData.updated_at })); // Update form data
        toast.success('บันทึกข้อมูลสำเร็จ');
      } else {
        toast.error('ไม่สามารถบันทึกข้อมูลได้');
      }
      setSaving(false);
    } catch (error) {
      console.error('Error upserting field:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      setSaving(false);
    }
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isChanged = (field) => {
    console.log('Checking if field has changed:', field);
    console.log('Current value:', formData[field]);
    console.log('Original value:', originalData[field]);
    return JSON.stringify(formData[field]) !== JSON.stringify(originalData[field]);
  };

  const handleUpsertLocation = async (province_code) => {
    const teacherId = user.id;
    try {
      setSaving(true);
      const data = await upsertTeacherLocation(teacherId, province_code);
      if (data) {
       const provinceCodes = data.map(item => item.province_code);
       const updated_timestamp = data.find(item => item.updated_at)?.updated_at;
        const matchedProvinces = provinceCodes
          .map(code => provinces.find(p => String(p.value) === String(code)))
          .filter(Boolean); // removes any undefined

        setOriginalData(prev => ({ ...prev, selectedProvinces: matchedProvinces, updated_at: updated_timestamp })); // Update original data
        setFormData(prev => ({ ...prev, selectedProvinces: matchedProvinces, updated_at: updated_timestamp })); // Update form data
        toast.success('บันทึกข้อมูลสถานที่สอนสำเร็จ');
      } else {
        toast.error('ไม่สามารถบันทึกข้อมูลสถานที่สอนได้');
      }
      setSaving(false);
    } catch (error) {
      console.error('Error upserting location:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึกข้อมูลสถานที่สอน');
      setSaving(false);
    }
  };


  

  if (loading) return null;

  return (
  <>
    <form
      className="relative max-w-3xl mx-auto bg-white shadow-xl rounded-xl px-3 md:px-8 py-10 flex flex-col gap-6"
      noValidate
    >
      {/* Header */}
      <div className='flex flex-row justify-between items-center'>
        {/* Updated at */}
        <div className='text-xs'>
          { saving ?
          (
            <div>
              <p className='text-center text-gray-500'>กำลังบันทึกข้อมูล...</p>
            </div>
          ) : (
            <div>
              <p className="text-center text-gray-500">
                อัปเดตล่าสุด {new Date(formData.updated_at).toLocaleString('th-TH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </div>
        {/* Set Public */}
        <FormControlLabel 
          control={
            <Switch 
              checked={formData.is_public} 
              onChange={(e) => {
                const newValue = e.target.checked;
                const oldValue = originalData.is_public;

                if (newValue !== oldValue) {
                  handleUpsert('is_public', newValue);
                }

                updateField('is_public', newValue);
              }}
            />
          } 
          label="เผยแพร่"  
          className='flex justify-end'
        />
      </div>
      {/* General heading */}
      <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">ข้อมูลทั่วไป</h4>
      {/* General profile image */}
      <div className="w-full bg-white p-4 rounded-xl shadow-sm">
        <div className="mt-6 flex justify-center">
          <img
            src={formData.profile_picture || placeholder_image}
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
      {/* About teacher */}
      <MyTextField
        id={'ชื่อที่แสดง'}
        label="ชื่อที่แสดง"
        value={formData.display_name}
        onChange={(e) => updateField('display_name', e.target.value)}
        maxLength={16}
        showCounter={true}
        required={true}
        onBlur={(e) => {
          if (isChanged('display_name')) {
            handleUpsert('display_name', e.target.value);
          }
        }}
      />        
      <MyTextField
        id={'แนะนำตัว'}
        label="แนะนำตัว"
        value={formData.bio}
        onChange={(e) => updateField('bio', e.target.value)}
        multiline
        rows={3}
        maxLength={150}
        showCounter={true}
        required={true}
        onBlur={(e) => {
          if (isChanged('bio')) {
            handleUpsert('bio', e.target.value);
          }
        }}
      />
      {/* Contacts */}
      <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">รายละเอียดการติดต่อ</h4>
      {formData.contacts.map((contact, index) => (
        <div key={index} className=" w-full">
          <MyTextField
            id={contact.type} // Use the contact type as the ID
            label={contact.type.charAt(0).toUpperCase() + contact.type.slice(1)} // Capitalize the label
            value={contact.value} // Bind the value to the contact's value
            onChange={(e) => handleContactChange(index, e.target.value)} // Update the specific contact's value
            onBlur={(e) => {
              console.log('Contact field changed:', contact.type, e.target.value);
              if (isChanged('contacts')) {
                console.log('Contacts have changed, updating...');
                const updatedContacts = [...formData.contacts];
                updatedContacts[index].value = e.target.value;
                handleUpsert('contacts', updatedContacts);
              }
            }}
            multiline={false} // No need for multiline unless required
            maxLength={100} // Adjust maxLength as needed
            required={contact.type !== 'line link' && contact.type !== 'facebook link' && contact.type !== 'instagram link' && contact.type !== 'email'}            />
        </div>
      ))}

       
        <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">สถานที่สอน</h4>
        <MySelectionBox 
          options={provinces} 
          isMulti={true}
          placeholder={'จังหวัดที่สอน'}
          className={'z-10'}
          value={formData.selectedProvinces}
          onChange={(e) => {
            const newSelectedProvinces = e.map(option => option);
            
            const province_codes = e.map(option => option.value);

            const originalProvinces = originalData.selectedProvinces || [];


            const isDifferent = JSON.stringify(newSelectedProvinces) !== JSON.stringify(originalProvinces);

            if (isDifferent) {
              handleUpsertLocation(province_codes);
            }
            console.log('Selected provinces changed:', newSelectedProvinces);

            updateField('selectedProvinces', newSelectedProvinces);
          }}
        />
        {/* 
        <MyTextField
          id={'ข้อมูลสถานที่สอน'}
          label="ข้อมูลสถานที่สอน"
          value={formData.about_location}
          onChange={handleChange('about_location')}
          multiline
          rows={8}
          maxLength={1500}
          showCounter={true}
          required={true}
        /> */}
        {/* 
        <FormControlLabel control={<Switch checked={formData.can_travel} onChange={handleChange('can_travel')} />} label="สามารถเดินทางได้" />
        {formData.can_travel && (
            <MyTextField
            id={"หมายเหตุเกี่ยวกับการเดินทาง"}
            label="หมายเหตุเกี่ยวกับการเดินทาง"
            value={formData.travel_note}
            onChange={handleChange('travel_note')}
            multiline
            rows={2}
            maxLength={1000}
            showCounter={true}
          />
        )}
        <FormControlLabel control={<Switch checked={formData.can_online} onChange={handleChange('can_online')} />} label="สอนออนไลน์" />
    
        <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">ข้อมูลการสอน</h4>
        <MySelectionBox 
          options={levels} 
          isMulti={true}
          placeholder={'ระดับการสอน'}
          className={'z-10'}
          value={formData.selectedLevel}
          onChange={setSelectedLevel}
        />
        <MyTextField
          id={'ข้อมูลเกี่ยวกับการสอน'}
          label="ข้อมูลเกี่ยวกับการสอน"
          value={about_lesson}
          onChange={handleChange('about_lesson')}
          multiline
          rows={8}
          maxLength={1500}
          showCounter={true}
          required={true}
        />
        <MyTextField
          id={"ราคาต่อชั่วโมง (บาท)"}
          label="ราคาต่อชั่วโมง (บาท)"
          value={hourly_rate}
          onChange={handleChange('hourly_rate')}
          type='number'
          required={true}
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
          rows={8}
          maxLength={1500}
          showCounter={true}
          required={true}
        />
        <MyTextField
          id={"ใบรับรองคุณวุฒิ"}
          label="ใบรับรองคุณวุฒิ"
          value={qualification}
          onChange={handleChange('qualification')}
          multiline
          rows={8}
          maxLength={1500}
          showCounter={true}
          required={true}
        /> */}
    </form>
  </>

  );
}

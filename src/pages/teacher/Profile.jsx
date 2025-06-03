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
import { upsertTeacherProfileField, upsertTeacherLocation, deleteTeacherGallery } from '../../services/teacher';
import CloseIcon from '@mui/icons-material/Close';
import ReactPlayer from 'react-player';

export default function Profile() {
  const { user, isSubscribed } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [packages, setPackages] = useState([]);
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
    lesson_package: [],
    experience: '',
    qualification: '',
    is_subscribed: false,
    updated_at: '',
    swim_teacher_gallery: [],
    video_link: '',
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
            ),
            swim_teacher_gallery (*)
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
            lesson_package: data.lesson_package || [],
            experience: data.experience || '',
            qualification: data.qualification || '',
            is_subscribed: data.is_subscribed || false,
            updated_at: data.updated_at || '',
            swim_teacher_gallery: data.swim_teacher_gallery || [],
            video_link: data.video_link || '',
          };
          const packagesArray = JSON.parse(data.lesson_package || '[]');
          setPackages(packagesArray || []); // Initialize packages from data
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

  const handleUploadGallery = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (formData.swim_teacher_gallery.length >= 6) {
      toast.error('ไม่สามารถอัปโหลดรูปภาพได้');
      return;
    }
    const newLength = formData.swim_teacher_gallery.length + files.length;
    if (newLength > 6) {
      toast.error('มีรูปภาพในแกลเลอรี่ได้แค่ 6 รูป');
      return;
    }

    const fileArray = Array.from(files);
    const uploadPromises = fileArray.map(async (file) => {
      const fileName = `${user.id}-${file.name}`;
      try {
        // Upload the file to Supabase storage
        const { data, error } = await supabase.storage
          .from('teacher-gallery') // Replace with your Supabase storage bucket name
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true,
          });
        if (error) {
          toast.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
          console.error(error); 
          return null;
        }
        // Get the public URL of the uploaded file
        const { data: publicUrlData } = supabase.storage
          .from('teacher-gallery')
          .getPublicUrl(fileName);
        return publicUrlData.publicUrl;
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('เกิดข้อผิดพลาดที่ไม่คาดคิดในการอัปโหลดรูปภาพ');
        return null;
      }
    });
    try {
      setSaving(true);
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter(url => url !== null); // Filter out any null values
      if (validUrls.length > 0) {
        const { data, error } = await supabase
          .from('swim_teacher_gallery')
          .upsert(
            validUrls.map(url => ({
              teacher_id: user.id,
              image_url: url,
            })),
          );
        if (error) {
          console.error('Error uploading gallery images:', error);
          toast.error('ไม่สามารถอัปโหลดรูปภาพได้');
          setSaving(false);
          return;
        }
        // Update the formData with the new gallery images
        setFormData(prev => ({
          ...prev,
          swim_teacher_gallery: [
            ...prev.swim_teacher_gallery,
            ...validUrls.map(url => ({ image_url: url, teacher_id: user.id })),
          ],
          updated_at: new Date().toISOString(), // Update the timestamp
        }));
        setOriginalData(prev => ({
          ...prev,
          swim_teacher_gallery: [
            ...prev.swim_teacher_gallery,
            ...validUrls.map(url => ({ image_url: url, teacher_id: user.id })),
          ],
          updated_at: new Date().toISOString(), // Update the timestamp
        })); 
        // Update original data
        toast.success('อัปโหลดรูปภาพสำเร็จ');
      } else {
        toast.error('ไม่สามารถอัปโหลดรูปภาพได้');
      }
      setSaving(false);
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ');
      setSaving(false);
    }
  }

  const handleDeleteGalleryImage = async (imageUrl, teacherId) => {
    try {
      const data = await deleteTeacherGallery(imageUrl, teacherId);
      if (data) {
        // Update the formData to remove the deleted image
        setFormData(prev => ({
          ...prev,
          swim_teacher_gallery: prev.swim_teacher_gallery.filter(image => image.image_url !== imageUrl),
          updated_at: new Date().toISOString(), // Update the timestamp
        }));
        setOriginalData(prev => ({
          ...prev,
          swim_teacher_gallery: prev.swim_teacher_gallery.filter(image => image.image_url !== imageUrl),
          updated_at: new Date().toISOString(), // Update the timestamp
        })); // Update original data
        toast.success('ลบรูปภาพสำเร็จ');
      } else {
        toast.error('ไม่สามารถลบรูปภาพได้');
      }
    } catch (error) {
      console.error('Error deleting gallery image:', error);
      toast.error('เกิดข้อผิดพลาดในการลบรูปภาพ');
    }
  }

  const handleUpsert = async (field, value) => {
    const fieldValue = value;
    const fieldName = field;
    const teacherId = user.id;
    
    try {
      setSaving(true);
      const data = await upsertTeacherProfileField(fieldName, fieldValue, teacherId);
      if (data) {
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

  const handleAddPackage = () => {
    setPackages(prev => [...prev, { name: '', price: '', description: '' }]);
  };
  const handlePackageChange = (index, field, value) => {
    setPackages(prev => prev.map((info, i) =>
      i === index ? { ...info, [field]: value } : info
    ));
  };

  useEffect(() => {
  if (formData.is_public && isFormInvalid()) {
    setFormData(prev => ({ ...prev, is_public: false }));
    handleUpsert('is_public', false);
    toast.warn('ปิดการเผยแพร่อัตโนมัติ เนื่องจากข้อมูลไม่ครบถ้วน');
  }
  // eslint-disable-next-line
}, [
  formData.profile_picture,
  formData.display_name,
  formData.bio,
  formData.about_location,
  formData.about_lesson,
  formData.hourly_rate,
  formData.experience,
  formData.qualification,
  formData.selectedProvinces,
  formData.selectedLevel,
  formData.contacts,
]);

  const isFormInvalid = () => {
    const {
      profile_picture,
      display_name,
      bio,
      contacts,
      selectedProvinces,
      about_location,
      selectedLevel,
      about_lesson,
      hourly_rate,
      experience,
      qualification,
    } = formData;

    // Check each required field
    if (
      !profile_picture.trim() ||
      !display_name.trim() ||
      !bio.trim() ||
      !about_location.trim() ||
      !about_lesson.trim() ||
      !hourly_rate ||
      !experience.trim() ||
      !qualification.trim() ||
      selectedProvinces.length === 0 ||
      selectedLevel.length === 0 ||
      !contacts.some(contact => contact.value && contact.value.trim())
    ) {
      return true; // Form is invalid (some required field is empty)
    }
    return false; // All required fields are filled
  };
  

  if (loading) return null;

  return (
  <>
    <form
      className="relative max-w-3xl mx-auto bg-white shadow-xl rounded-xl px-3 md:px-8 py-10 flex flex-col gap-6"
      noValidate
    >
      {/* Header */}
      <div className='flex flex-col items-center md:flex-row md:justify-between'>
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
                {formData.updated_at ? `อัปเดตล่าสุด ${new Date(formData.updated_at).toLocaleString('th-TH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }) }` : 'ยังไม่มีการอัปเดตข้อมูล'}
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
                // Check if form is empty
                if (isFormInvalid()) {
                  toast.error('กรุณากรอกข้อมูลก่อนเผยแพร่');
                  return;
                }

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
        <div className="flex justify-center">
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
              accept=".png, .jpg, .jpeg"
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
      {/* Video Introduction */}
      <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">วิดีโอแนะนำตัว</h4>
      <MyTextField
        id={'วิดีโอลิงค์'}
        label="วิดีโอลิงค์ (Youtube Link)"
        value={formData.video_link}
        onChange={(e) => updateField('video_link', e.target.value)}
        onBlur={(e) => {
          if (isChanged('video_link')) {
            handleUpsert('video_link', e.target.value);
          }
        }}
      />
      {formData.video_link && ReactPlayer.canPlay(formData.video_link) ? (        
        <div className='flex items-center justify-center w-full aspect-video'>
          <ReactPlayer 
            url={formData.video_link}
            controls={true}
            width="100%"
            height="100%"
            style={{ maxHeight: '100%' }}
            config={
              {
                youtube: {
                  playerVars: {
                    rel: 0, // Disable related videos at the end
                    modestbranding: 1,
                    showinfo: 0, // Hide video title and uploader
                  },
                },
              }
            }
          />
        </div>
      ) :
        (
          <p className='text-sm text-gray-500 self-center'>กรุณาใส่ลิงค์วิดีโอแนะนำตัว (YouTube Link)</p>
        )
      }

      {/* Gallery Upload */}
      <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">แกลเลอรี่ <span className='text-sm text-gray-400'>(6 รูปภาพ)</span></h4>
      <input type='file' id='file' accept=".png, .jpg, .jpeg" multiple onChange={handleUploadGallery}
        className="block w-full text-sm text-gray-700
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100
        cursor-pointer
        overflow-hidden"
      />
      {formData.swim_teacher_gallery.length > 0 && (
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {formData.swim_teacher_gallery.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image.image_url || placeholder_image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg shadow-md"
                />
                <CloseIcon 
                  className='absolute top-2 right-1 bg-black/5 hover:bg-black/40 rounded-full cursor-pointer'
                  fontSize='medium'
                  onClick={() => handleDeleteGalleryImage(image.image_url, user.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

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
              if (isChanged('contacts')) {
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
      
      {/* Locations */}
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
          updateField('selectedProvinces', newSelectedProvinces);
        }}
      />
      <MyTextField
        id={'ข้อมูลสถานที่สอน'}
        label="ข้อมูลสถานที่สอน"
        value={formData.about_location}
        onChange={(e) => updateField('about_location', e.target.value)}
        onBlur={(e) => {
          if (isChanged('about_location')) {
            handleUpsert('about_location', e.target.value);
          }
        }}
        multiline
        rows={8}
        maxLength={1500}
        showCounter={true}
        required={true}
      />
      <FormControlLabel control={<Switch checked={formData.can_travel} 
        onChange={(e) => {
                const newValue = e.target.checked;
                const oldValue = originalData.can_travel;

                if (newValue !== oldValue) {
                  handleUpsert('can_travel', newValue);
                }

                updateField('can_travel', newValue);
              }} />
      } label="สามารถเดินทางได้" />
        
      {formData.can_travel && (
          <MyTextField
          id={"หมายเหตุเกี่ยวกับการเดินทาง"}
          label="หมายเหตุเกี่ยวกับการเดินทาง"
          value={formData.travel_note}
          onChange={(e) => updateField('travel_note', e.target.value)}
          onBlur={(e) => {
            if (isChanged('travel_note')) {
              handleUpsert('travel_note', e.target.value);
            }
          }}
          multiline
          rows={3}
          maxLength={1000}
          showCounter={true}
        />
      )}
      <FormControlLabel 
      control={<Switch checked={formData.can_online} 
        onChange={(e) => {
                const newValue = e.target.checked;
                const oldValue = originalData.can_online;

                if (newValue !== oldValue) {
                  handleUpsert('can_online', newValue);
                }

                updateField('can_online', newValue);
              }}
      />} label="สอนออนไลน์" />
      
      {/* Lessons */}
      <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">ข้อมูลการสอน</h4>
      <MySelectionBox 
        options={levels} 
        isMulti={true}
        placeholder={'ระดับการสอน'}
        className={'z-10'}
        value={formData.selectedLevel}
        onChange={(e) => {
          const newSelectedLevels = e.map(level => level);
          const levels = e.map(level => level.value);
          const originalLevels = originalData.selectedLevel || [];
          const isDifferent = JSON.stringify(newSelectedLevels) !== JSON.stringify(originalLevels);
          if (isDifferent) {
            handleUpsert('levels', levels);
          }
          updateField('selectedLevel', newSelectedLevels);
        }}
      />
      
      <MyTextField
        id={'ข้อมูลเกี่ยวกับการสอน'}
        label="ข้อมูลเกี่ยวกับการสอน"
        value={formData.about_lesson}
        onChange={(e) => updateField('about_lesson', e.target.value)}
        onBlur={(e) => {
          if (isChanged('about_lesson')) {
            handleUpsert('about_lesson', e.target.value);
          }
        }}
        multiline
        rows={8}
        maxLength={1500}
        showCounter={true}
        required={true}
      />
      <MyTextField
        id={"ราคาต่อชั่วโมง (บาท)"}
        label="ราคาต่อชั่วโมง (บาท)"
        value={formData.hourly_rate}
        onChange={(e) => updateField('hourly_rate', e.target.value)}
        onBlur={(e) => {
          if (isChanged('hourly_rate')) {
            handleUpsert('hourly_rate', e.target.value);
          }
        }}
        type='number'
        required={true}
      />
      <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">แพ็คเกจการสอน</h4>
      {packages.map((info, idx) => (
        <div key={idx} className="p-4 rounded-2xl border-gray-400 border-2 mb-2 flex flex-col gap-2">
          <MyTextField
            label="ชื่อแพ็คเกจ"
            value={info.name}
            onChange={e => handlePackageChange(idx, 'name', e.target.value)}
            maxLength={64}
            showCounter={true}
          />
          <MyTextField
            label="รายละเอียด"
            value={info.description}
            onChange={e => handlePackageChange(idx, 'description', e.target.value)}
            multiline
            rows={3}
            showCounter={true}
            maxLength={500}
          />
          <MyTextField
            label="ราคา (บาท)"
            value={info.price}
            onChange={e => handlePackageChange(idx, 'price', e.target.value)}
            type='number'
          />
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setPackages(prev => prev.filter((_, i) => i !== idx))
              handleUpsert('lesson_package', JSON.stringify(packages.filter((_, i) => i !== idx)))
            }}
          >
            ลบแพ็คเกจ
          </Button>
        </div>
      ))}
        <div className='flex justify-between items-center'>
          {packages.length !== 0 && (
            <Button
              variant="contained"
              color="success"
              onClick={() =>
              {
                if (packages.length > 0) {
                  const isDifferent = JSON.stringify(packages) !== JSON.stringify(originalData.lesson_package);
                  if (isDifferent) {
                    handleUpsert('lesson_package', JSON.stringify(packages));
                  }
                }
              }}
            >
              บันทึกแพ็คเกจ
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleAddPackage}
            >
            เพิ่มแพ็คเกจ
          </Button>
        </div>
      {/* Experience */}
      <h4 className="text-lg font-semibold text-gray-700 border-b pb-1">ประสบการณ์และคุณวุฒิ</h4>
      <MyTextField
        id={"ประสบการณ์"}
        label="ประสบการณ์"
        value={formData.experience}
        onChange={(e) => updateField('experience', e.target.value)}
        onBlur={(e) => {
          if (isChanged('experience')) {
            handleUpsert('experience', e.target.value);
          }
        }}
        multiline
        rows={8}
        maxLength={1500}
        showCounter={true}
        required={true}
      />
      <MyTextField
        id={"ใบรับรองคุณวุฒิ"}
        label="ใบรับรองคุณวุฒิ"
        value={formData.qualification}
        onChange={(e) => updateField('qualification', e.target.value)}
        onBlur={(e) => {
          if (isChanged('qualification')) {
            handleUpsert('qualification', e.target.value);
          }
        }}
        multiline
        rows={8}
        maxLength={1500}
        showCounter={true}
        required={true}
      /> 
    </form>
  </>

  );
}

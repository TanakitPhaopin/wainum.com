import { supabase } from "../lib/supabase";

// Upsert a field in the swim_teacher_profiles table
export async function upsertTeacherProfileField(
  fieldName,
  fieldValue,
  teacherId
) {
  try {
    const { data, error } = await supabase
      .from("swim_teacher_profiles")
      .upsert({ [fieldName]: fieldValue, id: teacherId, updated_at: new Date() })
      .select("*");

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error upserting teacher profile field:", error);
    return null;
  }
}

// Upsert a swim teacher location
export async function upsertTeacherLocation(teacherId, province_code) {
  try {
    console.log("Upserting teacher location for ID:", teacherId, "with provinces:", province_code);
    const { error: deleteError } = await supabase
      .from("swim_teacher_locations")
      .delete()
      .eq("id", teacherId);

    if (deleteError) throw deleteError;

    const insertData = province_code.map(code => ({
      id: teacherId,
      province_code: code,
    }));

    const { data, error: insertError } = await supabase
      .from("swim_teacher_locations")
      .insert(insertData)
      .select();
      if (insertError) throw insertError;
    
    const { data: updateTimestampData, error: updateTimestampError } = await supabase
      .from("swim_teacher_profiles")
      .update({ updated_at: new Date() })
      .eq("id", teacherId)
      .select("updated_at");
    if (updateTimestampError) throw updateTimestampError;
    const combinedData = [...insertData, ...updateTimestampData];
    console.log("Successfully upserted teacher location:", combinedData);
    return combinedData;
  } catch (error) {
    console.error("Error upserting teacher location:", error);
    return null;
  }
}

// Delete a image from swim_teacher_gallery
export async function deleteTeacherGallery(imageURL, teacherId) {
  try {
    const { data, error } = await supabase
      .from("swim_teacher_gallery")
      .delete()
      .eq("teacher_id", teacherId)
      .eq("image_url", imageURL)
      .select("*");

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error deleting teacher gallery image:", error);
    return null;
  }
}
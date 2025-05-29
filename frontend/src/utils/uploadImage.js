import { API_PATHS } from "./apiPaths";
import apiService from "./apiServices";

const uploadeImage = async (image) => {
    try {
        const formData = new FormData();

        formData.append("image", image);
        const response = await apiService.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading the file",error);
        throw error;
    }
};

export default uploadeImage;
import http from "@/http-common"

class UploadFilesService {
    upload(Module, UUID, file, onUploadProgress) {
        let formData=new FormData();
        formData.append("files", file);
        formData.append("module", Module);
        formData.append("fromuuid", UUID)
        return http.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress
        });
    }

    getFiles(Module, UUID) {
        return http.get("/files/"+Module+"/"+UUID);
    }
}

export default new UploadFilesService();
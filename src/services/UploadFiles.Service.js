import http from "@/http-common"

class UploadFilesService {
    upload(Module, UUID, file, onUploadProgress) {
        let formData=new FormData();
        for (var i=0; i<file.length; i++) {
            formData.append("files", file[i]);
        }
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

    deleteFile(UUID) {
        return http.delete("/deletefile/"+UUID);
    }
}

export default new UploadFilesService();
<template>
    <div>
        <div v-if="progressInfos">
            <div class="mb-2" v-for="(progressInfo, index) in progressInfos" :key="index">
                <span>{{ progressInfo.fileName }}</span>
                <div class="progress">
                    <div class="progress-bar progress-bar-info"
                         role="progressbar"
                         :aria-valuenow="progressInfo.percentage"
                         aria-valuemin="0" aria-valuemax="100"
                         :style="{ width: progressInfo.percentage+'%' }">
                        {{ progressInfo.percentage }}%
                    </div>
                </div>
            </div>
        </div>

        <label class="btn btn-default">
            <input type="file" multiple @change="selectFile">
        </label>
        <button class="btn btn-success" :disabled="!selectedFiles" @click="uploadFiles">Upload</button>
        <div v-if="message" class="alert alert-light" role="alert">
            <ul>
                <li v-for="(ms, i) in message.split('\n')" :key="i">
                    {{ ms }}
                </li>
            </ul>
        </div>
        <div class="card">
            <div class="card-header">List of Files</div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item" v-for="(file, index) in fileInfos" :key="index">
                    <a :href="file.url">{{ file.name }}</a>
                    <button class="btn btn-danger" @click="deleteFile(file.url)">Delete</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import UploadFilesService from "@/services/UploadFiles.Service";

export default {
    name: "UploadFiles",
    data() {
        return {
            selectedFiles: undefined,
            progressInfos: [],
            message: "",
            fileInfos: [],
            Module: "Item",
            UUID: "aaaa-bbbb-cccc-dddd",
        };
    },
    methods: {
        selectFile(event) {
            this.progressInfos=[];
            this.selectedFiles=event.target.files;
            console.log(this.selectedFiles);
        },
        uploadFiles() {
            let arr=[];
            this.message="";
            for (let i=0; i<this.selectedFiles.length; i++) {
                arr[i]=this.selectedFiles[i];
            }
            this.upload(0, arr);
        },
        upload(idx, file) {
            this.progressInfos[idx]={ percentage: 0, fileName: file[0].name };
            UploadFilesService.upload(this.Module, this.UUID, file, (event)=> {
                this.progressInfos[idx].percentage=Math.round(100 * event.loaded / event.total);
            })
            .then(
                (response)=>{
                    let prevMessage=this.message?this.message+"\n":"";
                    this.message=prevMessage+response.data.message;
                    return UploadFilesService.getFiles(this.Module, this.UUID);
                }
            )
            .then((files)=>{
                this.fileInfos=files.data;
            })
            .catch((error)=>{
                console.log(error.response.data.message);
                this.progressInfos[idx].percentage=0;
                this.message="Could not upload the file: "+file[0].name;
            });
        },
        deleteFile(url) {
            let UUID=url.split("/")[4];
            UploadFilesService.deleteFile(UUID).then((response)=>{
                this.message=response.data.message;
                this.fileInfos=this.fileInfos.filter((file)=>{
                    return file.url!=url? true : false;
                });
            });
        }
    },
    mounted() {
        UploadFilesService.getFiles(this.Module, this.UUID).then((response)=>{
            this.fileInfos=response.data;
        });
    },
}
</script>

<style scoped>

</style>
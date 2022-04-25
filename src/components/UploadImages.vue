<template>
    <div>
        <div class="row">
            <div class="col-8">
                <label class="btn btn-default p-0">
                    <input type="file" accept="image/*" ref="file" multiple @change="selectImage">
                </label>
            </div>
            <div class="col-4">
                <button class="btn btn-success btn-sm float-right" :disabled="!currentImage" @click="upload">
                    Upolad
                </button>
            </div>
            <div v-if="currentImage" class="progress">
                <div class="progress-bar progress-bar-info" role="progressbar" :aria-valuenow="progress" :aria-valuemin="0" :aria-valuemax="100" :style="{ width: progress+'%' }">
                    {{ progress }}%
                </div>
            </div>
            <div v-if="previewImage">
                <div v-for="(preImage, index) in previewImage" :key="index">
                    <img class="preview my-3" :src="preImage" alt="" />
                </div>
            </div>
            <div v-if="message" class="alert alert-secondary" role="alert">
                {{ message }}
            </div>
            <div class="card mt-3">
                <div class="card-header">List of Images</div>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item" v-for="(image, index) in imageInfos" :key="index">
                        <a :href="image.url"><img :src="image.url"/>{{ image.name }}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import UploadFilesService from "@/services/UploadFiles.Service";

export default {
    name: "UploadImages",
    data() {
        return {
            currentImage: undefined,
            previewImage: [],
            progress: 0,
            message: "",
            imageInfos: [],
            Module: "Item",
            UUID: "aaaa-bbbb-cccc-dddd",
        }
    },
    methods: {
        selectImage() {
            this.currentImage=this.$refs.file.files;
            console.log(this.$refs.file.files);
            for (var i=0; i<this.currentImage.length; i++) {
                this.previewImage[i]=URL.createObjectURL(this.currentImage[i]);
            }
            console.log(this.previewImage);
            this.progress=0;
            this.message="";
        },
        upload() {
            this.progress=0;
            let arr=[];
            for (var i=0; i<this.currentImage.length; i++) {
                arr[i]=this.currentImage[i];
            }
            UploadFilesService.upload(this.Module, this.UUID, arr, (event)=>{
                this.progress=Math.round((100 * event.loaded) / event.total);   //Math.round用來四捨五入
            })
            .then((response)=>{
                this.message=response.data.message;
                return UploadFilesService.getFiles(this.Module, this.UUID);
            })
            .then((images)=>{
                this.imageInfos=images.data;
            })
            .catch((error)=>{
                this.progress=0;
                this.message=error.response.data.message;
                this.currentImage=undefined;
            });
        },
    },
    mounted() {
        UploadFilesService.getFiles(this.Module, this.UUID).then((response)=>{
            this.imageInfos=response.data;
        });
    }
}
</script>

<style scoped>
.preview {
    max-width: 200px;
}
</style>
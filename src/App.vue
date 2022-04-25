<template>
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
    <div class="container" style="width: 600px">
        <div style="margin: 20px">
            <h3>Vue Multiple Files Upload</h3>
        </div>
    </div>
    <UploadFile />
    <UploadImages />
</template>

<script>
import UploadFile from '@/components/UploadFiles.vue'
import UploadImages from "@/components/UploadImages";

export default {
  name: 'App',
  components: {
      UploadFile,
      UploadImages
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

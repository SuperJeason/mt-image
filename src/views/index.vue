<template>

    <body>
        <div class="upload-container">
            <h1>{{ quote }}</h1>
            <button class="history-btn" @click="goToHistory">历史记录</button>
            <el-upload class="upload-multiple-file" drag multiple :before-upload="beforeUpload"
                :on-change="handleChange">
                <el-icon class="el-icon--upload "><upload-filled /></el-icon>
                <div class="el-upload__text ">
                    Drop file here or <em>click to upload</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip ">
                        jpg/png files with a size less than 5000kb
                    </div>
                </template>
            </el-upload>
            <img v-if="previewSrc" :src="previewSrc" alt="图片预览" id="preview" />
            <p id="urlText" v-if="url">{{ url }}</p>
        </div>
    </body>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getOneWordService, uploadFileToServerService } from '@/api/request';


const router = useRouter();
const quote = ref('');
const previewSrc = ref('');
const url = ref('');
const tooltipMessage = ref('');

const goToHistory = () => {
    router.push('/history');
};

// 在组件挂载后获取一句名言
onMounted(async () => {
    quote.value = await getOneWordService();
});

// 文件上传前的校验
const beforeUpload = (file) => {
    const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt5M = file.size / 1024 / 1024 < 5;

    if (!isJPGorPNG) {
        ElMessage.error('只能上传 JPG/PNG 格式的图片!');
        return false;
    }
    if (!isLt5M) {
        ElMessage.error('图片大小不能超过 5MB!');
        return false;
    }
    return true;
};

// 文件状态发生改变时触发（选择文件或删除文件）
const handleChange = async (file, fileList) => {
    if (file.status === 'ready') {
        ElMessage.info({ message: '正在准备上传...', duration: 1500 });
    } else if (file.status === 'success') {
        url.value = file.response;
        ElMessage.success({ message: '上传成功！', duration: 1500 });
    } else if (file.status === 'error') {
        ElMessage.error({ message: '上传失败，请重试。', duration: 1500 });
    }

    // 设置预览图
    previewSrc.value = URL.createObjectURL(file.raw);

    // 上传文件到服务器
    if (file.status === 'ready') {
        try {
            const uploadedUrl = await uploadFileToServerService(file);
            url.value = uploadedUrl;
            ElMessage.success({ message: '文件上传成功！', duration: 1500 });
            console.log(uploadedUrl)
            const uploadTime = new Date().toISOString(); // 获取当前时间
            const fileInfo = {
                url: uploadedUrl,
                time: uploadTime,
            };
            const existingFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
            existingFiles.push(fileInfo);
            localStorage.setItem('uploadedFiles', JSON.stringify(existingFiles));
        } catch (error) {
            ElMessage.error('文件上传失败！');
        }
    }
};
</script>

<style scoped>
/* 风格保持不变 */
body {
    font-family: Arial, sans-serif;
    width: 100%;
    height: 100vh;
    overflow: auto;
    background: url('https://img.meituan.net/video/9653655396ac65fe2d06c8f7b8a19017785738.jpg') no-repeat center center fixed;
    background-size: cover;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

h1 {
    color: #1d1919;
    text-align: center;
    margin: 10px 0;
}


.upload-multiple-file {
    width: 100%;
    background-color: rgba(255, 255, 255, 0);
}



.upload-container {
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    padding: 50px;
    border-radius: 20px;
    width: 100%;
    max-width: 1200px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}



.history-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: rgba(82, 110, 88, 0.5);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.history-btn:hover {
    background-color: rgba(0, 86, 179, 0.9);
}

#preview {
    margin: 15px auto;
    max-width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: 8px;
}

#urlText {
    margin-top: 15px;
    padding: 10px;
    background-color: rgba(45, 97, 100, 0.1);
    border-radius: 4px;
    text-align: left;
}
</style>
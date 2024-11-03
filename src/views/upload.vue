<template>
    <div class="background-container">
        <el-container>
            <el-header class="header">
                <div class="word" v-if="oneWord" :class="{ 'fade-in': oneWord }">
                    {{ oneWord }}
                </div>
                <el-button class="transparent-button" style="float: right; margin: 10px;" @click="navigateToRoute">
                    时光图片
                </el-button>
            </el-header>
            <el-main class="main-content">
                <el-upload action="https://pic-up.meituan.com/extrastorage/new/video?isHttps=true"
                    list-type="picture-card" :auto-upload="true" :file-list="fileList" :before-upload="beforeUpload"
                    >
                    <el-icon>
                        <Plus />
                    </el-icon>

                    <template #file="{ file }">
                        <div class="upload-item">
                            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                            <span class="el-upload-list__item-actions">
                                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                                    <el-icon>
                                        <View />
                                    </el-icon>
                                </span>
                                <span v-if="!disabled" class="el-upload-list__item-delete"
                                    @click="handleCopyLink(file.uid)">
                                    <el-icon>
                                        <Link />
                                    </el-icon>
                                </span>
                                <span v-if="!disabled" class="el-upload-list__item-delete"
                                    @click="handleRemove(file.uid)">
                                    <el-icon>
                                        <Delete />
                                    </el-icon>
                                </span>
                            </span>
                        </div>
                    </template>
                </el-upload>
            </el-main>
            <el-footer class="footer">
                <div>
                    当前时间是 <span style="color:blanchedalmond;">{{ currentTime }}</span>
                </div>
            </el-footer>
        </el-container>
    </div class="background-container">

    <el-dialog v-model="dialogVisible" draggable>
        <div class="img-container">
            <img :src="dialogImageUrl" alt="Preview Image" />
        </div>
    </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Delete, View, Plus, Link } from '@element-plus/icons-vue';
import { UploadFile, ElMessage, ElMessageBox } from 'element-plus';
import { getOneWordService } from '@/api/request'
import { uploadFileToServerService } from '@/api/request'
import router from '@/router/index'

// 定义响应式变量
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const disabled = ref(false);
const currentTime = ref('');
const oneWord = ref('');
const fileList = ref<UploadFile[]>([]);
const uploadFileToServer = async (file: UploadFile) => {
    return uploadFileToServerService(file);
};


const navigateToRoute = () => {
    router.replace('/history'); // 替换为你的实际路由路径
};



const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleString(); // 格式化当前时间
};

const getOneWord = async () => {
    oneWord.value = await getOneWordService();
}
onMounted(() => {
    getOneWord();
    setInterval(updateTime, 1000); // 每秒更新时间
});

// 在 beforeUpload 中调用
const beforeUpload = async (file: UploadFile) => {
    try {
        const originalLink = await uploadFileToServer(file);
        ElMessage({
            message: '上传成功！',
            type: 'success',
        })
        const uploadTime = new Date().toISOString(); // 获取当前时间
        const fileInfo = {
            url: originalLink,
            time: uploadTime,
        };
        file.url = originalLink;
        fileList.value.push(file); // 添加上传成功的文件
        // 将文件信息存储到 localStorage
        const existingFiles = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
        existingFiles.push(fileInfo);
        localStorage.setItem('uploadedFiles', JSON.stringify(existingFiles));
    } catch (error) {
        // 处理上传失败的逻辑
        console.error('上传失败:', error);
    }
};



const handleRemove = (fileUid: number) => {
    ElMessageBox.confirm(
        '删除当前照片?确定吗？',
        '警告',
        {
            cancelButtonText: 'Cancel', // 将 OK 放在 Cancel 的位置
            confirmButtonText: 'OK', // 将 Cancel 放在 OK 的位置
            type: 'warning',
        }
    )
        .then(() => {
            // 使用 filter 方法移除指定 uid 的文件
            const updatedFileList = fileList.value.filter(item => item.uid !== fileUid);
            // 更新 fileList 的值
            fileList.value = updatedFileList;

            // 额外的调试信息
            console.log('当前文件列表:', fileList.value);
            ElMessage({
                type: 'success',
                message: '已经成功删除',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '删除已取消',
            })
        })
};



const handlePictureCardPreview = (file: UploadFile) => {
    dialogImageUrl.value = file.url!;
    dialogVisible.value = true;
};

const handleCopyLink = async (fileUid: number) => {
    // 从 fileList 中找到对应的文件对象
    const file = fileList.value.find(item => item.uid === fileUid);

    if (file && file.url) {
        try {
            await navigator.clipboard.writeText(file.url); // 复制上传后的 URL
            console.log('链接已复制:', file.url);
            // 可以选择在此显示一个提示，比如 toast 消息
            ElMessage({
                message: '链接复制成功！',
                type: 'success',
            })
        } catch (error) {
            ElMessage({
                message: '链接复制失败，请重试！',
                type: 'error',
            })
        }
    } else {
        ElMessage({
            message: '文件对象不存在或没有 URL',
            type: 'error',
        })
    }
};

</script>
<style>
.upload-item {
    position: relative;
    /* 确保子元素绝对定位正常 */
}
.transparent-button {
    background-color: rgba(255, 255, 255, 0.5);
    /* 设置透明白色背景 */
    border: 1px solid rgba(255, 255, 255, 0.7);
    /* 半透明边框 */
    color: #fff;
    /* 设置文字颜色 */
    transition: background-color 0.3s, border-color 0.3s;
    /* 添加过渡效果 */
}

.transparent-button:hover {
    background-color: rgba(255, 255, 255, 0.8);
    /* 悬停时背景稍微变深 */
    border-color: rgba(255, 255, 255, 1);
    /* 悬停时边框变为不透明 */
}
.upload-item .el-upload-list__item-actions {
    background: transparent;
    /* 设置背景透明 */
    position: absolute;
    /* 绝对定位，以便于更好地控制位置 */
    bottom: 0;
    /* 可以调整位置 */
    left: 0;
    /* 可以调整位置 */
    right: 0;
    /* 可以调整位置 */
    padding: 8px;
    /* 根据需要设置内边距 */
    display: flex;
    /* 使其成为弹性盒子，调整内部元素排列 */
    justify-content: space-between;
    /* 调整内部元素间距 */
}

.el-upload--picture-card {
    background: transparent;
    /* 设置背景透明 */
    border: none;
    /* 如果有边框，去掉边框 */
}

.el-upload--picture-card .el-upload-list {
    background: transparent;
    /* 设置上传列表背景透明 */
}

.el-upload-list__item.is-success {
    background: transparent;
    /* 设置背景透明 */
    border: none;
    /* 去掉边框，如果有的话 */
}

.word {
    font-size: 30px;
    /* 设置字体大小 */
    color: #3498db;
    /* 文字颜色 */
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    /* 添加阴影效果 */
    opacity: 0.8;
    /* 默认透明度 */
    transition: opacity 0.3s ease, color 0.3s ease;
    /* 添加过渡效果 */
}

.word.fade-in {
    opacity: 1;
    /* 渐显 */
    color: #050920;
    /* 渐变颜色 */
}

.background-container {
    display: flex;
    /* 使用 flex 布局 */
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    height: 100vh;
    /* 设置高度为视口高度，以便能够垂直居中 */
    background: linear-gradient(135deg, #57b8df, #68cf90);
    /* 渐变色背景 */
}

.main-container {
    height: 100vh;
    /* 填满整个视口 */
}

.header {
    position: relative;
    top: 50px;
    text-align: center;
}



.footer {
    text-align: center;
    /* 内容居中对齐 */
}

.main-content {
    display: flex;
    /* 使用 flex 布局 */
    justify-content: center;
    /* 水平居中 */
    align-items: center;
    /* 垂直居中 */
    flex-direction: column;
    /* 纵向排列子元素 */
    height: calc(100vh - 100px);
    /* 根据需要调整高度（如 Header 和 Footer 的高度） */
}

.upload-item {
    max-width: 100%;
    height: auto;
    margin: 0 auto;
}

.img-container {
    display: flex;
    justify-content: center;
    align-items: center;
    max-height: 600px;
    overflow: hidden;
}

img {
    max-width: 100%;
    max-height: 600px;
    height: auto;
}
</style>

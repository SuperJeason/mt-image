<template>
    <div class="waterfall-container">
        <Waterfall :list="list" :row-key="'id'" :gutter="16" :width="300" :breakpoints="{ 1200: 4, 800: 3, 500: 3 }"
            :img-selector="'src'" :lazyload="true">
            <template #default="{ item }">
                <transition name="fade">
                    <div class="card">
                        <img :src="item.src" alt="item.uploadTime" class="card-image" />
                        <div class="card-content">
                            <h3>
                                <span class="icon-group">
                                    <el-icon @click="showImage(item.src)">
                                        <View />
                                    </el-icon>
                                    <el-icon @click="copyLink(item.src)">
                                        <Link />
                                    </el-icon>
                                    <el-icon @click="deleteItem(item.src)">
                                        <Delete />
                                    </el-icon>
                                </span>
                            </h3>
                            <p>{{ item.uploadTime }}</p>
                        </div>
                    </div>
                </transition>
            </template>
        </Waterfall>
        <el-dialog v-model="dialogVisible" draggable>
            <div class="img-container">
                <img :src="dialogImageUrl" alt="Preview Image" />
            </div>
        </el-dialog>
    </div>
    <el-backtop :bottom="100" class=" backtop-circle" visibility-height="0" @click="goBackHome()">
        <el-icon>
            <House />
        </el-icon>
    </el-backtop>
    <el-backtop class=" backtop-circle" :right="100" :bottom="100" />
</template>


<script>
import { ref, onMounted } from 'vue';
import { Waterfall } from 'vue-waterfall-plugin-next';
import 'vue-waterfall-plugin-next/dist/style.css';
import { ElMessageBox, ElMessage } from 'element-plus';
import { inject } from 'vue';
import { useRouter } from 'vue-router';
export default {
    setup() {
        const reload = inject('reload'); // 注入 reload 方法
        const list = ref([]);  // 使用 ref 创建响应式列表
        const dialogImageUrl = ref('');
        const dialogVisible = ref(false);
        const router = useRouter();

        const loadItemsFromLocalStorage = () => {
            const storedItems = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
            console.log(storedItems);
            list.value = storedItems.map((item, index) => ({
                id: index + 1,
                src: item.url,
                uploadTime: formatDate(item.time) || '',
            }));
        };

        const showImage = (imagesrc) => {
            dialogImageUrl.value = imagesrc;
            dialogVisible.value = true;
        };

        const copyLink = (itemSrc) => {
            navigator.clipboard.writeText(itemSrc)
                .then(() => {
                    ElMessage({
                        message: '链接已复制到剪贴板！',
                        type: 'success',
                    });
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    ElMessage({
                        message: '复制失败，请重试。',
                        type: 'error',
                    });
                });
        };
        const goBackHome = () => {
            console.log("回到主页")
            router.push('/');
        };
        const deleteItem = (itemSrc) => {
            ElMessageBox.confirm('您确定要删除这个链接吗？', '警告', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }).then(() => {
                const storedItems = JSON.parse(localStorage.getItem('uploadedFiles') || '[]');
                const updatedItems = storedItems.filter(item => item.url !== itemSrc);

                // 更新 localStorage
                localStorage.setItem('uploadedFiles', JSON.stringify(updatedItems));

                console.log(list.value);
                // 更新响应式的 list
                list.value = updatedItems;

                console.log(list.value);
                // 提示用户删除成功
                reload();
                ElMessage({
                    message: '链接已删除！',
                    type: 'success',
                    duration: 1500,
                });

            }).catch(() => {
                ElMessage({
                    message: '删除操作已取消',
                    type: 'info',
                    duration: 1500,
                });
            });
        };

        // 在组件创建时加载数据
        loadItemsFromLocalStorage();

        return {
            list,
            dialogImageUrl,
            dialogVisible,
            showImage,
            copyLink,
            deleteItem,
            goBackHome,
        };
    },
};
const formatDate = (time) => {
    if (!time) return ''; // 如果没有时间，返回空字符串
    const date = new Date(time);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};


</script>



<style scoped>
/* 这里加入三个按捏的间距 */
.icon-group {
    display: flex;
    /* 使用 flex 布局 */
    gap: 10px;
    /* 设置图标之间的间距 */
}


.backtop-circle {
    width: 40px;
    /* 按钮宽度 */
    height: 40px;
    /* 按钮高度 */
    border-radius: 50%;
    /* 圆形按钮 */
    background-color: rgba(39, 25, 48, 0.7);
    /* 半透明背景 */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    /* 过渡效果 */
}

.backtop-circle:hover {
    background-color: rgba(0, 0, 0, 0.9);
    /* 悬停时加深颜色 */
    transform: scale(1.1);
    /* 悬停时放大 */
}

.backtop-circle el-icon {
    color: white;
    /* 图标颜色 */
    font-size: 24px;
    /* 图标大小 */
}


.waterfall-container {
    background: linear-gradient(135deg, #57b8df, #68cf90);
    min-height: 100vh;
    /* 透明度设置为0.8 */
}

.card {
    background-color: rgb(129, 151, 137);
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-bottom: 16px;
    transition: transform 0.2s;
}

.waterfall-list {
    background-color: rgba(245, 235, 235, 0);
}

.card:hover {
    transform: translateY(-8px);
}

.card-image {
    width: 100%;
    height: auto;
}

.card-content {
    padding: 11px;
}

.card-content h3 {
    margin-top: 0;
    margin-bottom: 8px;
    font-size: 1.2rem;
}

.card-content p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
}
</style>
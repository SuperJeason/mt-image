<template>
    <div>
        <MyWaterfall :list="imageList" />
    </div>
</template>

<script>
import MyWaterfall from './MyWaterfall.vue'

export default {
    components: {
        MyWaterfall
    },
    data() {
        return {
            imageList: [
                { src: 'https://img.meituan.net/video/fe14b1aebe2a1016e59bba224c1bfb731423524.jpg', fromPageTitleEnc: '图片1' },
                { src: 'https://img.meituan.net/video/fe14b1aebe2a1016e59bba224c1bfb731423524.jpg', fromPageTitleEnc: '图片2' },
                { src: 'https://img.meituan.net/video/fe14b1aebe2a1016e59bba224c1bfb731423524.jpg', fromPageTitleEnc: '图片3' },
                { src: 'https://img.meituan.net/video/fe14b1aebe2a1016e59bba224c1bfb731423524.jpg', fromPageTitleEnc: '图片4' },
                { src: 'https://img.meituan.net/video/fe14b1aebe2a1016e59bba224c1bfb731423524.jpg', fromPageTitleEnc: '图片5' },
            ]
        }
    }
}
</script>

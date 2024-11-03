<template>
    <Waterfall :list="list" :breakpoints="{
        1200: { rowPerView: 4 },
        800: { rowPerView: 3 },
        500: { rowPerView: 2 }
    }" :loadProps="{ loading, error }">
        <template #item="{ item }">
            <el-card :body-style="{ padding: '0px' }">
                <LazyImg :url="item.src" />
                <div style="padding: 14px">
                    <span>{{ item.fromPageTitleEnc }}</span>
                </div>
            </el-card>
        </template>
    </Waterfall>
</template>

<script>
import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

export default {
    name: "MyWaterfall",
    props: ['list'],
    components: {
        Waterfall,
        LazyImg
    }
}
</script>

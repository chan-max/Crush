<template>
    <div class="docs-container">
        <el-row justify="center">
            <el-col :span="4">
                <el-scrollbar :always="false">
                    <div class="docslist">1</div>
                </el-scrollbar>
            </el-col>
            <el-col :span="10">
                <el-scrollbar :always="false">
                    <div class="docs">2</div>
                </el-scrollbar>
            </el-col>

            <el-col :span="4">
                <el-scrollbar :always="false">
                    <div class="hashlist">3</div>
                </el-scrollbar>
            </el-col>
        </el-row>
    </div>
</template>
<script lang="ts" setup>
import { onMounted } from '@vue/runtime-core'

onMounted(async () => {
    let res = await getArticleList()

    console.log(res)
})
</script>

<style lang="less">
.docs-container {
    height: 100%;

    .el-row {
        height: 100%;
    }

    .el-col {
        height: 100% !important;
        overflow: auto;
    }
}

.docslist {
    height: 2000px;
}

.docs {
    height: 2000px;
}

.hashlist {
    height: 2000px;
}
</style>

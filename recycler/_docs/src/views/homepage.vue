<template>
    <div class="header-block">
        <div class="news">
        </div>
        <el-row class="header">
            <el-col
                class="header-content"
                :xs="22"
                :sm="22"
                :md="22"
                :lg="18"
                :xl="18"
            >
                <div class="header-content">
                    <div class="logo-container">
                        <div class="logo"></div>.js
                    </div>
                    <div class="header-menu">
                        <el-menu
                            mode="horizontal"
                            :ellipsis="false"
                            :router="true"
                        >
                            <el-sub-menu index="0">
                                <template #title><div class="menu-item">{{ $t('menu.docs') }}</div></template>
                                <el-menu-item index="/docs#intro/install">install</el-menu-item>
                                <el-menu-item index="/docs">item two</el-menu-item>
                                <el-menu-item index="/docs">item three</el-menu-item>
                            </el-sub-menu>
                            <el-menu-item index="1">
                                <div class="menu-item">{{ $t('menu.api') }}</div>
                            </el-menu-item>
                            <el-menu-item index="3">                  
                                <div class="menu-item">{{ $t('menu.examples') }}</div>
                            </el-menu-item>
                            <el-menu-item index="4">                  
                                <div class="menu-item">{{ $t('menu.support') }}</div>
                            </el-menu-item>
                        </el-menu>
                        
                        <div id="github-link" class="menu-img" @click="go">
                        </div>
                    
                        <el-dropdown placement="bottom">
                            <div id="trans-language" class="menu-img">
                            </div>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="changeLanguage(language.chinese)">
                                        中文
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="changeLanguage(language.english)">
                                        English
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>
<script lang="ts" setup>
import 'element-plus/theme-chalk/display.css'
import {
    useLanguage,
} from '../common/language'

const {
    language,
    changeLanguage,
} = useLanguage()

function go() {
    window.open('https://github.com/chan-max/Crush')
}



</script>
<style lang="less">

.logo-container {
    display: flex;
    align-items: center;
    color: #666;
}

.header-block {
    position: fixed;
    width: 100%;
    height: 100%;

    .el-menu--horizontal > .el-menu-item.is-active,
    .el-menu--horizontal > .el-sub-menu.is-active .el-sub-menu__title {
        background: none;
        border-bottom: 1px solid #333;
    }

    .el-menu-item:not(.is-disabled):hover {
        color: red;
        background: none;
    }

    .el-icon svg {
        color: #333;
    }
}

.menu-item {
    margin: 0 !important;
}

.el-menu--popup {
    padding: 10px;
}

.el-menu--horizontal {
    .el-menu-item:not(.is-disabled):hover {
        background: none;
        color: #000;
    }
}

.el-menu--horizontal {
    border: none;
}

.el-menu--horizontal .el-menu .el-menu-item.is-active,
.el-menu--horizontal .el-menu .el-sub-menu.is-active > .el-sub-menu__title {
    color: #666;
}

.logo {
    height: 28px;
    width: 76px;
    background: url('../img/logo.png');
    background-size: 100% 100%;
}

.news {
    height: 20px;
    background-color: #555;
}

.logo-text {
    color: #333;
    // font-weight: bold;
}

.logo-text__info {
    color: blue;
}

.header {
    z-index: 9999999;
    height: 60px;
    display: flex;
    justify-content: center;
    background-color: #fff;
    box-sizing: border-box;
    //box-shadow: 0 4px 10px 0 rgb(0 0 0 / 30%);
    border-bottom: 1px solid rgba(60, 60, 60, .2);
}

.header-menu {
    display: flex;
    align-items: center;
}

.el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: transparent;
    color: #000;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.menu {
    padding: 0 30px;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
}

.menu-item {
    margin: 0 20px;
    font-size: 14px;
    font-weight: bold;
    color: #888;
    transition: all .5s;

    &:hover {
        color: #222;
        cursor: pointer;
    }
}

.content {
    height: calc(100% - 80px);
    z-index: 33;
}

.menu-img {
    margin-left: 20px;
    cursor: pointer;
    width: 20px;
    height: 20px;
    background-size: 100% 100%;
}

#github-link {
    background-image: url('../img/github.svg');
}

#trans-language {
    background-image: url('../img/language.svg');
}

</style>
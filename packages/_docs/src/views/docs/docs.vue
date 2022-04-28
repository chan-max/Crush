<template>
  <div class="docs-container">
    <!-- <div class="docs-banner">
    </div> -->
    <el-row justify="center">
      <el-col :span="4">
        <el-scrollbar :always="false">
          <div class="tree-menu">
            <div class="tree-menu-title"></div>
            <div class="tree-menu-content">
              <tree-menu :tree="tree"></tree-menu>
            </div>
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="10">
        <el-scrollbar :always="false" ref="mdscrollbar">
          <div class="md-docs" v-html="md"></div>
        </el-scrollbar>
      </el-col>
      <el-col :span="4" class="hidden-sm-and-down">
        <el-scrollbar :always="false">
          <div class="hashlist">
            <anchorMenu ref="anchorMenu"></anchorMenu>
          </div>
        </el-scrollbar>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts">
import treeMenu from "@/views/docs/components/treeMenu.vue";
import anchorMenu from "@/views/docs/components/anchorMenu.vue";
import { getEnDir, getZhDir, dirType, getMd } from "../../api/api";
import { parse } from "marked";
import { language } from "../../common/language";
import hljs from "highlight.js";
import "../../style/code.css";

import "../../style/md.css";

export default {
  components: {
    treeMenu,
    anchorMenu,
  },
  data() {
    return {
      mdContainer: null,
      md: "",
      tree: {
        type: "directroy",
        name: "",
      },
    };
  },
  watch: {
    "$i18n.locale"() {
      this.initPage();
    },
    $route() {
      this.initMd();
    },
  },
  async created() {
    this.initPage();
  },
  methods: {
    async initPage() {
      await this.initMenu();
      await this.initMd();
    },
    async initMenu() {
      if (this.$i18n.locale === language.chinese) {
        var tree: dirType = JSON.parse(await getZhDir());
        tree.name = "文档";
        (this as any).tree = tree;
      } else if (this.$i18n.locale === language.english) {
        var tree: dirType = JSON.parse(await getEnDir());
        tree.name = "docs";
        (this as any).tree = tree;
      }
      // 重写根文件夹名
    },
    async initMd() {
      var abstractSrc = "/" + this.$route.params.chapters.join("/");

      var src;
      function getUrlByHash(treeNode: dirType) {
        if (treeNode.abstractSrc === abstractSrc) {
          src = treeNode.src;
          return;
        }
        if (treeNode.children) {
          treeNode.children.forEach(getUrlByHash);
        }
      }
      getUrlByHash(this.tree);

      if (src) {
        var res = await getMd(src);
        this.md = parse(res.data, {
          highlight: function (code) {
            return hljs.highlightAuto(code).value;
          },
        });
        this.$nextTick(() => {
          this.$refs.anchorMenu.initAnchorMenu(
            document.querySelector(".md-docs")
          );
        });
      } else {
        this.md = "<h1>404  invalid path    </h1>";
      }
    },
  },
};
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

.tree-menu {
    position: relative;

    &-title {
        width: 100%;
        text-align: center;
        position: absolute;
        height: 50px;
        top: 0;
    }

    &-content {
        padding: 50px 0;
    }
}

.md-docs {
    padding: 0 20px;
}

.docs-banner {
    background: transparent;
    height: 10px;
}
</style>

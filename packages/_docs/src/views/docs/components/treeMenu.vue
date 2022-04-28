<template>
  <div style="margin-left: 5px;">
    <div v-if="tree.type === 'directroy'" class="tree-directroy">
      {{ tree.name }}
    </div>
    <a
      v-else-if="tree.type === 'file'"
      class="tree-file"
      :href="tree.abstractSrc"
      :class="{
        'tree-menu-focus':
          tree.abstractSrc === '/' + $route.params.chapters.join('/'),
      }"
    >
      {{ tree.name }}
    </a>
    <template v-if="tree.children">
      <tree-menu
        v-bind="$attrs"
        v-for="(treeNode, index) in tree.children"
        :tree="treeNode"
        :key="index"
      ></tree-menu>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "treeMenu",
  props: ["tree"],
});
</script>

<style lang="less">
.tree-directroy {
    margin: 15px 10px;
    font-size: 15px;
    font-weight: bold;
    color: #777;
    line-height: 25px;
}

.tree-file {
    margin: 5px 15px;
    cursor: pointer;
    line-height: 30px;
    font-size: 17px;
    transition: color .5s;
}

.tree-menu-focus {
    color: #00c1de;
}
</style>
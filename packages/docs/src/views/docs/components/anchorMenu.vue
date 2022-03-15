<template>
  <div class="anchor-menu">
    <a
      v-for="(title, index) in titles"
      :key="index"
      class="anchor-menu-item"
        :href="'#' + title.id"
      :class="{
        'anchor-menu-item__focus': false,
        [title.tagName]: true,
      }"
    >
      {{title.id}}
    </a>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      titles: [],
    };
  },
  methods: {
    initAnchorMenu(el) {
      var titles = el.querySelectorAll("h1,h2,h3,h4,h5,h6");
      this.titles = titles;
    },
  },
};
</script>
<style lang="less">
.anchor-menu {
    padding: 100px 30px 100px 30px;
    display: flex;
    flex-direction: column;
    align-content: center;
}

.anchor-menu-item {
    margin: 10px;
    padding-left: 10px;
    cursor: pointer;
}

.anchor-menu-item__focus {
    border-left: 3px solid #aaa;
    color: #333;
    font-weight: bold;
}

.H1 {
    font-size: 18px;
}

.H2 {
    font-size: 17px;
}

.H3 {
    font-size: 16px;
}

.H4 {
    font-size: 15px;
}

.H5 {
    font-size: 14px;
}

.H6 {
    font-size: 13px;
}

</style>
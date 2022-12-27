<template>
  <div class="top">
    <span class="page-name">
      <slot name="title"></slot>
    </span>
    <span>
      <slot name="button"></slot>
    </span>
  </div>
</template>

<script>
export default {
    name:'MainTop'
}
</script>
<script setup>

const clickHandle = () => { 
  //emit('button-click')
}
</script>

<style scoped>
.top {
  height: 80px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  margin-bottom:24px;
  justify-content: space-between;
}

.page-name {
  width: 240px;
  margin: 0 24px;
  display: inline-block;
  font-size: 24px;
  font-weight: bold;
  color: #999
}
</style>
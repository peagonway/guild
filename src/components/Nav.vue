<template>
  <div class="nav-wrap">
    <el-menu 
      default-active="phase" 
      :router="true" 
      active-text-color="#ffd04b" background-color="#545c64" text-color="#fff"
      @open="handleOpen" 
      @close="handleClose" 
    >
      <el-menu-item index="phase">
        <template #title>
          <el-icon>
            <CoffeeCup />
          </el-icon>
          <span>积分管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="userlist">
        <el-icon>
          <UserFilled />
        </el-icon>
        <span>人员管理</span>
      </el-menu-item>
    </el-menu>

  </div>
</template>
<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      //console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      //console.log(key, keyPath);
    }
  }
}
</script>

<style>
.nav-wrap {
  width: 240px;
  height: 100%;
  
}
</style>
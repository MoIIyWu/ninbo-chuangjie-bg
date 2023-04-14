<template>
  <el-card>
    <el-row type="flex" align="middle">
      <el-col v-if="isShowLeft" :span="12">
        <!-- <i class="el-icon-info"> -->
        <slot name="left" />
        <!-- </i> -->
      </el-col>
      <el-col :span="!isShowLeft ? 24 : 12">
        <el-row type="flex" justify="end">
          <slot name="right" />
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'PageTools',
  props: {
    isShowLeft: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>

</style>

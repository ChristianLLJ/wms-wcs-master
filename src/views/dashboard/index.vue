<template>
  <div>
    <div class="totalContain">
      <div class="dashboard-container">
        <!-- <panel-group /> -->
        <el-row>
          <el-col>
            <div class="totalTag">
              <p>出库操作快捷键</p>
              <in-ware-moveto />
            </div>
          </el-col>
          <!-- <el-col :span="4">
            <div class="totalTag">
              <p>出库业务快捷键</p>
              <out-ware-moveto />
            </div>
          </el-col>
          <el-col :span="4">
            <div class="totalTag">
              <p>库存管理快捷键</p>
              <in-library-moveto />
            </div>
          </el-col>
          <el-col :span="4">
            <div class="totalTag">
              <p>基础数据快捷键</p>
              <base-data-moveto />
            </div>
          </el-col>
          <el-col :span="4">
            <div class="totalTag">
              <p>预警管理快捷键</p>
              <warning-moveto />
            </div>
          </el-col>
          <el-col :span="4">
            <div class="totalTag">
              <p>权限管理快捷键</p>
              <authority-moveto />
            </div>
          </el-col> -->
        </el-row>
      </div>
    </div>
  </div>

</template>

<script>

// import PanelGroup from './components/PanelGroup'
import InWareMoveto from './components/InWareMoveto'
export default {
  name: 'DashboardAdmin',
  components: {
    // PanelGroup,
    InWareMoveto
  },
  data() {
    return {
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

.dashboard-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
}
// .totalContain {
//   overflow: auto;
// }
.comdataContain {
  width: 100%;
  position:absolute;
  bottom: 0;
}

</style>

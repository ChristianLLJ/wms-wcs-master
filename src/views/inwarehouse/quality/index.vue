<template>
  <div class="container">
    <el-dialog
      title="请扫描箱码后完成返库"
      :visible.sync="returnDialogVisible"
      width="30%"
      center
    >
      <e-desc>
        <e-desc-item label="箱号">
          <el-input ref="inputReturnBoxId" v-model="returnBalanceCode" placeholder="请扫描箱号" @keyup.enter.native="enterReturnBox" />
          <!-- <el-button icon="el-icon-add" type="primary" @click="check">确认</el-button> -->
        </e-desc-item>
      </e-desc>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="returnDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="请分配箱码"
      :visible.sync="returnVisible"
      width="30%"
      center
    >
      <e-desc>
        <e-desc-item label="箱号">
          <el-input ref="inputReturnBox" v-model="balanceCode" placeholder="请扫描箱号" @keyup.enter.native="finishBoxConfirm" />
        </e-desc-item>
      </e-desc>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="returnVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <div class="left" :style="{ width: leftWidth + 'px' }">
      <!-- 左侧区域内容 -->
      <!-- <div class="show_card1">
        <el-button-group>
          <el-tooltip class="item" effect="dark" content="返回首页" placement="bottom-start">
            <el-button type="warning" icon="el-icon-back" @click="goback">返回首页</el-button>
          </el-tooltip>
        </el-button-group>
      </div> -->
      <el-card class="show_card1" :body-style="{padding:'0px'}">
        <div slot="header" align="center">
          <span class="title">人工拣货-扫描信息</span>
        </div>
        <el-form ref="form" :inline="true" :model="formTitle.data">
          <el-card :body-style="{padding:'0px'}">
            <e-desc>
              <e-desc-item label="箱号" class="custom-height">
                <el-input ref="inputBoxId" :key="keyNow" v-model="formTitle.data.orderId" placeholder="请扫描箱号" @keyup.enter.native="enterBox" />
              </e-desc-item>
            </e-desc>
            <e-desc>
              <e-desc-item label="待分拣SKU号" class="custom-height">
                <el-input :key="keyNow" v-model="formTitle.data.waitSku" readonly placeholder="请先扫描箱号,本行自动显示" />
              </e-desc-item>
            </e-desc>
            <e-desc>
              <e-desc-item label="待分拣数量" class="custom-height">
                <el-input :key="keyNow" v-model="formTitle.data.waitNum" readonly placeholder="请先扫描箱号,本行自动显示" />
              </e-desc-item>
            </e-desc>
            <e-desc>
              <e-desc-item label="SKU号" class="custom-height">
                <el-input ref="inputSkuId" :key="keyNow" v-model="formTitle.data.skuCode" placeholder="请扫描SKU号" @keyup.enter.native="enterSku" />
              </e-desc-item>
            </e-desc>
            <e-desc>
              <e-desc-item label="拣货数量" width="40%" class="custom-height">
                <el-input ref="inputPickNum" :key="keyNow" v-model="formTitle.data.pickNum" width="40%" placeholder="请输入拣货数量" @keyup.enter.native="enterSkuNum" />
                <el-button type="primary" icon="el-icon-check" size="medium" @click="enterSkuNum()">确认拣货</el-button>
              </e-desc-item>
            </e-desc>
          </el-card>
        </el-form>
      </el-card>
      <el-card class="show_card1" :body-style="{padding:'0px'}" shadow="always">
        <div slot="header" align="center">
          <span class="title">待结箱商品信息</span><span style="padding-left: 20px" />
          <el-button icon="el-icon-s-order" type="primary" @click="finishBox">结箱</el-button>
          <el-button type="primary" @click="returnWarehouse()">扫描箱码返库</el-button>
        </div>
        <el-form ref="formData" :model="formData" :rules="formData.rules">
          <el-table
            ref="tabledatas"
            :data="formData.tabledatas"
            size="mini"
            border
            :height="tableHeight"
            :row-class-name="tableRowClassDetailName"
            :header-cell-style="{background:'#091f2c',color: '#fff'}"
            :row-style="{height:'10px'}"
            :cell-style="{padding:'0px'}"
          >
            <el-table-column type="index" label="序号" />
            <el-table-column label="sku名称" prop="skuName" />
            <el-table-column label="sku代码" prop="skuCode" />
            <el-table-column label="尺寸" prop="goodsSize" />
            <el-table-column label="颜色" prop="goodsColor" />
            <el-table-column label="拣货数量" prop="skuCnt" />
          </el-table>
        </el-form>
      </el-card>
    </div>
    <div class="separator" @mousedown="onSeparatorMouseDown" />
    <div class="right">
      <!-- 右侧区域内容 -->
      <div id="btnAndSearch">
        <el-card style="border-radius: 20px; margin-top: 0px;" shadow="always">
          <el-form :inline="true" :model="formSearch">
            <el-form-item label="仓库">
              <el-select v-model="formSearch.warehouseCode" placeholder="请选择仓库" clearable filterable style="width: 120px;">
                <el-option v-for="item in optionsWarehouse" :key="item.id" :label="item.warehouseName" :value="item.warehouseCode" />
              </el-select>
            </el-form-item>
            <el-form-item label="货主">
              <el-select v-model="formSearch.customerId" placeholder="请选择货主" clearable filterable style="width: 120px;">
                <el-option v-for="item in optionsCustom" :key="item.id" :label="item.customName" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="要求交货">
              <el-date-picker
                v-model="formSearch.time1"
                style="width: 200px;"
                type="daterange"
                unlink-panels
                value-format="yyyy-MM-dd HH:mm:ss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item label="收货地址">
              <el-select v-model="formSearch.province" style="width: 120px;" filterable clearable placeholder="请选择省份" @change="selectProvinceFun($event)">
                <el-option v-for="(item, index) in city" :key="index" :value="item" :label="item.label" />
              </el-select>
              <el-select v-model="formSearch.city" style="width: 120px;" filterable clearable placeholder="请选择城市" @change="selectCityFun($event)">
                <el-option v-for="(item, index) in cityList" :key="index" :value="item" :label="item.label" />
              </el-select>
              <el-select v-model="formSearch.site" style="width: 120px;" filterable clearable placeholder="请选择区县" @change="selectSiteFun($event)">
                <el-option v-for="(item, index) in siteList" :key="index" :value="item" :label="item.label" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button-group>
                <el-button type="success" icon="el-icon-search" size="medium" @click="searchAll()">查询</el-button>
                <el-button v-show="isSearchAll" type="primary" icon="el-icon-s-order" size="medium" @click="sortAll()">全部分拣</el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <el-card :body-style="{padding:'0px'}" shadow="always">
        <el-table
          ref="multipleTable"
          :header-cell-class-name="handleHeadAddClass"
          height="280px"
          :data="tableData"
          :row-key="getRowKeys"
          :row-class-name="tableRowClassName"
          :row-style="{height:'20px'}"
          :cell-style="{padding:'0px'}"
          size="mini"
          style="width: 100%, font-size: 10px"
          element-loading-text="正在加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          border
          :header-cell-style="{background:'#000',color: '#fff'}"
          tooltip-effect="dark"
          @sort-change="handleSortChange"
          @expand-change="expandChange"
        >
          <el-table-column type="expand" align="center">
            <template>
              <el-table
                element-loading-text="正在加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :data="tabledatas"
                :row-class-name="tableRowClassDetailName"
                border
                :header-cell-style="{background:'#000',color: '#fff'}"
                size="mini"
                :row-style="{height:'20px'}"
                :cell-style="{padding:'0px'}"
                style="width: 100%, font-size: 5px"
              >
                <el-table-column type="index" label="序号" align="center" />
                <el-table-column label="sku代码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
                <el-table-column label="库位名称" align="center" :show-overflow-tooltip="true" prop="locationName" />
                <el-table-column label="拣货数量" align="center" :show-overflow-tooltip="true" prop="pieceCnt" />
                <el-table-column label="单位" align="center" :show-overflow-tooltip="true" prop="unit" />
                <!-- <el-table-column label="备注" align="center" :show-overflow-tooltip="true" prop="remark" /> -->
              </el-table>
            </template>
          </el-table-column>
          <el-table-column :label="labelTitle" align="center">
            <el-table-column
              type="index"
              label="序号"
              width="35"
              align="center"
            />
            <el-table-column label="订单号" width="115px" align="center" :show-overflow-tooltip="true" prop="despatchId" />
            <el-table-column label="仓库名称" align="center" :show-overflow-tooltip="true" prop="warehouseName" />
            <el-table-column label="货主名称" align="center" :show-overflow-tooltip="true" prop="customerName" />
            <el-table-column label="收货人" align="center" :show-overflow-tooltip="true" prop="receiverName" />
            <el-table-column label="收货地/省" width="60px" align="center" :show-overflow-tooltip="true" prop="province" />
            <el-table-column label="市" width="60px" :show-overflow-tooltip="true" prop="city" />
            <el-table-column label="县" width="60px" :show-overflow-tooltip="true" prop="site" />
            <el-table-column label="详细地址" align="center" :show-overflow-tooltip="true" prop="address" />
            <el-table-column width="75px" label="要求交货时间" align="center" :show-overflow-tooltip="true" prop="requestDeliveryTime">
              <template slot-scope="scope">{{ scope.row.requestDeliveryTime| dateYMDHMSFormat2 }}</template>
            </el-table-column>
            <el-table-column width="75px" label="预期发货时间" align="center" :show-overflow-tooltip="true" prop="expectSendTime">
              <template slot-scope="scope">{{ scope.row.expectSendTime| dateYMDHMSFormat2 }}</template>
            </el-table-column>
          </el-table-column>
          <el-table-column
            width="160px"
            prop="action"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button size="mini" icon="el-icon-search" type="primary" @click="sortThis(scope.row)">开始分拣</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-row>
        <el-col :span="12">
          <el-table
            ref="multipleTable"
            :header-cell-class-name="handleHeadAddClass"
            :height="tableHeightRight"
            :data="tabledataWait"
            :row-key="getRowKeys"
            :row-class-name="tableRowClassName"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            size="mini"
            style="width: 100%, font-size: 10px"
            element-loading-text="正在加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            border
            :header-cell-style="{background:'#000',color: '#fff'}"
            tooltip-effect="dark"
          >
            <el-table-column label="待拣货商品信息" align="center">
              <el-table-column
                type="index"
                label="序号"
                width="35"
                align="center"
              />
              <el-table-column label="sku代码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
              <el-table-column label="订单数量" width="60px" align="center" :show-overflow-tooltip="true" prop="orderCnt" />
              <el-table-column label="待拣货数量" align="center" :show-overflow-tooltip="true" prop="pieceCnt" />
              <el-table-column label="单位" width="60px" align="center" :show-overflow-tooltip="true" prop="skuCode" />
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <el-table
            ref="multipleTable"
            :header-cell-class-name="handleHeadAddClass"
            :height="tableHeightRight"
            :data="tabledataFinish"
            :row-key="getRowKeys"
            :row-class-name="tableRowClassName"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            size="mini"
            style="width: 100%, font-size: 10px"
            element-loading-text="正在加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            border
            :header-cell-style="{background:'#000',color: '#fff'}"
            tooltip-effect="dark"
          >
            <el-table-column label="已拣货商品信息" align="center">
              <el-table-column
                type="index"
                label="序号"
                width="35"
                align="center"
              />
              <el-table-column label="sku代码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
              <el-table-column label="订单数量" width="60px" align="center" :show-overflow-tooltip="true" prop="orderCnt" />
              <el-table-column label="已拣货数量" align="center" :show-overflow-tooltip="true" prop="pieceCnt" />
              <el-table-column label="单位" width="60px" align="center" :show-overflow-tooltip="true" prop="skuCode" />
            </el-table-column>
          </el-table>
        </el-col>
      </el-row></div>
  </div>
</template>
<script>
import audiosuccessurl from '@/assets/success.mp3'
import audiowrongurl from '@/assets/wrong.mp3'
import city from '@/assets/city.json'
import EDesc from '@/components/Edesc'
import EDescItem from '@/components/Edescitem'
import { searchByBalanceCodeDevice, returnToWarehouse, boxOut, findDesToPick, findDesBeenPicked, getExpickingAndDetail, screenGoodsSku, endSelect, searchByBalanceCode, selectWarehouse, findDesInPicking, screenCustom, findDetailInPickingByDesId, runManualPickingList } from '@/api/user'
import { searchreceiver } from '@/utils/search'
import elementResizeDetectorMaker from 'element-resize-detector'
var erd = elementResizeDetectorMaker()
// import { getNowTime } from '@/utils/getTime'
// import { throttle } from '@/utils/throttle'

export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: {
    EDesc, EDescItem
  },
  data() {
    return {
      returnBalanceCode: null,
      returnDialogVisible: false,
      returnVisible: false,
      balanceCode: null,
      tabledataWait: [],
      tabledataFinish: [],
      numNow: 0,
      keyNow: 0,
      skuNow: {
        skuName: null,
        skuCode: null,
        skuSize: null,
        skuColor: null },
      boxNow: null,
      isSearchAll: false,
      getRowKeys(row) {
        return row.id
      },
      sortField: {},
      screen: null,
      screenNull: '',
      searchStartTime: null,
      searchEndTime: null,
      searchPerson: null,
      optionsWarehouse: [],
      labelTitle: '待拣货订单信息',
      leftWidth: 400, // 左侧元素的初始宽度
      separatorWidth: 10, // 分隔条的宽度
      isDragging: false, // 是否正在拖拽
      startX: 0, // 鼠标按下时的位置
      startWidth: 0, // 鼠标按下时左侧元素的宽度
      audiosuccess: null,
      audiowrong: null,
      formSearch: {
        orderState: [],
        customerId: null,
        province: null,
        city: null,
        site: null,
        time0: [],
        time1: []
      },
      showLeft: true,
      showRight: true,
      spanLeft: 16,
      spanRight: 8,
      textarea2: '操作说明: \n1.扫描箱号或输入箱号后点击确认按钮,系统自动显示待分拣SKU和待分拣数量 \n2.扫描SKU号或输入后点击确认按钮 \n3.输入拣货数量后,点击"确认拣货"按钮 \n4.点击"装箱"按钮,将已拣货SKU装箱',
      goodsAmount: null,
      checkSubmitTitle: true, // 验证提交时的表头数据
      optionsCustom: [],
      optionsReceiver: [],
      selectProvince: {},
      selectCity: {},
      selectArea: {},
      city: city,
      cityList: [],
      siteList: [],
      lastTime: 0,
      lastfunTime: 0,
      lastsupTime: 0,
      supplierOptions: [],
      tableData: [],
      tabledatas: [],
      formData: {
        tabledatas: []
      },
      total: 100,
      lastcomTime: 0,
      lasttypeTime: 0,
      addPersonName: null,
      weight: 0,
      volume: 0,
      skuPrice: 0,
      lastconTime: 0,
      lastunitTime: 0,
      disabled: true,
      warehouseOptions: [],
      list: [],
      states: [],
      cstates: [],
      clilist: [],
      sstates: [],
      suplist: [],
      comlist: [],
      skuOptions: [],
      skuOptionsNow: [],
      clientOptions: [],
      containerOptions: [],
      unitOptions: [],
      typeOptions: [],
      commodityOptions: [],
      lastSkuTime: 0,
      tableHeight: 240,
      tableHeightRight: 200,
      formTitle: {
        data: {
          id: null,
          orderId: null,
          waitNum: null,
          waitSku: null,
          skuCode: null,
          pickNum: null
        }
      },
      pickerOptions: {
        shortcuts: [{
          text: '明天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '后天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 2)
            picker.$emit('pick', date)
          }
        }, {
          text: '三天后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 3)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '两周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 14)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  created() {
    this.getList()
    screenCustom({
      'searchDTO': {
        'page': 1,
        'num': 100000
      },
      'pojo': {
      }
    }).then(res => {
      this.optionsCustom = res.data
    }
    )
    searchreceiver().then(res => {
      this.optionsReceiver = res.data
    }
    )
    selectWarehouse({
      'searchDTO': {
        'page': 1,
        'num': 100000
      },
      'pojo': {
      }
    }).then(res => {
      this.optionsWarehouse = res.data
    })
  },
  mounted: function() {
    erd.listenTo(document.getElementById('btnAndSearch'), (element) => {
      var height = element.offsetHeight
      this.tableHeightRight = window.innerHeight - height - 332
      this.tableHeight = window.innerHeight - 435
    })
    this.$nextTick(() => {
      this.$refs.inputBoxId.focus()
    })
    this.audiosuccess = new Audio()
    this.audiosuccess.src = audiosuccessurl
    this.audiowrong = new Audio()
    this.audiowrong.src = audiowrongurl
  },
  methods: {
    returnWarehouse() {
      this.returnDialogVisible = true
      this.returnBalanceCode = null
      this.$nextTick(() => {
        this.$refs.inputReturnBoxId.focus()
      })
    },
    enterReturnBox() {
      returnToWarehouse({ balanceCode: this.returnBalanceCode }).then(res => {
        if (res.code === 200) {
          this.$message.success('返库成功')
          this.audiosuccess.play()
          this.returnDialogVisible = false
          this.returnBalanceCode = null
        } else {
          this.$message.error(res.msg)
          this.audiowrong.play()
        }
      })
    },
    getboth() {
      findDesBeenPicked({ id: this.boxNow.despatchId }).then(response => {
        if (response.code === 200) {
          this.tabledataFinish = response.data
        }
      })
      findDesToPick({ id: this.boxNow.despatchId }).then(response => {
        if (response.code === 200) {
          this.tabledataWait = response.data
        }
      })
    },
    finishBox() {
      if (this.formData.tabledatas.length === 0) {
        this.$message.warning('请不要瞎点！！！')
      } else {
        this.returnVisible = true
        this.$nextTick(() => {
          this.$refs.inputReturnBox.focus()
        })
      }
    },
    finishBoxConfirm() {
      if (this.balanceCode) {
        boxOut({ balanceCode: this.balanceCode }).then(response => {
          if (response.code === 200) {
            this.$message.success('箱码分配成功！')
            this.balanceCode = null
          } else {
            this.$message.error('箱码分配成功')
          }
        })
        getExpickingAndDetail([{
          head: {
            exPickingId: this.boxNow.exPickingId,
            customerId: this.boxNow.customerId,
            customerName: this.boxNow.customerName,
            receiverId: this.boxNow.receiverId,
            warehouseCode: this.boxNow.warehouseCode,
            despatchId: this.boxNow.despatchId
          },
          details:
          this.formData.tabledatas
        }]).then(response => {
          if (response.code === 200) {
            this.$message.success('结箱成功！')
            this.formData.tabledatas = []
            this.returnVisible = false
          } else {
            this.$message.error('操作失败')
          }
        })
      } else {
        this.$message.warning('请分配箱码!!!')
      }
    },
    sortThis(row) {
      runManualPickingList({
        pojo: {
          despatchId: row.despatchId
        }
      }).then(response => {
        if (response.code === 200) {
          this.$message.success('操作成功，请在左侧扫描箱号')
        } else {
          this.$message.error('操作失败')
        }
      })
      this.$nextTick(() => {
        this.$refs.inputBoxId.focus()
      })
    },
    sortAll() {
      runManualPickingList({
        pojo: {
          province: this.formSearch.province,
          city: this.formSearch.city,
          site: this.formSearch.site,
          status: 3,
          warehouse: this.formSearch.warehouseCode,
          verifyStatus: 2
        },
        persons: this.searchPerson,
        screen: this.screen,
        startTime: this.searchStartTime,
        endTime: this.searchEndTime
      }).then(response => {
        if (response.code === 200) {
          this.$message.success('操作成功，请在左侧扫描箱号')
        } else {
          this.$message.error('操作失败')
        }
      })
      this.$nextTick(() => {
        this.$refs.inputBoxId.focus()
      })
    },
    searchAll() {
      this.getList()
      this.isSearchAll = true
      this.$nextTick(() => {
        this.$refs.inputBoxId.focus()
      })
    },
    expandChange(row) {
      findDetailInPickingByDesId({
        id: row.id
      }).then(response => {
        this.tabledatas = response.data
      })
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'd-row'
      } else {
        return 'o-row'
      }
    },
    tableRowClassDetailName({ rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'dd-row'
      } else {
        return 'do-row'
      }
    },
    handleHeadAddClass({ column }) {
      if (this.sortField[column.property]) {
        column.order = this.sortField[column.property]
      }
    },
    handleSortChange({ order, prop }) {
      // 触发的排序和缓存的排序相同时，取消该字段的排序
      this.screen = ''
      // this.screenNull = ''
      if (!order || this.sortField[prop] === order) {
        this.sortField[prop] = null
      } else {
        this.sortField[prop] = order
      }
      let direction = ''
      for (const i in this.sortField) {
        if (this.sortField[i] === 'ascending') {
          direction = 'asc'
        } else if (this.sortField[i] === 'descending') {
          direction = 'desc'
        } else {
          direction = 'null'
        }
        if (direction === 'null') {
          continue
        } else if (this.screen === '') {
          this.screen += i + ' ' + direction
        } else {
          this.screen = i + ' ' + direction + ',' + this.screen
        }
      }
      // this.screen = this.screenNull
      this.getList() // 调用后端查询接口
    },
    onSeparatorMouseDown(event) {
      event.preventDefault()
      this.isDragging = true
      this.startX = event.clientX
      this.startWidth = this.leftWidth
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    },
    onMouseMove(event) {
      if (!this.isDragging) return
      const delta = event.clientX - this.startX
      this.leftWidth = Math.max(0, this.startWidth + delta)
    },
    onMouseUp() {
      this.isDragging = false
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    },
    letDown() {
      screenGoodsSku({
        searchDTO: {
          page: 1,
          num: 100000
        },
        pojo: {
          skuCode: this.formTitle.data.skuCode
        }
      }).then(response => {
        this.skuNow = response.data[0]
        console.log(response.data[0])
      })
      console.log(this.skuNow)
    },
    letUp() {
      this.$set(this.formTitle.data, 'orderId', null)
      this.$set(this.formTitle.data, 'skuCode', null)
      this.$set(this.formTitle.data, 'pickNum', null)
      this.$set(this.formTitle.data, 'waitNum', null)
      this.$set(this.formTitle.data, 'waitSku', null)
      this.$forceUpdate()
      this.formTitle.data = Object.assign({}, this.formTitle.data)
    },
    enterSkuNum() {
      this.numNow = this.formTitle.data.pickNum
      endSelect({
        id: this.boxNow.id,
        skuCode: this.formTitle.data.skuCode,
        pieceCnt: this.formTitle.data.pickNum
      }).then(response => {
        if (response.code === 200) {
          this.$message.success('操作成功，请扫描下一箱号')
          this.audiosuccess.play()
          this.$nextTick(() => {
            this.$refs.inputBoxId.focus()
          })
          this.letDown()
          this.letUp()
          this.getboth()
          setTimeout(() => {
            const nowList = {
              skuName: this.skuNow.skuName,
              skuCode: this.skuNow.skuCode,
              goodsSize: this.skuNow.skuSize,
              goodsColor: this.skuNow.skuColor,
              skuCnt: this.numNow
            }
            this.formData.tabledatas.push(nowList)
          }, 1000)
          console.log(this.formData.tabledatas)
          console.log(this.formTitle.data)
        } else {
          this.$message.error(response.msg)
          this.audiowrong.play()
        }
      })
    },
    enterSku() {
      if (this.formTitle.data.skuCode === this.formTitle.data.waitSku) {
        this.$message.success('操作成功，请输入数量后按回车键')
        this.audiosuccess.play()
        this.$nextTick(() => {
          this.$refs.inputPickNum.focus()
        })
      } else {
        this.$message.error('SKU错误！请重新扫描！')
        this.audiowrong.play()
        this.formTitle.data.skuCode = null
      }
    },
    enterBox() {
      searchByBalanceCode({
        inventoryBalanceCode: this.formTitle.data.orderId
      }).then(response => {
        if (response.code === 200) {
          this.$message.success('操作成功，请扫描SKU号')
          this.formTitle.data.waitNum = response.data.pieceCnt
          this.formTitle.data.waitSku = response.data.skuCode
          this.boxNow = response.data
          this.audiosuccess.play()
          this.$nextTick(() => {
            this.$refs.inputSkuId.focus()
          })
          this.getboth()
        } else {
          this.$message.error('箱号错误！请重新扫描！')
          this.audiowrong.play()
          this.formTitle.data.orderId = null
        }
      })
    },
    selectCustomer(event) {
      const item = this.optionsCustom.find(item1 => item1.id === event)
      this.formTitle.data.customerName = item.customName
      this.formTitle.data.customerCode = item.customCode
    },
    selectReciever(event) {
      const item = this.optionsReceiver.find(item1 => item1.id === event)
      this.formTitle.data.receiverName = item.customName
      this.formTitle.data.receiverId = item.id
      this.formTitle.data.phone = item.phone
      this.formTitle.data.address = item.address
      this.formTitle.data.province = item.province
      this.formTitle.data.city = item.city
      this.formTitle.data.site = item.site
    },
    selectProvinceFun(event) {
      if (event) {
        this.formSearch.province = event.label
        this.cityList = event.children
      } else {
        this.cityList = []
      }
      this.siteList = []
      this.formSearch.city = null
      this.formSearch.site = null
    },
    selectCityFun(event) {
      if (event) {
        this.formSearch.city = event.label
        this.siteList = event.children
      } else {
        this.siteList = []
        this.formSearch.site = null
      }
    },
    selectSiteFun(event) {
      if (event) {
        this.formSearch.site = event.label
      }
    },
    goback() {
      this.$router.push('dashboard')
    },
    refresh() {
      this.$confirm('此操作将清空所有已填写信息，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.reload()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: ''
        })
      })
    },
    getList() {
      if (this.formSearch.time1) {
        this.searchStartTime = this.formSearch.time1[0]
        this.searchEndTime = this.formSearch.time1[1]
      } else {
        this.searchStartTime = null
        this.searchEndTime = null
      }
      if (this.formSearch.customerId) {
        this.searchPerson = [this.formSearch.customerId]
      } else {
        this.searchPerson = []
      }
      findDesInPicking({
        pojo: {
          province: this.formSearch.province,
          city: this.formSearch.city,
          site: this.formSearch.site,
          status: '1',
          warehouse: this.formSearch.warehouseCode,
          verifyStatus: 2
        },
        persons: this.searchPerson,
        screen: this.screen,
        startTime: this.searchStartTime,
        endTime: this.searchEndTime
      }).then(response => {
        this.tableData = response.data
      })
      setTimeout(() => {
        this.listLoading = false
      }, 0.5 * 1000)
    }
    // 单个删除
  }
}
</script>
<style>
.el-dialog__title {
    line-height: 24px;
    font-size: 20px;
    color: #000;
    font-weight: 600;
}
.el-table .d-row{
  background: rgb(194, 45, 45);
}
.el-table .o-row{
  background: #bbca4a;
}
.el-table .dd-row{
  background: rgb(97, 165, 186);
}
.el-table .do-row{
  background: #6f6dda;
}
.container {
  display: flex;
  height: 100%;
}
.right2 {
  display: flex;
  height: 100%;
  overflow: auto;
}
.left {
  flex: 0 0 auto;
  background-color: #eee;
  overflow: auto;
}

.separator {
  flex: 0 0 10px;
  background-color: #ddd;
  cursor: ew-resize;
}

.right {
  flex: 1;
  background-color: #f0f0f0;
  overflow: auto;
}
.custom-height {
  height: 50px; /* 设置元素的高度 */
  align-items: center; /* 控制子元素的垂直对齐方式 */
  justify-content: center; /* 控制子元素的水平对齐方式 */
}

  .el-table .db-row{
  background: #262626;
}
.datagrid-htable, .datagrid-btable, .datagrid-ftable {
    color: #ffffff;
}
.el-form /deep/.el-form-item__label{
      color:rgb(0, 0, 0);
    font-weight: bold;
    }
</style>

<style scoped>
  .search {
      margin: 1px;
      padding-top: 10px;
      background-color: rgb(255, 255, 255);
    }
    .el-form /deep/.el-form-item__label{
      color:rgb(0, 0, 0);
    font-weight: bold;
    }
.el-card /deep/ .el-card__header {
  color:#fff;
  }
  </style>
  <style lang="scss" scoped>
// 修改对话框高度
    .show_card1 {
      background-color:#081b26c3;
    }
</style>


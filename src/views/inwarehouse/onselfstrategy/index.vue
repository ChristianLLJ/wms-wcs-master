<template>
  <div>
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
    <div id="btnAndSearch" class="show_card1">
      <el-button-group>
        <el-tooltip class="item" effect="dark" content="返回首页" placement="bottom-start">
          <el-button type="warning" icon="el-icon-back" @click="goback">返回首页</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="返回首页" placement="bottom-start">
          <el-button type="primary" @click="returnWarehouse()">扫描箱码返库</el-button>
        </el-tooltip>
      </el-button-group>
    </div>
    <el-card class="show_card1" :body-style="{padding:'0px'}">
      <div style="margin: 20px 0;" />
      <el-input
        v-model="textarea2"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 5}"
        placeholder="请输入内容"
      />
    </el-card>
    <el-card class="show_card1" :body-style="{padding:'0px'}">
      <div style="margin: 20px 0;" />
    </el-card>
    <el-card class="show_card1" :body-style="{padding:'0px'}">
      <div slot="header" align="center">
        <span class="title">人工上分拣机-扫描信息</span>
      </div>
      <el-form ref="form" :inline="true" :model="formTitle">
        <el-card :body-style="{padding:'0px'}">
          <e-desc>
            <e-desc-item label="箱号">
              <el-input ref="inputBoxId" v-model="formTitle.inventoryBalanceCode" placeholder="请扫描箱号" @keyup.enter.native="enterBox" />
              <!-- <el-button icon="el-icon-add" type="primary" @click="check">确认</el-button> -->
            </e-desc-item>
          </e-desc>
          <e-desc>
            <e-desc-item label="SKU号">
              <el-input ref="inputSkuId" v-model="formTitle.skuCode" placeholder="请扫描SKU号" @keyup.enter.native="enterSku" />
              <!-- <el-button icon="el-icon-add" type="primary" @click="check">添加</el-button> -->
            </e-desc-item>
          </e-desc>
          <e-desc>
            <e-desc-item label="待上机SKU号">
              <el-input v-model="formTitle.skuCodeNext" placeholder="请先扫描箱号,本行自动显示" :readonly="true" />
            </e-desc-item>
          </e-desc>
          <e-desc>
            <e-desc-item label="待上机数量">
              <el-input v-model="formTitle.pickNum" placeholder="请先扫描箱号,本行自动显示" :readonly="true" />
            </e-desc-item>
          </e-desc>
        </el-card>
      </el-form>
    </el-card>
    <el-card class="show_card1" :body-style="{padding:'0px'}">
      <el-table
        ref="multipleTable"
        :height="tableHeightRight"
        :data="tableData"
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
          <el-table-column label="箱号" align="center" :show-overflow-tooltip="true" prop="inventoryBalanceCode" />
          <el-table-column label="SKU代码" align="center" :show-overflow-tooltip="true" prop="skuCode" />
          <el-table-column label="已拣货数量" align="center" :show-overflow-tooltip="true" prop="pieceNum" />
          <el-table-column label="单位" align="center" :show-overflow-tooltip="true" prop="unit" />
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import audiosuccessurl from '@/assets/success.mp3'
import audiowrongurl from '@/assets/wrong.mp3'
import city from '@/assets/city.json'
import EDesc from '@/components/Edesc'
import EDescItem from '@/components/Edescitem'
import { returnToWarehouse, searchByBalanceCodeDevice, pieceSelect } from '@/api/user'
import { searchsku } from '@/utils/search'
import elementResizeDetectorMaker from 'element-resize-detector'
var erd = elementResizeDetectorMaker()
export default {
  inject: ['reload'], // 注入页面刷新依赖
  components: {
    EDesc, EDescItem
  },
  data() {
    return {
      returnBalanceCode: null,
      returnDialogVisible: false,
      tableData: [],
      boxId: null,
      textarea2: '操作说明: \n1.扫描箱号或输入箱号按回车键,系统自动显示待上机SKU和待上机数量 \n2.扫描SKU号或输入后按回车键 \n3.将货物放在传送带上，传输至分拣机',
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
      tableHeight: 515,
      tableHeightRight: 515,
      formTitle: {
        inventoryBalanceCode: null,
        pickNum: null,
        skuCode: null,
        skuCodeNext: null
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
  mounted: function() {
    erd.listenTo(document.getElementById('btnAndSearch'), (element) => {
      var height = element.offsetHeight
      this.tableHeightRight = window.innerHeight - height - 440
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
    addItem(item1, items) {
      // 查找物品是否存在
      const index = items.findIndex(item => item.inventoryBalanceCode === item1.inventoryBalanceCode)
      if (index >= 0) {
        // 如果存在，增加数量
        items[index].pieceNum += 1
      } else {
        // 如果不存在，添加物品
        items.push({ inventoryBalanceCode: item1.inventoryBalanceCode, skuCode: item1.skuCode, pieceNum: 1, unit: item1.unit })
      }
    },
    enterSku() {
      if (this.formTitle.inventoryBalanceCode) {
        pieceSelect({ id: this.boxId, skuCode: this.formTitle.skuCode }).then(res => {
          if (res.code === 200) {
            this.$message.success('扫描成功')
            this.formTitle.pickNum = res.data.pieceCnt - res.data.devicePickNum
            this.formTitle.skuCode = null
            this.addItem(res.data, this.tableData)
            this.audiosuccess.play()
          } else if (res.code === 61034) {
            this.$message.error(res.msg)
            this.formTitle.inventoryBalanceCode = null
            this.formTitle.skuCode = null
            this.formTitle.skuCodeNext = null
            this.formTitle.pickNum = null
            this.addItem(res.data, this.tableData)
            this.$nextTick(() => {
              this.$refs.inputBoxId.focus()
            })
            this.audiosuccess.play()
          } else {
            this.$message.error(res.msg)
            this.audiowrong.play()
            this.formTitle.skuCode = null
          }
        })
        this.$nextTick(() => {
          this.$refs.inputPickNum.focus()
        })
      } else {
        this.$message.error('请先扫描箱号')
      }
    },
    enterBox() {
      searchByBalanceCodeDevice({ inventoryBalanceCode: this.formTitle.inventoryBalanceCode }).then(res => {
        if (res.code === 200) {
          this.$message.success('扫描成功')
          this.formTitle.skuCodeNext = res.data.skuCode
          this.formTitle.pickNum = res.data.pieceCnt - res.data.devicePickNum
          this.boxId = res.data.id
          this.audiosuccess.play()
          this.$nextTick(() => {
            this.$refs.inputSkuId.focus()
          })
        } else {
          this.$message.error(res.msg)
          this.formTitle.inventoryBalanceCode = null
          this.audiowrong.play()
        }
      })
    },
    changedinput(even) {
      var reg = new RegExp(even.filterValue)
      this.skuOptionsNow = []
      for (var i = 0; i < this.skuOptions.length; i++) {
        if (reg.test(this.skuOptions[i].skuName)) {
          this.skuOptionsNow.push(this.skuOptions[i])
        }
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
    formatSkuText(skuName) {
      return skuName
    },
    formatConText(name) {
      return name
    },
    renderHeader(h, { column }) { // 悬浮提示的文字内容
      const info = '输入商品关键字即可'
      return h(
        'div', [h('span', column.label), // placement指定悬浮显示方向
          h('el-tooltip', { props: { placement: 'bottom', effect: 'light' }}, [
            // style 调文字颜色样式
            h('div', { slot: 'content', style: { whiteSpace: 'normal', color: 'blue' }}, info),
            // el-icon-warning是element图标, style 调图标颜色
            h('i', { class: 'el-icon-warning', style: 'color: #409EFF; margin-left: 5px;' })
          ])])
    },
    getList() {
    },
    exampleSku(row) {
      const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
      console.log(row)
      console.log(item)
      row.skuId = item.id
      row.skuPrice = item.money
      row.skuName = item.skuName
      row.skuColor = item.skuColor
      row.skuBarcode = item.skuBarcode
      row.skuSize = item.skuSize
      row.skuCode = item.skuCode
      this.weight = item.weight
      this.volume = item.volume
      this.skuPrice = item.money
      if (row.orderCnt) {
        // row.totalWeight = Number(this.weight) * Number(row.orderCnt)
        // row.totalVolumn = Number(this.volume) * Number(row.orderCnt)
        row.totalMoney = Number(this.skuPrice) * Number(row.orderCnt)
      }
    },
    changeSum(row) {
      if (row.skuName && !this.skuOptions) {
        row.totalMoney = Number(this.skuPrice) * Number(row.orderCnt)
      } else if (this.skuOptions) {
        searchsku(row.commodityId).then(res => {
          this.skuOptions = res.data
          const item = this.skuOptions.find(item1 => item1.skuName === row.skuName)
          this.skuPrice = item.money
          row.totalMoney = Number(this.skuPrice) * Number(row.orderCnt)
        }
        )
      }
    },
    // 单个删除
    tableRowClassDetailName({ rowIndex }) {
      // if (rowIndex % 2 === 1) {
      //   return 'dd-row'
      // } else {
      return 'db-row'
      // }
    },
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        // 第一个显示为合计
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map((item) => item[column.property])
        // 对表格数据进行循环
        values.map((item) => {
          // 判断返回的是否为number数据类型
          if (typeof item === 'number' && item !== Infinity && !isNaN(item)) {
            // 判断是否为时间戳
            if (item > 1600000000000) {
              // 若为时间戳则置为--
              sums[index] = '--'
              return
            } else {
              // 对number数据进行累加
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  // 解决js计算小数出现小数点后多位数字的问题
                  return Math.floor((prev + curr) * 100) / 100
                } else {
                  return prev
                }
              }, 0)
            }
          } else {
            // 不为number类型则置为--
            sums[index] = '--'
            return
          }
        })
      })
      return sums
    }
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
.custom-height {
  height: 80px; /* 设置元素的高度 */
  align-items: center; /* 控制子元素的垂直对齐方式 */
  justify-content: center; /* 控制子元素的水平对齐方式 */
}

  .el-table .db-row{
  background: #262626;
}
.datagrid-htable, .datagrid-btable, .datagrid-ftable {
    color: #ffffff;
}
</style>
 <style scoped>
  .el-card /deep/ .el-card__header {
  color:#fff;
  }
  .el-form /deep/.el-form-item__label{
    color:#fff
  }
  </style>
  <style lang="scss" scoped>
// 修改对话框高度
    .show_card1 {
      background-color:#081b26c3;
    }
</style>


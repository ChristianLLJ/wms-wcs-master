<template>
  <div class="navbar">
    <div class="setContain">
      <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>
    <div class="companyData">
      <div class="companyContain">
        宝开（上海）智能物流科技有限公司
      </div>
      <div class="btnContain">
        <div class="image">
          <img src="@/assets/baokai.png" alt="">
        </div>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            下拉<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">填写更新日志</el-dropdown-item>
            <el-dropdown-item command="b">查看更新日志</el-dropdown-item>
            <el-dropdown-item command="c">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button size="small" type="warning" icon="el-icon-plus" @click="writeUpdate">填写更新日志</el-button>
        <el-button size="small" icon="el-icon-view" type="primary" @click="scanUpdate">查看更新日志</el-button>
        <el-button size="small" icon="el-icon-leave" type="danger" @click="logout">退出</el-button> -->
      </div>
    </div>
    <el-dialog :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form">
        <el-form-item label="更新日志：" label-width="120px" prop="content" :rules="{ required: true, message: '请填写', trigger: ['blur'] }">
          <el-input
            v-model="form.content"
            type="textarea"
            autosize
            placeholder="请填写"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { addscanUpdate } from '@/api/user'
import { getNowTime } from '@/utils/getTime'
import Hamburger from '@/components/Hamburger'
import Breadcrumb from '@/components/Breadcrumb'
export default {
  components: {
    Hamburger,
    Breadcrumb
  },
  data() {
    return {
      form: {
        content: ''
      },
      dialogFormVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/loginOut')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    writeUpdate() {
      this.dialogFormVisible = true
    },
    handleCommand(command) {
      if (command === 'a') {
        this.dialogFormVisible = true
      } else if (command === 'b') {
        this.scanUpdate()
      } else if (command === 'c') {
        this.logout()
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          addscanUpdate({
            content: this.form.content,
            createPerson: sessionStorage.getItem('getUserName'),
            createTime: getNowTime(this.form.createTime)
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('提交成功')
              this.dialogFormVisible = false
              this.$refs.form.resetFields()
              this.reload()
            }
          })
        }
      })
    },
    scanUpdate() {
      this.$router.push('/scanUpdate')
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 40px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
.setContain {
  width: 40%;
  // height: 40px;
  float:left;
}
.el-dropdown-link {
  color:#fff;
  cursor: pointer;
}
  .hamburger-container {
    line-height: 40px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .breadcrumb-container {
    float: left;
  }
  .companyData {
    line-height: 40px;
    display: flex;
    color:#fff;
    justify-content: space-between;
    .btnContain {
      display: flex;
      margin-right: 10px;
      .image {
        margin-right: 5px;
        margin-top: 5px;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        // border: 1px solid #fff;
        background-color: #eee;
        img {
        height: 30px;
        width: 30px;
        border-radius: 50%;
      }
      }

    }
  }
}
</style>

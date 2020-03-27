<template>
  <div class="box">
    <vue-particles
      color="#dedede"
      :particle-opacity="0.7"
      :particles-number="80"
      shape-type="circle"
      :particle-size="4"
      lines-color="#dedede"
      :lines-width="1"
      :line-linked="true"
      :line-opacity="0.4"
      :lines-distance="150"
      :move-speed="0.7"
      :hover-effect="true"
      hover-mode="grab"
      :click-effect="true"
      click-mode="push"
      class="particles"
    />

    <div class="login-warp">
      <!-- <h2 class="login-title">Smart数据分析平台</h2> -->
      <div class="login">
        <h4>Smart数据分析平台</h4>
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="0px"
          class="demo-ruleForm"
        >
          <el-form-item prop="username">
            <i class="iconfont icon-user"/>
            <el-input v-model="ruleForm.username" placeholder="请输入用户名" clearable/>
          </el-form-item>
          <el-form-item prop="password">
            <i class="iconfont icon-password"/>
            <el-input
              v-model="ruleForm.password"
              type="password"
              placeholder="请输入密码"
              clearable
            />
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="submitForm('ruleForm')"
          @keyup.enter.native="submitForm('ruleForm')"
        >
          登陆
        </el-button>
      </div>
    </div>
    <div class="copyright">©2020 版权所有：广州阳普智能系统科技有限公司 Powered by sunprocn</div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import CryptoJS from 'crypto-js'

export default {
  name: 'Login',
  data () {
    return {
      btnLoading: false,
      ruleForm: {
        username: 'AAdmin',
        password: '123456',
      },
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
      },
    }
  },
  methods: {
    ...mapMutations(['set_user']),
    submitForm (formName) {
      const password = this.encrypt(this.ruleForm.password)
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.$http
            .post('/api/sso/login', {
              username: this.ruleForm.username,
              // password: this.ruleForm.password,
              password,
            })
            .then(({ data }) => {
              const {
                token: { tokenType, accessToken },
                user: { username },
              } = data
              this.set_user({
                token: `${tokenType} ${accessToken}`,
                userInfo: { username },
              })

              this.$router.push({ path: '/dataModel' })
              this.btnLoading = false
            })
            .catch(error => {
              this.btnLoading = false
              this.$message.error(error)
            })
        } else {
          return false
        }
      })
    },
    // 加密
    encrypt (word) {
      var key = CryptoJS.enc.Utf8.parse('guangzhouyangpkj')
      var srcs = CryptoJS.enc.Utf8.parse(word)
      var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      })
      return encrypted.toString()
    },
  },
}
</script>
<style lang="scss" scoped>
.box {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: #0f2032;
  .particles {
    width: 100%;
    height: 100%;
  }
}
.login-warp {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -190px;
  margin-left: -250px;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login-title {
  margin: 0 0 50px 0;
  color: $white-color;
  font-size: 45px;
}
.login {
  padding:50px;
  width: 400px;
  border-radius: 5px;
  background: rgba(35, 118, 195, 0.4);
  border: 1px solid #1d82c7;
  h4 {
    margin: 0;
    margin-bottom: 40px;
    font-size: 30px;
    font-weight: normal;
    color: $white-color;
  }
  /deep/.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 30px;
  }
  /deep/.el-form-item__content{
    position: relative;
  }
    .iconfont {
    position: absolute;
    left:10px;
    font-size: 25px;
    line-height: 40px;
     color: $white-color;
  }

  /deep/.el-input__inner {
    padding-left: 45px;
    color: $white-color;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    border-radius: 10px;
     background: rgba(35, 118, 195, 0.4);
     border: 1px solid #1d82c7;
  }

  /deep/.el-button {
    padding: 12px;
    width: 100%;
    font-size: 16px;
    border-radius: 10px;
    background-color: #35a0de;
  }

}
.copyright{
   position: absolute;
   left: 50%;
   margin-left: -230px;
   bottom: 20px;
   text-align: center;
   color:$font-light-gray;
}
</style>

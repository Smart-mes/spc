<template>
  <div class="login-warp">
    <h2 class="login-title">Smart数据分析平台</h2>
    <div class="login">
      <h4>登陆</h4>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="0px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="3">
            <i class="iconfont icondenglu1"/>
          </el-col>
          <el-col :span="21">
            <el-form-item prop="username">
              <el-input v-model="ruleForm.username" placeholder="请输入用户名" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <i class="iconfont iconmima"/>
          </el-col>
          <el-col :span="21">
            <el-form-item prop="password">
              <el-input v-model="ruleForm.password" type="password" placeholder="请输入密码" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="btn-row">
          <el-col :span="24">
            <el-button
              type="primary"
              :loading="btnLoading"
              @click="submitForm('ruleForm')"
              @keyup.enter.native="submitForm('ruleForm')"
            >
              登陆
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      btnLoading: false,
      ruleForm: {
        username: 'admin',
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.btnLoading = true
          this.$http.post('http://rap2api.taobao.org/app/mock/238393/login', {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
          })
            .then(res => {
              this.btnLoading = false
              this.set_user(res)
              this.$router.push({ path: '/my/my1' })
            })
            .catch(error => {
              this.btnLoading = false
              console.log(error)
            })
        } else {
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.login-warp {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("~@/assets/images/login-bj.jpg") no-repeat;
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
  padding: 70px 40px;
  width: 400px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 1);
  h4 {
    margin: 0;
    padding-bottom: 30px;
    font-size: 25px;
    font-weight: normal;
    color: $title-color;
  }

  /deep/.el-input__inner {
    color: $title-color;
    // border: 1px solid #999;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    border-radius: 10px;
  }

  /deep/.el-button {
    padding: 12px;
    width: 100%;
    font-size: 16px;
    border-radius: 10px;
    // height: 40px;
    // line-height: 40px;
  }
  .iconfont {
    font-size: 28px;
    line-height: 40px;
    color: $font-light-gray;
  }
  .el-row {
    margin-top: 10px;
  }
  .btn-row {
    margin-top: 15px;
  }
}
</style>

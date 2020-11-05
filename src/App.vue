<template>
  <div class="container-lg">
    <global-header :user="currentUser"></global-header>
    <!-- <column-list :list="list"></column-list> -->

    <!-- Form -->
    <form>
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input :rules="emailRules"></validate-input>
      </div>

      <div class="mb-3">
        <label for="exampleInputPassword1" class="form-label">密码</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css' // bootstrap yyds
import ColumnList, { ColumnProps } from './components/ColumnList.vue'
import GlobalHeader, { UserProps } from './components/GlobalHeader.vue'
import ValidateInput, { RulesProp } from './components/ValidateInput.vue'

const testData: ColumnProps[] = [
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是专栏，这是很有意思的一段简介',
    avatar: 'https://img.lguohe.com/uploads/2018/11/vtools-480x300.png'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是专栏，这是很有意思的一段简介',
    avatar: 'https://img.lguohe.com/uploads/2019/05/anydo-480x300.png'
  },
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是专栏，这是很有意思的一段简介'
    // avatar: 'https://img.lguohe.com/uploads/2018/11/vtools-480x300.png'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是专栏，这是很有意思的一段简介',
    avatar: 'https://img.lguohe.com/uploads/2019/05/anydo-480x300.png'
  },
  {
    id: 1,
    title: 'test1的专栏',
    description: '这是专栏，这是很有意思的一段简介',
    avatar: 'https://img.lguohe.com/uploads/2018/11/vtools-480x300.png'
  },
  {
    id: 2,
    title: 'test2的专栏',
    description: '这是专栏，这是很有意思的一段简介',
    avatar: 'https://img.lguohe.com/uploads/2019/05/anydo-480x300.png'
  }
]

const currentUser: UserProps = {
  isLogin: true,
  name: 'viking'
}

export default defineComponent({
  name: 'App',
  components: {
    // ColumnList,
    GlobalHeader,
    ValidateInput
  },
  setup() {
    const emailRules: RulesProp = [
      {
        type: 'required',
        message: '电子邮箱地址不能为空'
      },
      {
        type: 'email',
        message: '请输入正确的电子邮箱格式'
      }
    ]

    return {
      list: testData,
      currentUser,
      emailRules
    }
  }
})
</script>

<style>
</style>

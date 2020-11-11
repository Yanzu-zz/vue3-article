<template>
  <form class="validate-for-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
      <slot name="submit">
        <!-- 当不传入 submit slot 是会默认渲染下面的按钮 -->
        <button type="submit" class="btn btn-primary">提交</button>
      </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt, { Emitter } from 'mitt'

export const emitter: Emitter = mitt()
type ValidateFunc = () => boolean

export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit'],
  setup(props, context) {
    let funcArr: ValidateFunc[] = []

    // 表单提交
    const submitForm = () => {
      // 有一个表单验证不通过就不能验证通过
      const result = funcArr.map((func) => func()).every((result) => result)
      context.emit('form-submit', result)
    }

    const callback = (func?: ValidateFunc) => {
      funcArr.push(func as ValidateFunc)
    }
    // 添加父组件的监听事件，以便让子组件和父组件通信
    // 注意：添加了监听记得要卸载监听
    emitter.on('form-item-created', callback)

    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })

    return {
      submitForm
    }
  }
})
</script>

<style>
</style>

<template>
  <!-- 弹出层确认框 -->
  <teleport to="#modal">
    <div class="modal d-block" tabindex="-1" v-if="visible">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ title }}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true" @click="onClose">&times;</span>
            </button>
          </div>

          <div class="modal-body">
            <slot></slot>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              @click="onClose"
            >
              {{ cancellationText }}
            </button>
            <button type="button" class="btn btn-primary" @click="onConfirm">
              {{ confirmationText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'

export default defineComponent({
  name: 'modal',
  props: {
    title: String,
    visible: {
      type: Boolean,
      default: false
    },
    confirmationText: {
      type: String,
      default: '确认'
    },
    cancellationText: {
      type: String,
      default: '取消'
    }
  },
  emits: ['modal-on-close', 'modal-on-confirm'],
  setup(props, context) {
    useDOMCreate('modal')

    const onClose = () => {
      context.emit('modal-on-close')
    }
    const onConfirm = () => {
      context.emit('modal-on-confirm')
    }

    return {
      onClose,
      onConfirm
    }
  }
})
</script>

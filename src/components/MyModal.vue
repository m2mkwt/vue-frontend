<template>
  <transition name="modal" appear>
    <div class="modal modal-overlay" v-on:click.self="$emit('close')">
      <div class="modal-window">
        <div class="modal-header">
          <slot name="header"></slot>
        </div>
        <div class="modal-content">
          <slot/>
        </div>
        <footer class="modal-footer">
          <slot name="footer">
            <button v-on:click="$emit('close')">Close</button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>

</script>
<style lang="scss" scoped>
.modal {
  &.modal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    right:0;
    bottom:0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  &-header {
    font-weight:bold;
    padding:15px 20px;
    background: #359cda;
    color:#fff;
  }

  &-window {
    background: #fff;
    border-radius: 4px;
  }

  &-content {
    padding: 10px 20px;
    max-height:410px;
    overflow-y:auto;
  }

  &-footer {
    background: #ccc;
    padding: 10px;
    text-align: right;
  }
}

.modal-window {
  width:600px
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.4s;

  .modal-window {
    transition: opacity 0.4s, transform 0.4s;
  }
}

.modal-leave-active {
  transition: opacity 0.6s ease 0.4s;
}

.modal-enter, .modal-leave-to {
  opacity: 0;

  .modal-window {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>

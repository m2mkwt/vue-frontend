<template>
<transition name="modal" appear>
    <div class="modal regmodal-overlay" @click.self="$emit('close')">
    <div>
        <div>
          <slot>
          </slot>
        </div>
        <footer>
        </footer>
    </div>
    </div>
</transition>
</template>

<script>

export default {
  name: 'MemberRegi'
}
</script>

<style>
.regmodal-overlay {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    z-index: 30;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
}
.regwindow {
    background: #fff;
    border-radius: 2px;
    overflow: hidden;
    height: 50%;
}
.regcontent {
    padding: 10px 20px;
    height: 550px;
    overflow: scroll;
    overflow-x:hidden;
  }
.footer {
    background: #ccc;
    padding: 10px;
  }
.content::-webkit-scrollbar { width: 5.2px; }
.content::-webkit-scrollbar-track { background-color:#5D5D5D; }
.content::-webkit-scrollbar-thumb { background: #303030; }
.content::-webkit-scrollbar-thumb:hover { background: #404040; }
.content::-webkit-scrollbar-thumb:active { background: #808080; }
.content::-webkit-scrollbar-button { display: none; }
</style>

<template>
  <template v-for="(plugin, index) in plugins">
    <x-dialog v-model="plugin.show"
              :id="plugin.id"
              :ref="'plugin_' + plugin.id"
              :width="plugin.options.width"
              :title="plugin.options.title"
              :bottomAlign="plugin.options.bottomAlign"
              :autoClose="plugin.options.autoClose"
              :fullscreen="plugin.options.fullscreen"
              :drag="plugin.options.drag"
              :modal="plugin.options.modal"
              :margin="plugin.options.margin"
              @confirm="onPluginConfirm(plugin, $event)"
              @close="onPluginClose(plugin, $event)"
              @cancel="onPluginCancel(plugin, $event)"
              :beforeClose="onBeforeClose"
              :plain="plugin.options.plain"
              :showClose="plugin.options.showClose"
              :confirmText="plugin.options.confirmText"
              :cancelText="plugin.options.cancelText">

      <x-render :key="plugin.id" :ref="plugin.id" :on="plugin.options.on" :data="plugin.options.props"
                v-model="plugin.component" @mounted="onPluginRender(plugin, $event)"></x-render>
    </x-dialog>
  </template>
</template>

<script setup>
import XDialog from './dialog/Dialog';
import XRender from './Render'
let app = getCurrentInstance();

import pluginStore from './plugin' ;
const plugin = pluginStore();
let {plugins} = storeToRefs(plugin);

const onPluginConfirm = (plugin, id) => {
  let confirm = plugin.options.confirm;
  if (confirm) {
    confirm && confirm(plugin.context, id, app.refs[`plugin_${id}`]);
  }
}

const onPluginClose = (plugin, id) => {
  close(plugin)
}

const onPluginCancel = async (plugin, id) => {
  let cancel = plugin.options.cancel;
  if (cancel) {
    let show = await cancel(plugin.context, id, app.refs[`plugin_${id}`]);
    if(show !== false) {
      close(plugin)
    }
  } else {
    close(plugin)
  }
}

const onBeforeClose = (id, done) => {
  let plugin = plugins.value.find(plugin => plugin.id == id);
  if(! plugin) {
    done();
    return;
  }

  let beforeClose = plugin.options.beforeClose;
  if (beforeClose) {
    beforeClose(plugin.context, done, app.refs[`plugin_${id}`]);
  } else {
    done();
  }
}

const close = (item) => {
  item.show = false;
  setTimeout(() => {
    let index = plugins.value.findIndex(plugin => plugin.id == item.id);
    plugins.value.splice(index, 1);
  }, 1)
}

const onPluginRender = (plugin, c) => {
  plugin.context = c;
  let mounted = plugin.options.mounted;
  mounted && mounted(c);
}
</script>

<style>

</style>

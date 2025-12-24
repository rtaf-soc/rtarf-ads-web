// plugins/monaco.client.js
import { defineNuxtPlugin } from '#app'
import * as monaco from 'monaco-editor'

export default defineNuxtPlugin((nuxtApp) => {
  // Config Monaco Environment
  window.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === 'json') {
        return './monaco/json.worker.js';
      }
      if (label === 'css' || label === 'scss' || label === 'less') {
        return './monaco/css.worker.js';
      }
      if (label === 'html' || label === 'handlebars' || label === 'razor') {
        return './monaco/html.worker.js';
      }
      if (label === 'typescript' || label === 'javascript') {
        return './monaco/ts.worker.js';
      }
      return './monaco/editor.worker.js';
    }
  };

  return {
    provide: {
      monaco
    }
  }
})
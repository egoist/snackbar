<template>
  <div id="app">
    <Content />
  </div>
</template>

<script>
import { SnackBar } from '../src'
import Content from './Content.md'

export default {
  components: {
    Content
  },

  mounted() {
    new SnackBar('Such Snackbar', {
      position: 'left',
      actions: [
        {
          text: 'yes',
          style: {
            color: 'cyan'
          },
          callback: snackbar => snackbar.destroy()
        }
      ]
    })

    new SnackBar('Very Tiny', {
      actions: [
        {
          text: 'dismiss',
          style: {
            color: 'red'
          },
          callback: snackbar => snackbar.destroy()
        }
      ]
    })

    new SnackBar('Love it?', {
      position: 'right',
      actions: [
        {
          text: 'confirm',
          style: {
            color: 'lightgreen'
          },
          callback: snackbar => snackbar.destroy()
        }
      ]
    })
  }
}
</script>

<style src="prismjs/themes/prism.css"></style>

<style>
body {
  background: #f0f0f0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  line-height: 1.5;
  max-width: 80ex;
  margin: 20px;
  margin-bottom: 120px;
}

a {
  color: #106ad5;
}

h1, h2, h3, h4, h5 {
  font-weight: 400;
}

pre, pre[class*="language-"] {
  background: rgba(36, 126, 233, 0.1);
  padding: 15px;
  margin: 20px 0;
  overflow: auto;
}

code[class*="language-"], pre[class*="language-"] {
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 14px;
  text-shadow: none;
  font-family: source-code-pro,Menlo,Monaco,Consolas,Courier New,monospace !important;
}

* {
  box-sizing: border-box;
}
</style>

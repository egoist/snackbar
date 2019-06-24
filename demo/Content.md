# SnackBar

A tiny browser library for showing a brief message at the bottom of the screen (1kB gzipped).

## Use with bundler

```js
import { createSnackbar } from '@egoist/snackbar'
import '@egoist/snackbar/dist/snackbar.css'

createSnackbar('hello', {
  position: 'right'
})
```

## Use via CDN

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@egoist/snackbar/dist/snackbar.min.css"
/>

<script src="https://unpkg.com/@egoist/snackbar/dist/snackbar.min.js"></script>

<script>
  snackbar.createSnackbar('hello')
</script>
```

## Dig in...

[API docs](/docs)

[GitHub repo](https://github.com/egoist/snackbar)

[Buy me a coffee](https://ko-fi.com/support_egoist)

[Support me on Patreon](https://patreon.com/egoist)

## Examples

### Destory all snackbars

```js
import { destroyAllSnackbars } from '@egoist/snackbar'

destroyAllSnackbars()
```

<button @click="destroyAllSnackbars">Clear</button>

### Self-destroy in specific timeout

```js
import { createSnackbar } from '@egoist/snackbar'

createSnackbar('hello world', {
  timeout: 2000 // 2 seconds
})
```

<button @click="createSnackbar('hello world', {
timeout: 2000 // 2 seconds
})">Show message</button>

### Custom action button

```js
import { createSnackbar } from '@egoist/snackbar'

createSnackbar('hello world', {
  actions: [
    {
      text: 'COOL',
      style: {
        color: 'pink'
      },
      callback(button, snackbar) {
        if (window.confirm('You really wanna close me?')) {
          snackbar.destroy()
        }
      }
    }
  ]
})
```

<button @click="createConfirmSnackbar">Show message</button>

### Use light theme

<button @click="createSnackbar('light theme', {
theme: 'light'
})">Show message</button>

<!-- add content above -->

<script>
import { destroyAllSnackbars, createSnackbar } from '../src'

export default {
  methods: {
    destroyAllSnackbars,
    createSnackbar,

    createConfirmSnackbar() {
      createSnackbar('hello world', {
        actions: [
          {
            text: 'COOL',
            style: {
              color: 'pink'
            },
            callback(button, snackbar) {
              if (window.confirm('You really wanna close me?')) {
                snackbar.destroy()
              }
            }
          }
        ]
      })
    }
  }
}
</script>

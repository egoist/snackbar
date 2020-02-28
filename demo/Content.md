# SnackBar

A tiny browser library for showing a brief message at the bottom of the screen (1kB gzipped).

## Use with bundler

```js
import { createSnackbar } from '@snackbar/core'
import '@snackbar/core/dist/snackbar.css'

createSnackbar('hello', {
  position: 'right'
})
```

## Use via CDN

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@snackbar/core/dist/snackbar.min.css"
/>

<script src="https://unpkg.com/@snackbar/core/dist/snackbar.min.js"></script>

<script>
  snackbar.createSnackbar('hello')
</script>
```

## Dig in...

[API docs](/docs)

[GitHub repo](https://github.com/egoist/snackbar)

[Sponsor me on GitHub](https://github.com/sponsors/egoist)

## Examples

### Destory all snackbars

```js
import { destroyAllSnackbars } from '@snackbar/core'

destroyAllSnackbars()
```

<button @click="destroyAllSnackbars">Clear</button>

### Self-destroy in specific timeout

```js
import { createSnackbar } from '@snackbar/core'

createSnackbar('hello world', {
  timeout: 2000 // 2 seconds
})
```

<button @click="createSnackbar('hello world', {
timeout: 2000 // 2 seconds
})">Show message</button>

### Use a DOM node as message

```js
import { createSnackbar } from '@snackbar/core'

const message = document.createElement('div')
message.innerHTML = `<strong style="color:pink">DOM node</strong>`

createSnackbar(message)
```

<button @click="createDOMNodeSnackbar">Show message</button>

### Custom action button

```js
import { createSnackbar } from '@snackbar/core'

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

Check out [the docs](/docs/interfaces/snackoptions.html#actions) for `actions` option.

### Light theme

```js
import { createSnackbar } from '@snackbar/core'

createSnackbar('light theme', {
  theme: 'light'
})
```

<button @click="createSnackbar('light theme', {
theme: 'light'
})">Show message</button>

Check out [the docs](/docs/interfaces/snackoptions.html#theme) for `theme` option.

### Custom theme

```js
import { createSnackbar } from '@snackbar/core'

createSnackbar('custom theme', {
  theme: {
    backgroundColor: 'magenta',
    actionColor: 'cyan'
  }
})
```

<button @click="createSnackbar('custom theme', {
theme: {
backgroundColor: 'magenta',
actionColor: 'cyan'
}
})">Show message</button>

Check out [all properties](/docs/interfaces/themerules.html) under the `theme` option.

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
    },

    createDOMNodeSnackbar() {
      const message = document.createElement('div')
      message.innerHTML = `<strong style="color:pink">DOM node</strong>`

      createSnackbar(message)
    }
  }
}
</script>

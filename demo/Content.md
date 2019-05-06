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

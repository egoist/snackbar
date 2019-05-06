import './style.css'

export interface Action {
  /**
   * Action button text
   */
  text: string
  /**
   * Action button style
   * @example
   *
   * ```js
   * {
   *   color: 'red'
   * }
   * ```
   */
  style?: {
    [k: string]: any
  }
  /**
   * Invoke a function when the action button is clicked
   */
  callback?: ActionCallback
}

export type ActionCallback = (
  button: HTMLButtonElement,
  snackbar: Snackbar
) => void

export type Position = 'left' | 'center' | 'right'

export interface SnackOptions {
  /**
   * Automatically destroy the snackbar in specific timeout (ms)
   * @default `0` means we won't automatically destroy the snackbar
   */
  timeout?: number
  /**
   * An array of action buttons
   */
  actions?: Action[]
  /**
   * Show snackbar in given position
   * @default `center`
   */
  position?: Position
}

export interface SnackInstanceOptions {
  timeout: number
  actions: Action[]
  position: Position
}

export interface SnackResult {
  destroy: () => void
}

export class Snackbar {
  message: string
  options: SnackInstanceOptions
  wrapper: HTMLDivElement
  /**
   * The snackbar element
   */
  el?: HTMLDivElement
  private timeoutId?: number

  constructor(message: string, options: SnackOptions = {}) {
    const {
      timeout = 0,
      actions = [{ text: 'dismiss', callback: () => this.destroy() }],
      position = 'center'
    } = options
    this.message = message
    this.options = {
      timeout,
      actions,
      position
    }

    this.wrapper = this.getWrapper(this.options.position)
    this.insert()
  }

  getWrapper(position: Position): HTMLDivElement {
    let wrapper = document.querySelector(
      `.snackbars-${position}`
    ) as HTMLDivElement
    if (!wrapper) {
      wrapper = document.createElement('div')
      wrapper.className = `snackbars snackbars-${position}`
      document.body.appendChild(wrapper)
    }
    return wrapper
  }

  insert() {
    const el = document.createElement('div')
    el.className = 'snackbar'
    el.setAttribute('aria-live', 'assertive')
    el.setAttribute('aria-atomic', 'true')
    el.setAttribute('aria-hidden', 'false')

    const text = document.createElement('div')
    text.className = 'snackbar--text'
    text.textContent = this.message
    el.appendChild(text)

    // Add action buttons
    if (this.options.actions) {
      for (const action of this.options.actions) {
        const { style, text, callback } = action
        const button = document.createElement('button')
        button.className = 'snackbar--button'
        button.innerHTML = text
        if (style) {
          Object.keys(style).forEach(key => {
            button.style[key as any] = style[key]
          })
        }
        button.addEventListener('click', () => {
          this.stopTimer()
          if (callback) {
            callback(button, this)
          } else {
            this.destroy()
          }
        })
        el.appendChild(button)
      }
    }

    // Add timeout
    if (this.options.timeout) {
      this.timeoutId = self.setTimeout(
        () => this.destroy(),
        this.options.timeout
      )
    }

    this.el = el

    this.wrapper.appendChild(el)
  }

  /**
   * Destory the snackbar
   */
  async destroy() {
    const { el, wrapper } = this
    if (el) {
      // Transition the snack away.
      el.setAttribute('aria-hidden', 'true')
      await new Promise(resolve => {
        const eventName = getTransitionEvent(el)
        if (eventName) {
          el.addEventListener(eventName, () => resolve())
        } else {
          resolve()
        }
      })
      wrapper.removeChild(el)
    }
    this.el = undefined
  }

  stopTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
  }
}

function getTransitionEvent(el: HTMLDivElement): string | undefined {
  const transitions: { [k: string]: string } = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
  }

  for (const key of Object.keys(transitions)) {
    if (el.style[key as any] !== undefined) {
      return transitions[key]
    }
  }
  return
}

export function createSnackbar(message: string, options?: SnackOptions) {
  return new Snackbar(message, options)
}

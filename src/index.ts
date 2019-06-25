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
  theme?: 'string' | ThemeRules
}

export interface SnackInstanceOptions {
  timeout: number
  actions: Action[]
  position: Position
  theme: ThemeRules
}

export interface SnackResult {
  destroy: () => void
}

export interface ThemeRules {
  backgroundColor?: string
  textColor?: string
  boxShadow?: string
  actionColor?: string
}

let instances: Snackbar[] = []

const themes: { [name: string]: ThemeRules } = {
  light: {
    backgroundColor: '#fff',
    textColor: '#000',
    actionColor: '#008000'
  },
  dark: {}
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
      position = 'center',
      theme = 'dark'
    } = options
    this.message = message
    this.options = {
      timeout,
      actions,
      position,
      theme: typeof theme === 'string' ? themes[theme] : theme
    }

    this.wrapper = this.getWrapper(this.options.position)
    this.insert()
    instances.push(this)
  }

  get theme() {
    return this.options.theme
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

    const { backgroundColor, textColor, boxShadow, actionColor } = this.theme
    if (backgroundColor) {
      el.style.backgroundColor = backgroundColor
    }
    if (textColor) {
      el.style.color = textColor
    }
    if (boxShadow) {
      el.style.boxShadow = boxShadow
    }

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
        if (actionColor) {
          button.style.color = actionColor
        }
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

    this.startTimer()

    // Stop timer when mouseenter
    // Restart timer when mouseleave
    el.addEventListener('mouseenter', () => {
      this.stopTimer()
    })
    el.addEventListener('mouseleave', () => {
      this.startTimer()
    })

    this.el = el

    this.wrapper.appendChild(el)
  }

  /**
   * Destory the snackbar
   */
  async destroy() {
    const { el, wrapper } = this
    if (el) {
      this.el = undefined
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
  }

  startTimer() {
    if (this.options.timeout && !this.timeoutId) {
      this.timeoutId = self.setTimeout(
        () => this.destroy(),
        this.options.timeout
      )
    }
  }

  stopTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = undefined
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

export function destroyAllSnackbars() {
  return Promise.all(instances.map(instance => instance.destroy()))
}

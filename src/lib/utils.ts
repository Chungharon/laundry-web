import { createCn } from "cn/config"

/**
 * Class merger that knows the Laundry Hub type scale. Without this, merge
 * treats `text-h2` like a colour and `cn("text-h2", "text-ink")` drops one.
 * Keep the list in step with the `--text-*` tokens in globals.css.
 */
const fontSizes = [
  "display-xl",
  "display-l",
  "h2",
  "numeral",
  "modal-title",
  "h3",
  "h4",
  "lead",
  "body-l",
  "body",
  "small",
  "eyebrow",
  "label",
]

// Named sizes from the `--spacing-*` tokens (h-control-md, size-icon-lg …).
const spacing = [
  "control-sm",
  "control-md",
  "control-lg",
  "control-xl",
  "icon-sm",
  "icon-md",
  "icon-lg",
  "rule",
]

export const cn = createCn({
  extend: {
    theme: { spacing },
    classGroups: {
      "font-size": [{ text: fontSizes }],
    },
  },
})

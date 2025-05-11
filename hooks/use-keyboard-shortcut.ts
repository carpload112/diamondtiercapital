"use client"

import { useEffect, useCallback } from "react"

type KeyCombo = string | string[]
type KeyHandler = (event: KeyboardEvent) => void

/**
 * Hook for keyboard shortcuts
 * @param keyCombo Key or keys to listen for (e.g., 'Escape', ['Control', 'S'])
 * @param callback Function to call when the key combo is pressed
 * @param options Additional options
 */
export function useKeyboardShortcut(
  keyCombo: KeyCombo,
  callback: KeyHandler,
  { preventDefault = true, stopPropagation = true, keyevent = "keydown", disabled = false } = {},
) {
  // Normalize key combo to array
  const keys = Array.isArray(keyCombo) ? keyCombo : [keyCombo]

  // Handler function
  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      // Check if all keys in the combo are pressed
      const allKeysPressed = keys.every((key) => {
        if (key === "Control") return event.ctrlKey
        if (key === "Alt") return event.altKey
        if (key === "Shift") return event.shiftKey
        if (key === "Meta") return event.metaKey
        return event.key === key
      })

      if (allKeysPressed) {
        if (preventDefault) {
          event.preventDefault()
        }

        if (stopPropagation) {
          event.stopPropagation()
        }

        callback(event)
      }
    },
    [keys, callback, preventDefault, stopPropagation],
  )

  // Add and remove event listener
  useEffect(() => {
    if (disabled) return

    document.addEventListener(keyevent, handleKey)

    return () => {
      document.removeEventListener(keyevent, handleKey)
    }
  }, [keyevent, handleKey, disabled])
}

"use client"

import { useState, useEffect } from "react"

export function useClientOnly<T>(initialValue: T, getValue: () => T): T {
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    setValue(getValue())
  }, [getValue])

  return value
}

// Example usage:
// const windowWidth = useClientOnly(0, () => window.innerWidth);

'use client'
import { useEffect, useRef } from 'react'

/**
 * useIgnoredEffect
 * @param effect - The effect callback function
 * @param triggerDeps - Dependencies that will trigger the effect when changed
 * @param ignoredDeps - Dependencies that will update their references but not trigger the effect
 */
export function useIgnoredEffect(
  effect: () => void | (() => void),
  triggerDeps: any[],
  ignoredDeps: any[],
) {
  const ignoredDepsRef = useRef(ignoredDeps)

  // Update ref when ignoredDeps change, but do not trigger the effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    ignoredDepsRef.current = ignoredDeps
  }, ignoredDeps)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return effect()
  }, triggerDeps)
}

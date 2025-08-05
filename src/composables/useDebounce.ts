import { ref, watch, type Ref } from 'vue'

export function useDebounce<T>(
  value: Ref<T>,
  delay: number
): Ref<T> {
  const debouncedValue = ref<T>(value.value)
  
  watch(
    value,
    (newValue) => {
      const timer = setTimeout(() => {
        debouncedValue.value = newValue
      }, delay)
      
      return () => clearTimeout(timer)
    },
    { immediate: true }
  )
  
  return debouncedValue as Ref<T>
}

export function useDebouncedFunction<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): T {
  let timeoutId: number | null = null
  
  return ((...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = window.setTimeout(() => {
      fn(...args)
      timeoutId = null
    }, delay)
  }) as T
}

export function useThrottle<T>(
  value: Ref<T>,
  delay: number
): Ref<T> {
  const throttledValue = ref<T>(value.value)
  let lastUpdate = 0
  
  watch(
    value,
    (newValue) => {
      const now = Date.now()
      
      if (now - lastUpdate >= delay) {
        throttledValue.value = newValue
        lastUpdate = now
      } else {
        const timer = setTimeout(() => {
          throttledValue.value = newValue
          lastUpdate = Date.now()
        }, delay - (now - lastUpdate))
        
        return () => clearTimeout(timer)
      }
    },
    { immediate: true }
  )
  
  return throttledValue as Ref<T>
}
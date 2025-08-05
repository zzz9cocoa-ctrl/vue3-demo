import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: {
    serializer?: {
      read: (value: string) => T
      write: (value: T) => string
    }
  } = {}
): [Ref<T>, (value: T) => void, () => void] {
  const {
    serializer = {
      read: (v: string) => {
        try {
          return JSON.parse(v)
        } catch {
          return v as any
        }
      },
      write: (v: T) => JSON.stringify(v)
    }
  } = options

  // 读取初始值
  const read = (): T => {
    try {
      const item = localStorage.getItem(key)
      if (item === null) {
        return defaultValue
      }
      return serializer.read(item)
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return defaultValue
    }
  }

  // 写入值
  const write = (value: T): void => {
    try {
      localStorage.setItem(key, serializer.write(value))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  // 删除值
  const remove = (): void => {
    try {
      localStorage.removeItem(key)
      storedValue.value = defaultValue
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  const storedValue = ref<T>(read())

  // 监听值变化并同步到localStorage
  watch(
    storedValue,
    (newValue) => {
      write(newValue)
    },
    { deep: true }
  )

  // 监听localStorage变化（多标签页同步）
  window.addEventListener('storage', (e) => {
    if (e.key === key && e.newValue !== null) {
      try {
        storedValue.value = serializer.read(e.newValue)
      } catch (error) {
        console.error(`Error parsing localStorage change for key "${key}":`, error)
      }
    }
  })

  return [storedValue, (value: T) => { storedValue.value = value }, remove]
}
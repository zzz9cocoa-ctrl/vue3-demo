import { ref, computed, type Ref } from 'vue'

export interface UseAsyncState<T> {
  data: Ref<T | null>
  error: Ref<Error | null>
  isLoading: Ref<boolean>
  isSuccess: Ref<boolean>
  isError: Ref<boolean>
}

export interface UseAsyncOptions {
  immediate?: boolean
  resetOnExecute?: boolean
  throwOnError?: boolean
}

export function useAsync<T, Args extends any[] = []>(
  asyncFn: (...args: Args) => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const {
    immediate = false,
    resetOnExecute = true,
    throwOnError = false
  } = options

  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const isLoading = ref(false)

  const isSuccess = computed(() => !isLoading.value && !error.value && data.value !== null)
  const isError = computed(() => !isLoading.value && error.value !== null)

  const execute = async (...args: Args): Promise<T | null> => {
    if (resetOnExecute) {
      data.value = null
      error.value = null
    }

    isLoading.value = true

    try {
      const result = await asyncFn(...args)
      data.value = result
      error.value = null
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      data.value = null
      
      if (throwOnError) {
        throw err
      }
      
      return null
    } finally {
      isLoading.value = false
    }
  }

  const reset = (): void => {
    data.value = null
    error.value = null
    isLoading.value = false
  }

  const mutate = (newData: T): void => {
    data.value = newData
    error.value = null
  }

  // 立即执行
  if (immediate && asyncFn.length === 0) {
    execute()
  }

  return {
    data: readonly(data),
    error: readonly(error),
    isLoading: readonly(isLoading),
    isSuccess,
    isError,
    execute,
    reset,
    mutate
  }
}

// 专门用于数据获取的Hook
export function useFetch<T>(
  url: string,
  options: RequestInit & UseAsyncOptions = {}
) {
  const { immediate = true, ...fetchOptions } = options

  const fetchData = async (): Promise<T> => {
    const response = await fetch(url, fetchOptions)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      return response.json()
    }
    
    return response.text() as any
  }

  return useAsync(fetchData, { immediate })
}
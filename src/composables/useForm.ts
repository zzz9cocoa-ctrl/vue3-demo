import { ref, reactive, computed, watch, type Ref } from 'vue'
import type { FormField, ValidationRule } from '@/types'

// 表单验证错误类型
export interface FormErrors {
  [key: string]: string[]
}

// 表单配置
export interface FormConfig {
  fields: FormField[]
  validateOnChange?: boolean
  validateOnBlur?: boolean
  resetOnSubmit?: boolean
}

// 表单状态
export interface FormState {
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
  isTouched: boolean
  errors: FormErrors
}

// 字段状态
export interface FieldState {
  value: any
  error: string[]
  isDirty: boolean
  isTouched: boolean
  isValid: boolean
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  config: FormConfig
) {
  // 表单数据
  const formData = reactive<T>({ ...initialValues })
  
  // 表单状态
  const isSubmitting = ref(false)
  const errors = ref<FormErrors>({})
  const touchedFields = ref<Set<string>>(new Set())
  const dirtyFields = ref<Set<string>>(new Set())

  // 计算属性
  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  const isDirty = computed(() => {
    return dirtyFields.value.size > 0
  })

  const isTouched = computed(() => {
    return touchedFields.value.size > 0
  })

  const formState = computed<FormState>(() => ({
    isValid: isValid.value,
    isSubmitting: isSubmitting.value,
    isDirty: isDirty.value,
    isTouched: isTouched.value,
    errors: errors.value
  }))

  // 验证单个字段
  const validateField = (fieldName: string, value: any): string[] => {
    const field = config.fields.find(f => f.name === fieldName)
    if (!field?.rules) return []

    const fieldErrors: string[] = []

    for (const rule of field.rules) {
      if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
        fieldErrors.push(`${field.label}是必填项`)
        continue
      }

      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        fieldErrors.push(`${field.label}至少需要${rule.minLength}个字符`)
        continue
      }

      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        fieldErrors.push(`${field.label}不能超过${rule.maxLength}个字符`)
        continue
      }

      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        fieldErrors.push(`${field.label}格式不正确`)
        continue
      }

      if (rule.custom) {
        const customResult = rule.custom(value)
        if (typeof customResult === 'string') {
          fieldErrors.push(customResult)
        } else if (!customResult) {
          fieldErrors.push(`${field.label}验证失败`)
        }
      }
    }

    return fieldErrors
  }

  // 验证所有字段
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    config.fields.forEach(field => {
      const fieldErrors = validateField(field.name, formData[field.name])
      if (fieldErrors.length > 0) {
        newErrors[field.name] = fieldErrors
      }
    })

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  // 设置字段值
  const setFieldValue = (fieldName: string, value: any): void => {
    formData[fieldName] = value
    dirtyFields.value.add(fieldName)

    if (config.validateOnChange) {
      const fieldErrors = validateField(fieldName, value)
      if (fieldErrors.length > 0) {
        errors.value[fieldName] = fieldErrors
      } else {
        delete errors.value[fieldName]
      }
    }
  }

  // 设置字段触摸状态
  const setFieldTouched = (fieldName: string, touched = true): void => {
    if (touched) {
      touchedFields.value.add(fieldName)
    } else {
      touchedFields.value.delete(fieldName)
    }

    if (config.validateOnBlur && touched) {
      const fieldErrors = validateField(fieldName, formData[fieldName])
      if (fieldErrors.length > 0) {
        errors.value[fieldName] = fieldErrors
      } else {
        delete errors.value[fieldName]
      }
    }
  }

  // 获取字段状态
  const getFieldState = (fieldName: string): FieldState => {
    return {
      value: formData[fieldName],
      error: errors.value[fieldName] || [],
      isDirty: dirtyFields.value.has(fieldName),
      isTouched: touchedFields.value.has(fieldName),
      isValid: !errors.value[fieldName]?.length
    }
  }

  // 设置表单错误
  const setErrors = (newErrors: FormErrors): void => {
    errors.value = { ...newErrors }
  }

  // 设置字段错误
  const setFieldError = (fieldName: string, error: string[]): void => {
    errors.value[fieldName] = error
  }

  // 清除错误
  const clearErrors = (): void => {
    errors.value = {}
  }

  // 清除字段错误
  const clearFieldError = (fieldName: string): void => {
    delete errors.value[fieldName]
  }

  // 重置表单
  const resetForm = (values?: Partial<T>): void => {
    Object.assign(formData, { ...initialValues, ...values })
    errors.value = {}
    touchedFields.value.clear()
    dirtyFields.value.clear()
    isSubmitting.value = false
  }

  // 提交表单
  const handleSubmit = async (
    onSubmit: (values: T) => Promise<void> | void
  ): Promise<void> => {
    if (isSubmitting.value) return

    // 标记所有字段为已触摸
    config.fields.forEach(field => {
      touchedFields.value.add(field.name)
    })

    // 验证表单
    if (!validateForm()) {
      return
    }

    isSubmitting.value = true

    try {
      await onSubmit(formData)
      
      if (config.resetOnSubmit) {
        resetForm()
      }
    } catch (error) {
      console.error('Form submission error:', error)
      throw error
    } finally {
      isSubmitting.value = false
    }
  }

  // 监听表单数据变化
  watch(
    () => formData,
    (newData, oldData) => {
      if (oldData) {
        Object.keys(newData).forEach(key => {
          if (newData[key] !== oldData[key]) {
            dirtyFields.value.add(key)
          }
        })
      }
    },
    { deep: true }
  )

  return {
    // 表单数据
    formData: readonly(formData),
    
    // 表单状态
    formState,
    isValid,
    isSubmitting: readonly(isSubmitting),
    isDirty,
    isTouched,
    errors: readonly(errors),
    
    // 方法
    setFieldValue,
    setFieldTouched,
    getFieldState,
    validateField,
    validateForm,
    setErrors,
    setFieldError,
    clearErrors,
    clearFieldError,
    resetForm,
    handleSubmit
  }
}

// 预定义的验证规则
export const validationRules = {
  required: (message?: string): ValidationRule => ({
    required: true,
    custom: (value: any) => {
      if (!value || (typeof value === 'string' && !value.trim())) {
        return message || '此字段是必填项'
      }
      return true
    }
  }),

  email: (message?: string): ValidationRule => ({
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return message || '请输入有效的邮箱地址'
      }
      return true
    }
  }),

  minLength: (length: number, message?: string): ValidationRule => ({
    minLength: length,
    custom: (value: string) => {
      if (value && value.length < length) {
        return message || `至少需要${length}个字符`
      }
      return true
    }
  }),

  maxLength: (length: number, message?: string): ValidationRule => ({
    maxLength: length,
    custom: (value: string) => {
      if (value && value.length > length) {
        return message || `不能超过${length}个字符`
      }
      return true
    }
  }),

  pattern: (regex: RegExp, message?: string): ValidationRule => ({
    pattern: regex,
    custom: (value: string) => {
      if (value && !regex.test(value)) {
        return message || '格式不正确'
      }
      return true
    }
  }),

  confirm: (targetField: string, message?: string): ValidationRule => ({
    custom: (value: string, formData: any) => {
      if (value !== formData[targetField]) {
        return message || '两次输入不一致'
      }
      return true
    }
  })
}
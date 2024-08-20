import { useUpdate } from 'ahooks'
import { SetStateAction, useRef } from 'react'

type Options<T> = {
  value?: T
  defaultValue: T
  onChange?: (v: T) => void
}
export const usePropsValue = <T>(options: Options<T>) => {
  const { value, defaultValue, onChange } = options

  const stateRef = useRef<T>(value !== undefined ? value : defaultValue)
  if (value !== undefined) {
    stateRef.current = value
  }

  const update = useUpdate()
  // setState用户传入的可能是函数，需要判断当是函数的时候直接更新为函数return的
  const setState = (v: SetStateAction<T>) => {
    const nextValue =
      typeof v === 'function' ? (v as (preState: T) => T)(stateRef.current) : v
    if (nextValue === stateRef.current) return
    stateRef.current = nextValue
    update()
    return onChange?.(nextValue)
  }

  return [stateRef.current,setState] as const
}
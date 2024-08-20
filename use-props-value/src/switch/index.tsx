import { ReactNode, memo, useCallback, useState, CSSProperties } from 'react'
import classnames from 'classnames'
import { usePropsValue } from '../use-props-value/usePropsValueDemo'

import './index.scss'

type CssVariable<S extends string = never> = Partial<Record<S, string>>

export interface CSwitchProps {
  /** 选中状态 */
  checked?: boolean
  /** 默认选中状态 */
  defaultChecked?: boolean
  /** disabled状态 */
  disabled?: boolean

  /** 异步函数, 返回 false 会阻止选中事件 */
  onChange?: (value: boolean) => boolean | void | Promise<boolean | void>
  className?: string
  /** 加载状态 */
  loading?: boolean
  /** 打开的文案 */
  checkedText?: ReactNode
  /** 关闭的文案 */
  uncheckedText?: ReactNode

  style?: CSSProperties & CssVariable<'--checked-color' | '--unchecked-color' | '--width' | '--height'>
}

const Cname = 'xfe-switch'

const defaultProps = {
  defaultChecked: false,
}

// 判断是否是promise
const isPromise = (value: any): value is Promise<any> => {
  return value && typeof value.then === 'function'
}

const CSwitch = (props: CSwitchProps) => {
  const { disabled, className, loading, checkedText, uncheckedText, style } = props || defaultProps

  const [changing, setChanging] = useState(false)

  const [checked, setChecked] = usePropsValue({
    value: props?.checked,
    defaultValue: props.defaultChecked || false,
    onChange: props?.onChange,
  })

  const handleClick = useCallback(async () => {
    if (disabled || loading || changing) {
      return
    }

    const nextChecked = !checked

    const result = setChecked(nextChecked)

    if (isPromise(result)) {
      setChanging(true)
      try {
        await result
        setChanging(false)
      } catch (e) {
        setChanging(false)
        throw e
      }
    }
  }, [disabled, loading, changing, checked])

  return (
    // 控制层
    <div
      className={classnames(`${Cname}`, className)}
      onClick={handleClick}
      role="switch"
      aria-label="switch"
      aria-checked={checked}
      aria-disabled={disabled}
      style={style}
    >
      {/* UI层 */}
      <div
        className={classnames(`${Cname}-checkbox`, {
          [`${Cname}-checkbox-checked`]: checked,
          [`${Cname}-checkbox-disabled`]: disabled || changing,
        })}
      >
        {/* 圆形 + 动画 */}
        <div className={`${Cname}-ball`}>
          {(loading || changing) && (
            <div className={`${Cname}-spin`}>
              <div className={`${Cname}-spin-circle`} />
            </div>
          )}
        </div>
        {/* 文案 */}
        <div className={`${Cname}-inner`}>{checked ? checkedText : uncheckedText}</div>
      </div>
    </div>
  )
}

export default memo(CSwitch)

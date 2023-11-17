'use client'

import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  Reducer,
  useReducer,
  useRef,
} from 'react'
import { message } from 'antd'

import { useUserStore } from '@/app/stores/auth.store'

interface IState {
  username: string
  password: string
  usernameError: boolean
  passwordError: boolean
}

type TAction =
  | { type: 'setUsername'; payload: string }
  | { type: 'setPassword'; payload: string }
  | { type: 'setUsernameError'; payload: boolean }
  | { type: 'setPasswordError'; payload: boolean }
  | { type: 'reset' }

const initialState: IState = {
  username: '',
  password: '',
  usernameError: false,
  passwordError: false,
}

const reducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case 'setUsername':
      return { ...state, username: action.payload }
    case 'setPassword':
      return { ...state, password: action.payload }
    case 'setUsernameError':
      return { ...state, usernameError: action.payload }
    case 'setPasswordError':
      return { ...state, passwordError: action.payload }
    case 'reset':
      return { ...initialState }
    default:
      throw new Error('未处理的action')
  }
}
export const LoginForm: FC = () => {
  const closeRef = useRef<any>()
  const login = useUserStore((state) => state.login)
  const [{ username, password, usernameError, passwordError }, dispatch] =
    useReducer<Reducer<IState, TAction>>(reducer, initialState)

  const setUsername: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch({ type: 'setUsername', payload: e.target.value })
    if (!e.target.value) {
      dispatch({ type: 'setUsernameError', payload: true })
    } else {
      dispatch({ type: 'setUsernameError', payload: false })
    }
  }

  const setPassword: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch({ type: 'setPassword', payload: e.target.value })
    if (!e.target.value) {
      dispatch({ type: 'setPasswordError', payload: true })
    } else {
      dispatch({ type: 'setPasswordError', payload: false })
    }
  }

  const handleSubmit: MouseEventHandler = async (e) => {
    e.preventDefault()
    const onSuccess = () => {
      message.success('用户登录成功!')
      if (closeRef.current) {
        closeRef.current.click()
        dispatch({ type: 'reset' })
      }
    }
    if (!usernameError && !passwordError) {
      await login(username, password, onSuccess)
    }
  }

  return (
    <dialog id='login-form' className='modal z-20'>
      <form className='modal-box pb-16 md:px-16'>
        <div className='navbar justify-center mb-8 text-2xl'>登录</div>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>用户名</span>
          </label>
          <input
            type='text'
            className={`input input-bordered w-full input-sm md:input-md ${
              usernameError && 'input-error'
            }`}
            autoFocus
            value={username}
            onChange={setUsername}
          />
        </div>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>密码</span>
          </label>
          <input
            type='password'
            className={`input input-bordered w-full input-sm md:input-md ${
              passwordError && 'input-error'
            }`}
            value={password}
            onChange={setPassword}
          />
        </div>
        <div className='form-control mt-8 text-center'>
          <button className='btn btn-primary' onClick={handleSubmit}>
            登录
          </button>
          <a
            className='link link-primary mt-4'
            onClick={() => {
              closeRef.current.click()
              ;(window as any)['register-form']?.showModal()
            }}
          >
            还没有账号? 赶紧注册一个!
          </a>
        </div>
      </form>
      <form method='dialog' className='modal-backdrop'>
        <button ref={closeRef}>close</button>
      </form>
    </dialog>
  )
}

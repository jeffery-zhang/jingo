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
import { ImageUpload } from '../common/upload'

interface IState {
  username: string
  password: string
  mail: string
  avatar: string
  usernameError: boolean
  passwordError: boolean
  mailError: boolean
}

type TAction =
  | { type: 'setUsername'; payload: string }
  | { type: 'setPassword'; payload: string }
  | { type: 'setMail'; payload: string }
  | { type: 'setAvatar'; payload: string }
  | { type: 'setUsernameError'; payload: boolean }
  | { type: 'setPasswordError'; payload: boolean }
  | { type: 'setMailError'; payload: boolean }
  | { type: 'reset' }

const initialState: IState = {
  username: '',
  password: '',
  mail: '',
  avatar: '',
  usernameError: false,
  passwordError: false,
  mailError: false,
}

const reducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case 'setUsername':
      return { ...state, username: action.payload }
    case 'setPassword':
      return { ...state, password: action.payload }
    case 'setMail':
      return { ...state, mail: action.payload }
    case 'setAvatar':
      return { ...state, avatar: action.payload }
    case 'setUsernameError':
      return { ...state, usernameError: action.payload }
    case 'setPasswordError':
      return { ...state, passwordError: action.payload }
    case 'setMailError':
      return { ...state, mailError: action.payload }
    case 'reset':
      return { ...initialState }
    default:
      throw new Error('未处理的action')
  }
}
export const RegisterForm: FC = () => {
  const closeRef = useRef<any>()
  const register = useUserStore((state) => state.register)
  const [
    {
      username,
      password,
      mail,
      avatar,
      usernameError,
      passwordError,
      mailError,
    },
    dispatch,
  ] = useReducer<Reducer<IState, TAction>>(reducer, initialState)

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

  const setMail: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch({ type: 'setMail', payload: e.target.value })
    if (!e.target.value) {
      dispatch({ type: 'setMailError', payload: true })
    } else {
      dispatch({ type: 'setMailError', payload: false })
    }
  }

  const setAvatar = (url: string) => {
    dispatch({ type: 'setAvatar', payload: url })
  }

  const handleSubmit: MouseEventHandler = async (e) => {
    e.preventDefault()
    const onSuccess = () => {
      message.success('用户注册成功!')
      if (closeRef.current) {
        closeRef.current.click()
        dispatch({ type: 'reset' })
      }
    }
    if (!usernameError && !passwordError && !mailError) {
      await register(
        {
          username,
          password,
          mail,
          avatar,
          roles: ['user'],
        },
        onSuccess,
      )
    }
  }

  return (
    <dialog id='register-form' className='modal'>
      <form className='modal-box pb-16 md:px-16'>
        <div className='navbar justify-center mb-8 text-2xl'>注册</div>
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
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>邮箱</span>
          </label>
          <input
            type='mail'
            className={`input input-bordered w-full input-sm md:input-md ${
              mailError && 'input-error'
            }`}
            value={mail}
            onChange={setMail}
          />
        </div>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>头像</span>
          </label>
          <ImageUpload
            value={[avatar]}
            onChange={(urls) => setAvatar(urls[0])}
            multiple={false}
            size={0.5}
          />
        </div>
        <div className='form-control mt-8 text-center'>
          <button className='btn btn-primary' onClick={handleSubmit}>
            注册并登录
          </button>
          <a
            className='link link-primary mt-4'
            onClick={() => {
              closeRef.current.click()
              ;(window as any)['login-form']?.showModal()
            }}
          >
            已有账号? 快去登录吧!
          </a>
        </div>
      </form>
      <form method='dialog' className='modal-backdrop'>
        <button ref={closeRef}>close</button>
      </form>
    </dialog>
  )
}

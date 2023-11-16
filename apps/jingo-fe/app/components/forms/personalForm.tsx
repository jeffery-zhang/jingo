'use client'

import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  Reducer,
  useEffect,
  useReducer,
  useRef,
} from 'react'
import { message } from 'antd'

import { useUserStore } from '@/app/stores/auth.store'
import { update } from '@/app/service/user'
import { ImageUpload } from '../common/upload'

interface IState {
  username: string
  mail: string
  avatar: string
  usernameError: boolean
  mailError: boolean
}

type TAction =
  | { type: 'setUsername'; payload: string }
  | { type: 'setMail'; payload: string }
  | { type: 'setAvatar'; payload: string }
  | { type: 'setUsernameError'; payload: boolean }
  | { type: 'setMailError'; payload: boolean }
  | { type: 'setUser'; payload: Partial<IState> }
  | { type: 'reset' }

const initialState: IState = {
  username: '',
  mail: '',
  avatar: '',
  usernameError: false,
  mailError: false,
}

const reducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case 'setUsername':
      return { ...state, username: action.payload }
    case 'setMail':
      return { ...state, mail: action.payload }
    case 'setAvatar':
      return { ...state, avatar: action.payload }
    case 'setUsernameError':
      return { ...state, usernameError: action.payload }
    case 'setMailError':
      return { ...state, mailError: action.payload }
    case 'setUser':
      return { ...state, ...action.payload }
    case 'reset':
      return { ...initialState }
    default:
      throw new Error('未处理的action')
  }
}
export const PersonalForm: FC = () => {
  const closeRef = useRef<any>()
  const { isLogged, user, setUser } = useUserStore((state) => ({
    isLogged: state.isLogged,
    user: state.user,
    setUser: state.setUser,
  }))
  const [{ username, mail, avatar, usernameError, mailError }, dispatch] =
    useReducer<Reducer<IState, TAction>>(reducer, initialState)

  const setUsername: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch({ type: 'setUsername', payload: e.target.value })
    if (!e.target.value) {
      dispatch({ type: 'setUsernameError', payload: true })
    } else {
      dispatch({ type: 'setUsernameError', payload: false })
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
    const onSuccess = async (dto: Partial<IState>) => {
      message.success('信息修改成功!')
      if (closeRef.current) {
        closeRef.current.click()
      }
      if (dto.username) {
        setUser({ username: dto.username })
      }
    }
    const updateDto: Partial<IState> = {}
    if (username !== user?.username) updateDto['username'] = username
    if (mail !== user?.mail) updateDto['mail'] = mail
    if (avatar !== user?.avatar) updateDto['avatar'] = avatar
    if (Object.keys(updateDto).length === 0) return
    if (!usernameError && !mailError) {
      const { success } = await update(updateDto)
      if (success) onSuccess(updateDto)
    }
  }

  useEffect(() => {
    if (isLogged && user) {
      dispatch({ type: 'setUser', payload: user })
    }
    if (!isLogged) {
      dispatch({ type: 'reset' })
    }
  }, [isLogged, user])

  return (
    <dialog id='personal-form' className='modal'>
      <form className='modal-box pb-16 md:px-16'>
        <div className='navbar justify-center mb-8 text-2xl'>个人信息</div>
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
            确认修改
          </button>
        </div>
      </form>
      <form method='dialog' className='modal-backdrop'>
        <button ref={closeRef}>close</button>
      </form>
    </dialog>
  )
}

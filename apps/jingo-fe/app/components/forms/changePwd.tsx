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
  oldPwd: string
  newPwd: string
  oldPwdError: boolean
  newPwdError: boolean
}

type TAction =
  | { type: 'setOldPwd'; payload: string }
  | { type: 'setNewPwd'; payload: string }
  | { type: 'setOldPwdError'; payload: boolean }
  | { type: 'setNewPwdError'; payload: boolean }
  | { type: 'reset' }

const initialState: IState = {
  oldPwd: '',
  newPwd: '',
  oldPwdError: false,
  newPwdError: false,
}

const reducer = (state: IState, action: TAction): IState => {
  switch (action.type) {
    case 'setOldPwd':
      return { ...state, oldPwd: action.payload }
    case 'setNewPwd':
      return { ...state, newPwd: action.payload }
    case 'setOldPwdError':
      return { ...state, oldPwdError: action.payload }
    case 'setNewPwdError':
      return { ...state, newPwdError: action.payload }
    case 'reset':
      return { ...initialState }
    default:
      throw new Error('未处理的action')
  }
}
export const ChangePwdForm: FC = () => {
  const closeRef = useRef<any>()
  const changePwd = useUserStore((state) => state.changePwd)
  const [{ oldPwd, newPwd, oldPwdError, newPwdError }, dispatch] = useReducer<
    Reducer<IState, TAction>
  >(reducer, initialState)

  const setOldPwd: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch({ type: 'setOldPwd', payload: e.target.value })
    if (!e.target.value) {
      dispatch({ type: 'setOldPwdError', payload: true })
    } else {
      dispatch({ type: 'setOldPwdError', payload: false })
    }
  }

  const setNewPwd: ChangeEventHandler<HTMLInputElement> = (e) => {
    dispatch({ type: 'setNewPwd', payload: e.target.value })
    if (!e.target.value) {
      dispatch({ type: 'setNewPwdError', payload: true })
    } else {
      dispatch({ type: 'setNewPwdError', payload: false })
    }
  }

  const handleSubmit: MouseEventHandler = async (e) => {
    e.preventDefault()
    const onSuccess = () => {
      message.success('密码修改成功!')
      if (closeRef.current) {
        closeRef.current.click()
        dispatch({ type: 'reset' })
      }
    }
    if (!oldPwdError && !newPwdError) {
      await changePwd(oldPwd, newPwd, onSuccess)
    }
  }

  return (
    <dialog id='changePwd-form' className='modal'>
      <form className='modal-box pb-16 md:px-16'>
        <div className='navbar justify-center mb-8 text-2xl'>修改密码</div>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>现密码</span>
          </label>
          <input
            type='password'
            className={`input input-bordered w-full input-sm md:input-md ${
              oldPwdError && 'input-error'
            }`}
            autoFocus
            value={oldPwd}
            onChange={setOldPwd}
          />
        </div>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>新密码</span>
          </label>
          <input
            type='password'
            className={`input input-bordered w-full input-sm md:input-md ${
              newPwdError && 'input-error'
            }`}
            value={newPwd}
            onChange={setNewPwd}
          />
        </div>
        <div className='form-control mt-8 text-center'>
          <button className='btn btn-primary' onClick={handleSubmit}>
            修改密码
          </button>
        </div>
      </form>
      <form method='dialog' className='modal-backdrop'>
        <button ref={closeRef}>close</button>
      </form>
    </dialog>
  )
}

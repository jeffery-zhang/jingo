'use client'

import { FC } from 'react'

import { Logo } from '../header/logo'

export const LoginForm: FC = () => {
  return (
    <dialog id='login-form' className='modal'>
      <form className='modal-box md:px-16' method='dialog'>
        <div className='navbar justify-center mb-8'>
          <Logo />
        </div>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>用户名</span>
          </label>
          <input
            type='text'
            className='input input-bordered w-full input-sm md:input-md'
            autoFocus
          />
        </div>
        <div className='form-control w-full'>
          <label className='label'>
            <span className='label-text'>密码</span>
          </label>
          <input
            type='password'
            className='input input-bordered w-full input-sm md:input-md'
            autoFocus
          />
        </div>
        <div className='form-control mt-8'>
          <button className='btn btn-primary'>登录</button>
        </div>
      </form>
      <form method='dialog' className='modal-backdrop'>
        <button>close</button>
      </form>
    </dialog>
  )
}

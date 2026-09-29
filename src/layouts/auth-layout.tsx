import { Outlet } from 'react-router-dom'

export  function AuthLayout() {
  return (
    <div className='flex-1 select-none'>
        <Outlet/>
    </div>
  )
}

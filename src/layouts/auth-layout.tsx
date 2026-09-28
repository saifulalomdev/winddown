import { Outlet } from 'react-router-dom'

export  function AuthLayout() {
  return (
    <div className='p-6'>
        <Outlet/>
    </div>
  )
}

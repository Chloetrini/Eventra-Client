import React from 'react'
import { Button } from './button'
import { Loader } from 'lucide-react'

interface PaymentBtnProps {
  loading?: boolean
  icon?: string
  editIcon?:string
  arrow?:string
  editArrow?:string
  text?: React.ReactNode
  classname?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

const PaymentBtn = ({
  loading,
  text,
  icon,
  editIcon,
  arrow,
  editArrow,
  classname,
  onClick,
  disabled,
}: PaymentBtnProps)  => {
  return (
    <Button
      disabled={loading || disabled}
      onClick={onClick}
      className={`flex items-center gap-1 h-12 px-5 text-[#727272] ${classname}`}
      variant="outline"
    >
      {icon && <img src={icon} alt="" className={`${editIcon}`} />}
      {loading && <Loader className="animate-spin" />}
      {!loading && text}
      {arrow && <img src={arrow} alt="" className={`${editArrow}`}/>}


    </Button>
  )
}

export default PaymentBtn
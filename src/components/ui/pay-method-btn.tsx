import React from 'react'
import { Button } from './button'
import { Loader } from 'lucide-react'

interface PaymentBtnProps {
  loading?: boolean
  icon?: string | React.ElementType
  editIcon?: string
  arrow?: string | React.ElementType
  editArrow?: string
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
}: PaymentBtnProps) => {

  const Icon = typeof icon !== "string" ? icon : undefined
  const Arrow = typeof arrow !== "string" ? arrow : undefined

  return (
    <Button
      disabled={loading || disabled}
      onClick={onClick}
      className={`flex items-center gap-1 md:h-12 md:px-5 text-[#727272] ${classname}`}
      variant="outline"
    >
      {typeof icon === "string" ? (
        <img
          src={icon}
          alt=""
          className={editIcon}
        />
      ) : Icon ? (
        <Icon className={editIcon} />
      ) : null}

      {loading && (
        <Loader className="animate-spin" />
      )}

      {!loading && text}

      {typeof arrow === "string" ? (
        <img
          src={arrow}
          alt=""
          className={editArrow}
        />
      ) : Arrow ? (
        <Arrow className={editArrow} />
      ) : null}
    </Button>
  )
}

export default PaymentBtn
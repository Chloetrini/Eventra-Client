import React from 'react'
import bag from '@/assets/bag.png'
import paystackLogo from '@/assets/paystackLogo.png'
import { FormBox } from '@/components/ui/form-box'
import { useForm } from 'react-hook-form'
import { registerSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check } from 'lucide-react'
import PaymentBtn from '@/components/ui/pay-method-btn'
import card from '@/assets/card.png'
import bank from '@/assets/bank.png'
import hashTag from '@/assets/hash.png'
import qrcode from '@/assets/qrcode2.png'
import TicketPreview from '@/components/ticket-preview'
import { useLocation, useNavigate } from 'react-router'
import PageWrapper from '@/components/pageWrapper'

const Checkout = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const ticket = location.state as {
        eventId: string
        eventName: string
        eventImage: string | null
        eventDateTime: string
        eventVenue: string
        ticketDetails: { id: number; type: string; unitPrice: number; quantity: number }[]
        subtotal: number
        serviceFee: number
        total: number
    } | null

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    })

    if (!ticket) {
        return (
            <div className='px-4 py-20 text-center'>
                <p className='mb-4 text-[#6E6577]'>No tickets selected yet.</p>
                <button
                    onClick={() => navigate('/explore')}
                    className='text-[#6e6e6e] font-semibold underline'
                >
                    Browse events
                </button>
            </div>
        )
    }

    const handlePay = () => {
        navigate('/payment/ticket-confirmation', { state: ticket })
    }

    return (
        <PageWrapper className='p-[20px]'>
            
            <div className='flex items-center gap-3 mb-4'>
                <div className='w-14.5 h-14.5 bg-[#E4F1EB] rounded-full flex items-center justify-center' >
                    <img src={bag} alt="Shopping Bag" className="w-7.5 h-7.5" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold font-grotesk ">Checkout</h1>
                    <p className="text-[#1A1A1A] font-medium text-sm leading-4">Fill in your details and complete your purchase.</p>
                </div>
            </div>
            <div className='flex flex-col-reverse lg:flex-row lg:justify-between gap-10 lg:gap-8 mt-10'>
                <div className='w-full lg:w-[60%]'>

                    <form action="" className='flex flex-col gap-7'>

                        <div className='flex items-center gap-2'>
                            <div className='w-7.5 h-7.5 bg-[#0A4F41] rounded-full flex items-center justify-center text-white'>
                                <p>1</p>
                            </div>
                            <h5 className='font-bold text-xl font-grotesk'>Your Details</h5>
                        </div>

                        <div className='flex flex-col gap-7 w-full '>
                            <div className='flex flex-col sm:flex-row gap-5'>
                                <FormBox type="text" placeholder="First name" id="firstName" register={register} errors={errors?.fullName} name="fullName" classname="w-full" borderStyle="checkout" />
                                <FormBox type="text" placeholder="Last name" id="lastName" register={register} errors={errors?.fullName} name="fullName" classname="w-full" borderStyle="checkout" />
                            </div>
                            <FormBox type="email" placeholder="Email address" id="email" register={register} errors={errors?.email} name="email" classname="w-full" borderStyle="checkout" />
                            <FormBox type="text" placeholder="Phone number" id="phoneNumber" register={register} errors={errors?.phoneNumber} name="phoneNumber" classname="w-full" borderStyle="checkout" />
                        </div>

                    </form>

                    <div className='flex items-center gap-2 mt-10 lg:mt-20 mb-7'>
                        <div className='w-7.5 h-7.5 bg-[#0A4F41] rounded-full flex items-center justify-center text-white'>
                            <p>2</p>
                        </div>
                        <h5 className='font-bold text-xl font-grotesk'>Payments</h5>
                    </div>

                    <div className='flex flex-col gap-5'>

                        <div className='w-full min-h-28 bg-[#E4F1EB] rounded-[20px] border hover:border-[#0A4F41] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-7 py-4 sm:py-0'>
                            <div className='flex flex-col md:flex-row items-center gap-3 text-center md:text-start'>
                                <div>
                                    <img src={paystackLogo} alt="" className='w-32' />
                                </div>
                                <div>
                                    <p className='flex flex-col'>
                                        <span className='font-medium'>Pay securely with paystack</span>
                                        <span className='text-sm'>
                                            Card, bank transfer, USSD, bank & QR - choose how to pay in the next step.
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className='w-6 h-6 bg-[#0A4F41] rounded-full flex items-center justify-center shrink-0 self-center'>
                                <Check color='white' className='w-4' />
                            </div>
                        </div>

                        <h6 className='font-medium'>Or choose another payment method</h6>

                        <div className='flex flex-wrap gap-3.5'>
                            <PaymentBtn icon={card} editIcon='w-5 h-5' text="Card" />
                            <PaymentBtn icon={bank} editIcon='w-5 h-5' text="Bank Transfer" />
                            <PaymentBtn icon={hashTag} editIcon='w-5 h-5' text="USSD" />
                            <PaymentBtn icon={qrcode} editIcon='w-5 h-5' text="QR code" />
                        </div>
                    </div>

                </div>
                <div className='w-full lg:w-[30%] flex justify-center px-2 sm:px-0'>
                    <div className='w-full max-w-md lg:max-w-none'>
                        <TicketPreview ticketCheckout={ticket} onPay={handlePay} />
                    </div>
                </div>
            </div>
        </PageWrapper>
    )
}

export default Checkout

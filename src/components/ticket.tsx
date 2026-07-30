import type { Ticket } from '@/lib/dummy-ticket'
import { CalendarDays, Clock, MapPinIcon, Music4 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import qrCode from '@/assets/qrcode Image.png'
import shieldTick from '@/assets/shieldTick.png'
import calendar from '@/assets/calendar.png'
import rightArrow from '@/assets/rightArrow.png'
import backward from '@/assets/backward.png'
import PaymentBtn from "@/components/ui/pay-method-btn"

interface TicketProps {
    ticket: Ticket
}

const TicketComponent = ({ ticket }: TicketProps) => {

    const {
        eventName,
        category,
        eventDateTime,
        eventEntrance,
        eventVenue,
        referenceCode,
        orderID,
        holderName,
        ticketDetails,
        QRcode,
        refundPolicy,
    } = ticket;

    const ticketId = "0001"
    const totalTickets = ticketDetails.reduce(
        (sum, item) => sum + item.quantity,
        0
    );


    return (
        <div>

            <div className='w-full flex flex-col md:flex-row justify-center items-center'>

                {/* GREEN CARD  */}
                <div className='flex flex-col justify-between gap-6 md:gap-0
                    w-full h-auto p-6 rounded-[18px] shadow-[0_4px_20px_rgba(0,0,0,0.6)]
                    md:w-[470px] md:h-[229px] md:p-[19px] md:rounded-[12px] md:shadow-[5px_0_18px_rgba(0,0,0,1)]
                    lg:w-[576px] lg:h-[281px] lg:p-6 lg:rounded-[14px] lg:shadow-[6px_0_22px_rgba(0,0,0,1)]
                    xl:w-200 xl:h-[390px] xl:p-8 xl:rounded-[20px] xl:shadow-[8px_0_30px_rgba(0,0,0,1)]
                    bg-linear-to-br from-black from-10% via-[#021713] via-40% to-[#0C5C48]'>

                    <div className='flex flex-col gap-3 md:gap-[5px] lg:gap-1.5 xl:gap-2'>

                        <div className='flex justify-between'>
                            <div className='bg-[#0A4F41] w-fit flex text-[#96E2B5]
                                py-2 px-4 gap-2 text-sm rounded-[10px]
                                md:py-[5px] md:px-3 md:gap-[5px] md:text-[10px] md:rounded-[6px]
                                lg:py-1.5 lg:px-[14px] lg:gap-1.5 lg:text-[12px] lg:rounded-[7px]
                                xl:py-2 xl:px-5 xl:gap-2 xl:text-base xl:rounded-[10px]'>
                                <Music4 className='w-[18px] h-[18px] md:w-[14px] md:h-[14px] lg:w-[17px] lg:h-[17px] xl:w-6 xl:h-6' />
                                <p>{category}</p>
                            </div>

                            <div className='bg-[#0A4F41] w-fit flex text-[#96E2B5]
                                py-2 px-4 gap-2 text-sm rounded-[10px]
                                md:py-[5px] md:px-3 md:gap-[5px] md:text-[10px] md:rounded-[6px]
                                lg:py-1.5 lg:px-[14px] lg:gap-1.5 lg:text-[12px] lg:rounded-[7px]
                                xl:py-2 xl:px-5 xl:gap-2 xl:text-base xl:rounded-[10px]'>
                                <p>{ }0000</p>
                            </div>
                        </div>

                        {/* title */}
                        <div className='text-white font-bold font-grotesk
                            text-[34px] sm:text-[42px] md:text-[32px] lg:text-[39px] xl:text-[54px]'>
                            <h1>{eventName}</h1>
                        </div>
                    </div>



                    <div className='flex flex-wrap gap-y-4 md:flex-nowrap md:gap-y-0'>
                        <div className='flex items-center border-r border-[#E8E6E0]
                            gap-2 pr-4 sm:pr-6 md:gap-[5px] md:pr-6 lg:gap-1.5 lg:pr-[29px] xl:gap-2 xl:pr-10'>
                            <CalendarDays color='#96E2B5' className='shrink-0 w-5 h-5 md:w-[14px] md:h-[14px] lg:w-[17px] lg:h-[17px] xl:w-6 xl:h-6' />
                            <div>
                                <p className='text-[#96E2B5] text-xs md:text-[10px] lg:text-[12px] xl:text-base'>DATE</p>
                                <p className='text-white font-medium text-sm sm:text-base md:text-[11px] lg:text-[13px] xl:text-lg'>{formatDateTime(eventDateTime, "PP")}</p>
                            </div>
                        </div>
                        <div className='flex items-center border-r border-[#E8E6E0]
                            gap-2 px-4 sm:px-6 md:gap-[5px] md:px-6 lg:gap-1.5 lg:px-[29px] xl:gap-2 xl:px-10'>
                            <Clock color='#96E2B5' className='shrink-0 w-5 h-5 md:w-[14px] md:h-[14px] lg:w-[17px] lg:h-[17px] xl:w-6 xl:h-6' />
                            <div>
                                <p className='text-[#96E2B5] text-xs md:text-[10px] lg:text-[12px] xl:text-base'>TIME</p>
                                <p className='text-white font-medium text-sm sm:text-base md:text-[11px] lg:text-[13px] xl:text-lg'>{formatDateTime(eventDateTime, "p")}</p>
                            </div>
                        </div>
                        <div className='flex items-center border-[#E8E6E0]
                            gap-2 pl-4 sm:pl-6 md:gap-[5px] md:pl-6 lg:gap-1.5 lg:pl-[29px] xl:gap-2 xl:pl-10'>
                            <MapPinIcon color='#96E2B5' className='shrink-0 w-5 h-5 md:w-[14px] md:h-[14px] lg:w-[17px] lg:h-[17px] xl:w-6 xl:h-6' />
                            <div>
                                <p className='text-[#96E2B5] text-xs md:text-[10px] lg:text-[12px] xl:text-base'>ENTRY</p>
                                <p className='text-white font-medium text-sm sm:text-base md:text-[11px] lg:text-[13px] xl:text-lg'>{eventEntrance}</p>
                            </div>
                        </div>

                    </div>


                    <div className='flex gap-2 md:gap-[5px] lg:gap-1.5 xl:gap-2'>
                        <MapPinIcon color='#96E2B5' className='shrink-0 w-[18px] h-[18px] md:w-[11px] md:h-[11px] lg:w-[13px] lg:h-[13px] xl:w-[18px] xl:h-[18px]' />
                        <p className='text-white text-sm md:text-[10px] lg:text-[12px] xl:text-base'>{eventVenue} • {holderName} • Admits {totalTickets}</p>
                    </div>

                </div>


                <div className='shadow-2xl flex flex-col items-center text-center justify-between
                    w-full mt-5 p-6 rounded-[14px] gap-5
                    md:w-[233px] md:mt-0 md:p-3 md:rounded-[5px] md:gap-0
                    lg:w-[286px] lg:p-[14px] lg:rounded-[6px]
                    xl:w-[397px] xl:p-5 xl:rounded-lg'>
                    <div>

                        <div className='rounded-full border
                            px-5 py-1.5 mb-3
                            md:px-[14px] md:py-[2px] md:mb-[5px]
                            lg:px-[17px] lg:py-[3px] lg:mb-1.5
                            xl:px-6 xl:py-1 xl:mb-2'>
                            <p className='text-[#0F6E56] text-sm md:text-[10px] lg:text-[12px] xl:text-base'>ADMITS {totalTickets}</p>
                        </div>

                        <div>

                            <img src={qrCode} alt="" className='w-[150px] h-[150px] sm:w-[170px] sm:h-[170px] md:w-[88px] md:h-[88px] lg:w-[108px] lg:h-[108px] xl:w-[150px] xl:h-[150px]' />
                        </div>
                    </div>

                    <div className=''>
                        <p className='text-[#4A4451] text-sm md:text-[10px] lg:text-[12px] xl:text-base'>TICKET ID</p>

                        <p className='font-space font-bold text-[#1A1523] text-2xl md:text-[14px] lg:text-[17px] xl:text-2xl'>{ticketId}</p>

                        <p className='font-space text-[#0F6E56] text-xs md:text-[9px] lg:text-[10px] xl:text-xs'>{orderID}</p>
                        <p className='italic text-xs py-2 md:text-[9px] md:py-1 lg:text-[10px] lg:py-1.5 xl:text-xs xl:py-2'>Non-transferable</p>

                        <p className='text-[#0F6E56] text-sm md:text-[9px] lg:text-[11px] xl:text-sm'>Eventra</p>
                    </div>

                </div>

            </div>

            {/* FOOTER */}
            <div className='flex flex-col sm:flex-row sm:justify-between gap-5 sm:gap-4
                mt-8 md:mt-6 lg:mt-8 xl:mt-10'>
                <div className="flex items-center gap-2">
                    <img src={shieldTick} alt="" className="shrink-0 w-5 h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                    <p className="text-[#4A4451] text-sm md:text-[12px] xl:text-sm">{refundPolicy.note}</p>
                </div>

                <div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-5 xl:gap-7">
                        <PaymentBtn
                            icon={calendar}
                            editIcon={"w-[18px] h-[18px] md:w-[14px] md:h-[14px] xl:w-[18px] xl:h-[18px]"}
                            text={"Add to calender"}
                            classname="h-11 w-full text-sm sm:w-[145px] md:h-9 md:text-[12px] lg:w-[165px] lg:text-[13px] xl:h-10 xl:w-45 xl:text-base"
                            arrow={rightArrow}
                            editArrow={"w-[18px] h-[18px] md:w-[14px] md:h-[14px] xl:w-[18px] xl:h-[18px]"}
                        />
                        <PaymentBtn
                            icon={backward}
                            editIcon={"w-[18px] h-[18px] md:w-[14px] md:h-[14px] xl:w-[18px] xl:h-[18px]"}
                            text={"Request refund"}
                            classname="h-11 w-full text-sm sm:w-[145px] md:h-9 md:text-[12px] lg:w-[165px] lg:text-[13px] xl:h-10 xl:w-45 xl:text-base border-[#BE2525] text-[#BE2525] hover:bg-[#BE2525]"
                            arrow={rightArrow}
                            editArrow={"w-[18px] h-[18px] md:w-[14px] md:h-[14px] xl:w-[18px] xl:h-[18px]"}

                        />
                    </div>
                </div>

            </div>
        </div>
    )
}

export default TicketComponent
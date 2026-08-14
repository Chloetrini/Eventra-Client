import checkbox from '@/assets/checkbox.png'



export const GoodToKnow = ({ items }: { items: string[] }) => {
  return (
    <section>
      <h2 className="text-xl font-bold pb-1">Good to know</h2>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
            <img className='h-4 w-4' src={checkbox} alt=""/>
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
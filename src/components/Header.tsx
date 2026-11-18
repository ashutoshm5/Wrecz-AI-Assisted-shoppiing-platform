const links = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Help center', href: '#help' },
]

export default function Header() {
  return (
    <header id="top" className="flex flex-col items-center gap-8 px-5 pt-12">
      <a href="#top" className="flex items-center gap-[22px]" aria-label="Wrecz home">
        <img src="/assets/e7ae5.svg" alt="Wrecz" width={150.438} height={38.15} />
        <img src="/assets/5abfb.svg" alt="" width={1.3625} height={52.4562} />
        <span className="text-[16.35px] leading-[0.803]">
          Authorized
          <br />
          Premium reseller
        </span>
      </a>
      <nav className="w-full max-w-[512px] rounded-[59px] border border-black">
        <ul className="flex h-[48px] items-center justify-around px-4 text-[15px] leading-[1.021] sm:justify-center sm:gap-[38px] sm:text-[19px]">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all hover:after:w-full">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

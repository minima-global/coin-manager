import { useContext } from "react"
import ModeToggle from "../mode-toggle"
import { appContext } from "@/AppContext"
import { Link } from "@tanstack/react-router"
import TitleBar from "./title-bar"

const Header = () => {
  const { topBlock } = useContext(appContext)

  return (
    <>
      <TitleBar />
      <header className="h-[64px] lg:h-[84px]">
        <div
          className={`h-full  border-[hsla(0, 0%, 100%, 1)] flex items-center border-b bg-white px-5 transition-all dark:bg-black header-border`}
        >
          <div className="container relative z-50 mx-auto">
            <div className="grid w-full grid-cols-12">
              <div className="col-span-4 flex items-center">
                <div className="flex items-center gap-5 text-xs">
                  <Link to="/">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="42"
                      fill="none"
                      viewBox="0 0 40 42"
                      className={`fill-black transition-all dark:fill-white`}
                    >
                      <clipPath id="a">
                        <path d="M0 .47h40V42H0z"></path>
                      </clipPath>
                      <g clipPath="url(#a)">
                        <path
                          className="fill-black dark:fill-white"
                          d="M37.346 21.234c0-1.312-.146-2.591-.422-3.82l3.077-1.776a20.75 20.75 0 0 0-5.158-8.923L31.767 8.49a17.3 17.3 0 0 0-6.613-3.824V1.115C23.506.694 21.78.471 20 .471s-3.506.224-5.153.644v3.552a17.3 17.3 0 0 0-6.613 3.824L5.159 6.715A20.75 20.75 0 0 0 0 15.638l3.077 1.776a17.454 17.454 0 0 0 0 7.641L0 26.831a20.75 20.75 0 0 0 5.159 8.923l3.076-1.776a17.3 17.3 0 0 0 6.613 3.824v3.552c1.647.42 3.374.644 5.153.644s3.505-.224 5.153-.644v-3.552a17.3 17.3 0 0 0 6.613-3.824l3.076 1.776A20.75 20.75 0 0 0 40 26.831l-3.077-1.776a17.4 17.4 0 0 0 .422-3.82m-10.012 9.67a12.1 12.1 0 0 1-2.627 1.521c-1.447.61-3.038.947-4.706.947s-3.26-.338-4.707-.947a12 12 0 0 1-2.627-1.52A12.13 12.13 0 0 1 7.96 19.717a12.13 12.13 0 0 1 4.708-8.153 12.1 12.1 0 0 1 2.627-1.52c1.447-.61 3.038-.947 4.707-.947s3.26.338 4.706.947c.943.397 1.825.91 2.627 1.52a12.14 12.14 0 0 1 4.516 7.05h-5.44a6.95 6.95 0 0 0-3.725-3.766 6.9 6.9 0 0 0-2.686-.54 6.9 6.9 0 0 0-4.185 1.407 6.92 6.92 0 0 0-2.686 6.384 6.91 6.91 0 0 0 2.686 4.652A6.9 6.9 0 0 0 20 28.158a6.91 6.91 0 0 0 6.411-4.305h5.44a12.14 12.14 0 0 1-4.516 7.049z"
                        ></path>
                      </g>
                    </svg>
                  </Link>
                  <div className="mt-1">
                    <span className="flex">
                      <div className="gradient-border flex items-center bg-white -mt-0.5 lg:mt-0 text-[11px] lg:text-xs text-black dark:bg-black dark:text-white">
                        <span className="hidden md:block">Block</span>
                        {!topBlock && (
                          <div className="skele skele--light ml-2 h-[14px] w-[43px]" />
                        )}
                        {topBlock && (
                          <span className="md:ml-1 font-bold text-orange dark:text-lightOrange">
                            {topBlock}
                          </span>
                        )}
                      </div>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-span-8 flex items-center justify-end">
                <nav className="cursor-pointer lg:block">
                  <div className="flex items-center gap-4">
                    <Link to="/">
                      <HomeIcon />
                    </Link>
                    <Link to="/">
                      <InfoIcon />
                    </Link>
                    <ModeToggle />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header

const HomeIcon = () => {
  return (
    <div className={`gap-3 lg:gap-4 flex items-center text-sm transition-all`}>
      <div className="hidden iphone:block">
        <div
          className={`relative flex h-[32px] w-[32px] lg:h-[44px] lg:w-[44px] scale-100 items-center justify-center rounded-full border border-grey80 bg-white from-[#17191C] to-[#37393F] transition-all duration-75 hover:bg-grey10 active:scale-75 dark:border-mediumDarkContrast dark:bg-darkContrast dark:hover:bg-transparent dark:hover:bg-gradient-to-t`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <mask
              id="mask0_5439_38181"
              width="24"
              height="24"
              x="0"
              y="0"
              maskUnits="userSpaceOnUse"
              style={{ maskType: "alpha" }}
            >
              <path fill="#D9D9D9" d="M0 0h24v24H0z"></path>
            </mask>
            <g mask="url(#mask0_5439_38181)">
              <path
                className="fill-black dark:fill-white"
                d="M4.5 20.5V9.25L12 3.605l7.5 5.645V20.5h-5.596v-6.693h-3.808V20.5z"
              ></path>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}

const InfoIcon = () => {
  return (
    <div className={`gap-3 lg:gap-4 flex items-center text-sm transition-all`}>
      <div className="hidden iphone:block">
        <div
          className={`relative flex h-[32px] w-[32px] lg:h-[44px] lg:w-[44px] scale-100 items-center justify-center rounded-full border border-grey80 bg-white from-[#17191C] to-[#37393F] transition-all duration-75 hover:bg-grey10 active:scale-75 dark:border-mediumDarkContrast dark:bg-darkContrast dark:hover:bg-transparent dark:hover:bg-gradient-to-t`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <mask
              id="mask0_5439_37651"
              width="24"
              height="24"
              x="0"
              y="0"
              maskUnits="userSpaceOnUse"
              style={{ maskType: "alpha" }}
            >
              <path fill="#D9D9D9" d="M0 0h24v24H0z"></path>
            </mask>
            <g mask="url(#mask0_5439_37651)">
              <path
                className="fill-black dark:fill-white"
                fill="#E9E9EB"
                d="M11.25 16.75h1.5V11h-1.5zM12 9.289q.343 0 .575-.233a.78.78 0 0 0 .233-.575.78.78 0 0 0-.232-.576.78.78 0 0 0-.576-.232.78.78 0 0 0-.575.232.78.78 0 0 0-.233.576q0 .343.232.575A.78.78 0 0 0 12 9.29m.002 12.211a9.3 9.3 0 0 1-3.706-.748 9.6 9.6 0 0 1-3.016-2.03 9.6 9.6 0 0 1-2.032-3.016 9.25 9.25 0 0 1-.748-3.704q0-1.972.748-3.706a9.6 9.6 0 0 1 2.03-3.016 9.6 9.6 0 0 1 3.016-2.032 9.25 9.25 0 0 1 3.704-.748q1.972 0 3.706.748a9.6 9.6 0 0 1 3.017 2.03 9.6 9.6 0 0 1 2.03 3.016 9.25 9.25 0 0 1 .749 3.704q0 1.972-.748 3.706a9.6 9.6 0 0 1-2.03 3.017 9.6 9.6 0 0 1-3.016 2.03 9.25 9.25 0 0 1-3.704.749M12 20q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4 6.325 6.325 4 12t2.325 5.675T12 20"
              ></path>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}

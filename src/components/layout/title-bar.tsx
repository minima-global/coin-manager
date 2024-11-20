import * as React from "react"
import useAndroidShowTitleBar from "@/hooks/android-title-bar"

const TitleBar = () => {
  const { openTitleBar, isMinimaBrowser } = useAndroidShowTitleBar()

  const goHome = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    window.location.assign("/")
  }

  if (!isMinimaBrowser) return null

  return (
    <div
      id="title-bar"
      className="py-4 flex items-center  text-white border-b border-gray-100 dark:border-gray-900 dark:bg-black"
      onClick={openTitleBar}
    >
      <div className=" w-full">
        <div className="flex  items-center gap-2 ml-4">
          <div onClick={goHome}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
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
          </div>
          <span className=" dark:text-white text-black">My Coins</span>
        </div>
        <div className="col-span-6 flex items-center justify-end"></div>
      </div>
    </div>
  )
}

export default TitleBar

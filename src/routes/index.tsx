import { useMinima } from "@/hooks/use-minima";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import CheckmarkIcon from "@/components/ui/icons";
import { Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { validateToken } from "@/lib/minima/mds-functions";
import {
  fetchIPFSImageUri,
  makeTokenImage,
} from "@/lib/minima/make-token-image";
import { LockIcon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: TokenManager,
  beforeLoad: () => {
    if (!localStorage.getItem("hasSeenSplash")) {
      return redirect({ to: "/info" });
    }
    const url = new URL(window.location.href);
    if (url.searchParams.has("tab") || url.searchParams.has("search")) {
      url.searchParams.delete("tab");
      url.searchParams.delete("search");
      window.history.replaceState({}, "", url.toString());
    }
  },
});

interface TokenValidationStatus {
  [tokenId: string]: boolean;
}

export default function TokenManager() {
  const { balance } = useMinima();

  const [validationStatus, setValidationStatus] =
    useState<TokenValidationStatus>({});

  const [processedUrls, setProcessedUrls] = useState<{
    [tokenId: string]: string;
  }>({});

  useEffect(() => {
    const validateTokens = async () => {
      if (balance?.response) {
        const validationResults: TokenValidationStatus = {};

        for (const token of balance.response) {
          const isValid = await validateToken(token.tokenid);
          validationResults[token.tokenid] = isValid;
        }

        setValidationStatus(validationResults);
      }
    };

    validateTokens();
  }, [balance]);

  useEffect(() => {
    const processTokenUrls = async () => {
      if (balance?.response) {
        const urlResults: { [tokenId: string]: string } = {};

        for (const token of balance.response) {
          if (
            typeof token.token === "object" &&
            "url" in token.token &&
            token.token.url
          ) {
            let url = decodeURIComponent(token.token.url);
            if (url.startsWith("<artimage>", 0)) {
              url = makeTokenImage(url, token.tokenid) || url;
            } else if (url.startsWith("https://ipfs.io/ipns/")) {
              url = (await fetchIPFSImageUri(url)) || url;
            }
            urlResults[token.tokenid] = url;
          } else {
            urlResults[token.tokenid] = `https://robohash.org/${token.tokenid}`;
          }
        }

        setProcessedUrls(urlResults);
      }
    };

    processTokenUrls();
  }, [balance]);

  const tokenNameStyle =
    "font-bold truncate text-neutral-600 dark:text-neutral-400";
  const tokenAmountStyle =
    "font-bold truncate text-neutral-800 dark:text-neutral-300 max-w-[150px]";

  return (
    <div className="w-full ">
      <h1 className="text-2xl font-bold mb-4">Tokens</h1>

      <div className="grid gap-4 w-full">
        {balance?.response.map((token) => (
          <Fragment key={token.tokenid}>
            {token.tokenid === "0x00" ? (
              <Link
                to="/tokens/$tokenId"
                params={{ tokenId: token.tokenid }}
                className="cursor-pointer bg-grey10 dark:bg-darkContrast relative w-full flex items-center p-3 rounded z-[50]"
              >
                <div className="w-[48px] h-[48px] border border-darkConstrast dark:border-grey80 rounded overflow-hidden">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="48" height="48" fill="white" />
                    <path
                      d="M32.4428 16.759L31.2053 22.2329L29.6226 15.6286L24.0773 13.3795L22.578 19.9957L21.2571 12.2371L15.7119 10L10 35.2512H16.0569L17.8062 27.4926L19.1271 35.2512H25.1959L26.6834 28.6349L28.266 35.2512H34.323L38 18.9962L32.4428 16.759Z"
                      fill="black"
                    />
                  </svg>
                </div>
                <div className="overflow-hidden px-4">
                  <div className="flex">
                    <h6 className={tokenNameStyle}>Minima</h6>
                    {validationStatus[token.tokenid] && (
                      <div className="!text-blue-500 my-auto ml-1">
                        <CheckmarkIcon fill="currentColor" size={16} />
                      </div>
                    )}
                  </div>

                  <p className={tokenAmountStyle}>{token.confirmed}</p>
                </div>

                <div className="flex items-center justify-end flex-1">
                  <div className="flex items-center justify-end flex-1">
                    {Number(token.confirmed) - Number(token.sendable) > 0 && (
                      <LockIcon className="text-[#91919D] mr-2" size={16} />
                    )}

                    {Number(token.confirmed) - Number(token.sendable) > 0 && (
                      <p className="text-[#91919D] text-xs">
                        {Number(token.confirmed) - Number(token.sendable)}
                      </p>
                    )}
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <mask
                      id="mask0_5387_25757"
                      width="20"
                      height="20"
                      x="0"
                      y="0"
                      maskUnits="userSpaceOnUse"
                      style={{ maskType: "alpha" }}
                    >
                      <path fill="#D9D9D9" d="M0 20V0h20v20z"></path>
                    </mask>
                    <g mask="url(#mask0_5387_25757)">
                      <path
                        fill="#91919D"
                        d="m13.063 10-5 5L7 13.938 10.938 10 7 6.063 8.063 5z"
                      ></path>
                    </g>
                  </svg>
                </div>
              </Link>
            ) : (
              <Link
                to="/tokens/$tokenId"
                params={{ tokenId: token.tokenid }}
                className="cursor-pointer bg-grey10 dark:bg-darkContrast relative w-full flex items-center p-3 rounded z-[50]"
              >
                <div className="aspect-square w-12 h-12 overflow-hidden">
                  <img
                    alt="token-icon"
                    src={
                      processedUrls[token.tokenid] ||
                      `https://robohash.org/${token.tokenid}`
                    }
                    className="border-grey80 dark:border-mediumDarkContrast border rounded w-full h-full"
                  />
                </div>

                <div className="overflow-hidden flex flex-col items-start justify-center px-4 ">
                  <div className="flex">
                    <h6 className={tokenNameStyle}>
                      {typeof token.token === "object" &&
                      "name" in token.token &&
                      typeof token.token.name === "string"
                        ? token.token.name
                        : "N/A"}
                    </h6>
                    {validationStatus[token.tokenid] && (
                      <div className="!text-blue-500 my-auto ml-1">
                        <CheckmarkIcon fill="currentColor" size={16} />
                      </div>
                    )}
                  </div>
                  <p className={tokenAmountStyle}>
                    {token.confirmed.includes(".")
                      ? token.confirmed.split(".")[0] +
                        "." +
                        token.confirmed.split(".")[1].slice(0, 2)
                      : token.confirmed}
                  </p>
                </div>

                <div className="flex items-center justify-end flex-1">
                  {Number(token.confirmed) - Number(token.sendable) > 0 && (
                    <LockIcon className="text-[#91919D] mr-2" size={16} />
                  )}

                  {Number(token.confirmed) - Number(token.sendable) > 0 && (
                    <p className="text-[#91919D] text-xs">
                      {Number(token.confirmed) - Number(token.sendable)}
                    </p>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <mask
                      id="mask0_5387_25757"
                      width="20"
                      height="20"
                      x="0"
                      y="0"
                      maskUnits="userSpaceOnUse"
                      style={{ maskType: "alpha" }}
                    >
                      <path fill="#D9D9D9" d="M0 20V0h20v20z"></path>
                    </mask>
                    <g mask="url(#mask0_5387_25757)">
                      <path
                        fill="#91919D"
                        d="m13.063 10-5 5L7 13.938 10.938 10 7 6.063 8.063 5z"
                      ></path>
                    </g>
                  </svg>
                </div>
              </Link>
            )}
          </Fragment>
        ))}
      </div>

      <div className="absolute bottom-0 right-0 mr-10 z-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1123"
          height="607"
          fill="none"
          viewBox="0 0 1123 607"
        >
          <g opacity="0.3">
            <g filter="url(#filter0_f_5457_6559)">
              <ellipse
                cx="617.286"
                cy="721.516"
                fill="url(#paint0_linear_5457_6559)"
                rx="379.286"
                ry="427.441"
              ></ellipse>
            </g>
            <g filter="url(#filter1_f_5457_6559)">
              <path
                fill="url(#paint1_linear_5457_6559)"
                d="m741.282 179 330.578 645.271H410.705z"
              ></path>
            </g>
          </g>
          <defs>
            <linearGradient
              id="paint0_linear_5457_6559"
              x1="316.41"
              x2="929.261"
              y1="352.985"
              y2="1078.48"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6100FF"></stop>
              <stop offset="1" stopColor="#0FF" stopOpacity="0"></stop>
            </linearGradient>
            <linearGradient
              id="paint1_linear_5457_6559"
              x1="741.282"
              x2="741.282"
              y1="179"
              y2="1039.36"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#50F"></stop>
              <stop offset="1" stopColor="#00A3FF" stopOpacity="0"></stop>
            </linearGradient>
            <filter
              id="filter0_f_5457_6559"
              width="1233.32"
              height="1329.63"
              x="0.627"
              y="56.702"
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                result="effect1_foregroundBlur_5457_6559"
                stdDeviation="118.687"
              ></feGaussianBlur>
            </filter>
            <filter
              id="filter1_f_5457_6559"
              width="1017.21"
              height="1001.33"
              x="232.675"
              y="0.97"
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
              <feBlend
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              ></feBlend>
              <feGaussianBlur
                result="effect1_foregroundBlur_5457_6559"
                stdDeviation="89.015"
              ></feGaussianBlur>
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

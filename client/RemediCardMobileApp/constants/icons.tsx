import * as React from "react"
import Svg, { Path } from "react-native-svg"
 
export function LockIcon() {
    return (
      <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
      >
        <Path
          d="M8 11V7c0-1.333.8-4 4-4s4 2.667 4 4v4m-8 0H5v10h14V11h-3m-8 0h8"
          stroke="#000"
          strokeOpacity={0.25}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    )
}

export function MailIcon() {
    return (
      <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
      >
        <Path
          d="M3.293 5.293A.997.997 0 014 5h16c.276 0 .526.112.707.293m-17.414 0A.997.997 0 003 6v12a1 1 0 001 1h16a1 1 0 001-1V6a.997.997 0 00-.293-.707m-17.414 0l7.293 7.293a2 2 0 002.828 0l7.293-7.293"
          stroke="#000"
          strokeOpacity={0.25}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    )
  }

  export function GoogleIcon() {
    return (
      <Svg
        width={25}
        height={25}
        viewBox="0 0 25 25"
        fill="none"
      >
        <Path
          d="M22.305 10.541H21.5V10.5h-9v4h5.651a5.998 5.998 0 01-11.651-2 6 6 0 016-6c1.53 0 2.921.577 3.98 1.52L19.31 5.19A9.954 9.954 0 0012.5 2.5c-5.522 0-10 4.478-10 10 0 5.523 4.478 10 10 10 5.523 0 10-4.477 10-10 0-.67-.069-1.325-.195-1.959z"
          fill="#FFC107"
        />
        <Path
          d="M3.653 7.846l3.286 2.409A5.997 5.997 0 0112.5 6.5c1.53 0 2.921.577 3.98 1.52L19.31 5.19A9.954 9.954 0 0012.5 2.5a9.994 9.994 0 00-8.847 5.346z"
          fill="#FF3D00"
        />
        <Path
          d="M12.5 22.5c2.583 0 4.93-.988 6.704-2.596l-3.095-2.619A5.95 5.95 0 0112.5 18.5a5.997 5.997 0 01-5.642-3.973l-3.26 2.513c1.654 3.238 5.015 5.46 8.902 5.46z"
          fill="#4CAF50"
        />
        <Path
          d="M22.305 10.541H21.5V10.5h-9v4h5.651a6.02 6.02 0 01-2.043 2.785h.002l3.095 2.619c-.22.198 3.295-2.404 3.295-7.404 0-.67-.069-1.325-.195-1.959z"
          fill="#1976D2"
        />
      </Svg>
    )
  }

 export function EyeOpenIcon() {
    return (
      <Svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
      >
        <Path
          d="M10 4.167C4.697 4.167 1.667 10 1.667 10s3.03 5.833 8.333 5.833c5.303 0 8.333-5.833 8.333-5.833S15.303 4.167 10 4.167z"
          stroke="#000"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
          stroke="#000"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    )
  }

 export function EyeClosedIcon() {
    return (
      <Svg
        width={20}
        height={20}
        viewBox="0 0 20 20"
        fill="none"
      >
        <Path
          d="M16.667 12.361C17.757 11.11 18.333 10 18.333 10S15.303 4.167 10 4.167a7.162 7.162 0 00-1.667.196M2.5 2.5l3.099 3.099m0 0C3.056 7.326 1.667 10 1.667 10s3.03 5.833 8.333 5.833c1.713 0 3.188-.608 4.401-1.432M5.6 5.6l2.633 2.633m0 0a2.5 2.5 0 003.536 3.536M8.232 8.232l3.536 3.536m0 0L14.4 14.4m0 0L17.5 17.5"
          stroke="#000"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    )
  }
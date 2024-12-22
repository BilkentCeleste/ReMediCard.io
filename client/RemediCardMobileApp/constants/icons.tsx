import * as React from "react"
import Svg, { Rect, G, Path, Defs, ClipPath } from "react-native-svg"
 
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


interface MailIcoProps {
  color?: string; // Optional color prop
}

export function MailIcon({ color = "#000" }: MailIcoProps) {
    return (
      <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
      >
        <Path
          d="M3.293 5.293A.997.997 0 014 5h16c.276 0 .526.112.707.293m-17.414 0A.997.997 0 003 6v12a1 1 0 001 1h16a1 1 0 001-1V6a.997.997 0 00-.293-.707m-17.414 0l7.293 7.293a2 2 0 002.828 0l7.293-7.293"
          stroke={color}
          strokeOpacity={0.5}
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

  interface AtIconProps {
    color?: string; // Optional color prop
  }

  export function AtIcon({ color = "#000" }: AtIconProps) {
    return (
      <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"

      >
        <Path
          d="M15.857 12a3.857 3.857 0 11-7.714 0 3.857 3.857 0 017.714 0zm0 0v1.286a2.571 2.571 0 005.143 0V12a9 9 0 10-3.857 7.387"
          stroke={color}
          strokeOpacity={0.5}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    )
  }

  export function FlashcardIcon() {
    return (
      <Svg
        width={70}
        height={70}
        viewBox="0 0 70 70"
        fill="none"
      >
        <Path
          d="M5.833 24.792H44.45M17.5 48.125h3.762m10.821 0h10.209M23.275 59.792h27.942c10.383 0 12.95-2.567 12.95-12.805V20.096m-5.863-9.159c-1.808-.524-4.142-.729-7.087-.729H18.783c-10.354 0-12.95 2.567-12.95 12.804v23.946c0 6.825 1.138 10.238 4.988 11.755m53.346-52.88L5.833 64.167"
          stroke="#292D32"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    )
  }

export function QuizIcon() {
  return (
    <Svg
      width={70}
      height={70}
      viewBox="0 0 70 70"
      fill="none"
    >
      <Path
        d="M35 62.868H17.5a7 7 0 01-7-7v-42a7 7 0 017-7H49a7 7 0 017 7v12.25M45.5 46.704c0-3.782 3.135-6.848 7-6.848 3.867 0 7 3.066 7 6.848s-3.133 6.848-7 6.848m0 9.58v-.263m-29.75-42h21m-21 10.5h21m-21 10.5h10.5"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function GoalsIcon() {
  return (
    <Svg
      width={70}
      height={70}
      viewBox="0 0 70 70"
      fill="none"
    >
      <Path
        d="M19.317 52.938a.75.75 0 001.5 0h-1.5zm1.5-6.038a.75.75 0 00-1.5 0h1.5zm13.433 6.038a.75.75 0 001.5 0h-1.5zm1.5-12.076a.75.75 0 00-1.5 0h1.5zm13.433 12.075a.75.75 0 001.5 0h-1.5zm1.5-18.141a.75.75 0 10-1.5 0h1.5zm-.75-17.733h.75v-.75h-.75v.75zm-1.341 1.575l.57.487v-.001l-.57-.486zM19.885 35.526a.75.75 0 10.363 1.456l-.363-1.456zm21.503-19.214a.75.75 0 000 1.5v-1.5zm7.795 9.267a.75.75 0 101.5 0h-1.5zM20.817 52.937V46.9h-1.5v6.038h1.5zm14.933 0V40.862h-1.5v12.075h1.5zm14.933 0V34.797h-1.5v18.142h1.5zm-1.32-36.36L48.02 18.15l1.142.973 1.341-1.575-1.142-.973zm-1.341 1.573a54.322 54.322 0 01-28.137 17.376l.363 1.456a55.822 55.822 0 0028.913-17.857l-1.14-.975zm-6.634-.337h8.545v-1.5h-8.545v1.5zm7.795-.75v8.516h1.5v-8.517h-1.5zM26.25 64.916h17.5v-1.5h-17.5v1.5zm17.5 0c7.366 0 12.717-1.469 16.207-4.96 3.491-3.49 4.96-8.841 4.96-16.207h-1.5c0 7.218-1.449 12.075-4.52 15.147-3.072 3.072-7.93 4.52-15.147 4.52v1.5zM64.917 43.75v-17.5h-1.5v17.5h1.5zm0-17.5c0-7.366-1.469-12.717-4.96-16.207-3.49-3.491-8.841-4.96-16.207-4.96v1.5c7.218 0 12.075 1.448 15.147 4.52 3.072 3.072 4.52 7.93 4.52 15.147h1.5zM43.75 5.083h-17.5v1.5h17.5v-1.5zm-17.5 0c-7.366 0-12.717 1.469-16.207 4.96-3.491 3.49-4.96 8.841-4.96 16.207h1.5c0-7.218 1.448-12.075 4.52-15.147 3.072-3.072 7.93-4.52 15.147-4.52v-1.5zM5.083 26.25v17.5h1.5v-17.5h-1.5zm0 17.5c0 7.366 1.469 12.717 4.96 16.207 3.49 3.491 8.841 4.96 16.207 4.96v-1.5c-7.218 0-12.075-1.449-15.147-4.52-3.072-3.072-4.52-7.93-4.52-15.147h-1.5z"
        fill="#292D32"
      />
    </Svg>
  )
}

export function CreateIcon() {
  return (
    <Svg
      width={70}
      height={70}
      viewBox="0 0 70 70"
      fill="none"
    >
      <Path
        d="M42.292 51.042h17.5m-8.75 8.75v-17.5M64.167 24.12V12.338c0-4.638-1.867-6.505-6.505-6.505H45.88c-4.637 0-6.504 1.867-6.504 6.505V24.12c0 4.637 1.867 6.504 6.504 6.504h11.784c4.637 0 6.504-1.867 6.504-6.504zm-33.542.729V11.608c0-4.112-1.867-5.775-6.504-5.775H12.338c-4.638 0-6.505 1.663-6.505 5.775v13.213c0 4.141 1.867 5.775 6.505 5.775H24.12c4.637.029 6.504-1.634 6.504-5.746zm0 32.813V45.879c0-4.637-1.867-6.504-6.504-6.504H12.338c-4.638 0-6.505 1.867-6.505 6.504v11.784c0 4.637 1.867 6.504 6.505 6.504H24.12c4.637 0 6.504-1.867 6.504-6.505z"
        stroke="#292D32"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function HomeIcon() {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
    >
      <Path
        d="M8.333 17.167L20 5.5l11.667 11.667v16.666H8.333V17.167z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function ProfileIcon() {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
    >
      <Path
        d="M7 33.5c.574-.642 4.43-3.67 6.346-5.163a3.962 3.962 0 012.44-.837h8.411c.895 0 1.76.305 2.48.836C29.153 30.16 31.473 31.518 34 33.5m-24 3h20a6 6 0 006-6v-20a6 6 0 00-6-6H10a6 6 0 00-6 6v20a6 6 0 006 6zm15.73-20.547c0-3.052-2.576-5.546-5.73-5.546-3.154 0-5.73 2.494-5.73 5.546 0 3.053 2.576 5.547 5.73 5.547 3.154 0 5.73-2.494 5.73-5.547z"
        stroke="#fff"
        strokeWidth={2}
      />
    </Svg>
  )
}

export function SettingsIcon() {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
    >
      <Path
        clipRule="evenodd"
        d="M22.794 7.194c-.713-2.925-4.875-2.925-5.588 0A2.873 2.873 0 0112.92 8.97c-2.573-1.567-5.517 1.377-3.95 3.95a2.875 2.875 0 01-1.775 4.287c-2.927.711-2.927 4.875 0 5.584a2.872 2.872 0 011.776 4.288c-1.568 2.573 1.376 5.517 3.949 3.95a2.872 2.872 0 014.288 1.775c.71 2.927 4.875 2.927 5.584 0a2.874 2.874 0 014.288-1.776c2.573 1.568 5.517-1.376 3.95-3.949a2.875 2.875 0 011.775-4.288c2.927-.71 2.927-4.875 0-5.584a2.871 2.871 0 01-1.776-4.288c1.568-2.572-1.376-5.516-3.949-3.949a2.872 2.872 0 01-4.288-1.775l.002-.002z"
        stroke="#fff"
        strokeWidth={2}
      />
      <Path
        d="M23.333 20a3.333 3.333 0 11-6.666 0 3.333 3.333 0 016.666 0z"
        stroke="#fff"
        strokeWidth={2}
      />
    </Svg>
  )
}

export function EditProfileIcon() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M18.7 16.25c.3 1.08 1.14 1.92 2.22 2.22M3.41 22c0-3.87 3.85-7 8.59-7 1.04 0 2.04.15 2.97.43M17 7A5 5 0 117 7a5 5 0 0110 0zm2.21 8.74l-3.54 3.54c-.14.14-.27.4-.3.59l-.19 1.35c-.07.49.27.83.76.76l1.35-.19c.19-.03.46-.16.59-.3l3.54-3.54c.61-.61.9-1.32 0-2.22-.89-.89-1.6-.6-2.21.01z"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function SubscriptionIcon() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M3 9.3h18M6.6 13.5h3M4.8 5.1h14.4a2.4 2.4 0 012.4 2.4V16.5a2.4 2.4 0 01-2.4 2.399H4.8a2.4 2.4 0 01-2.4-2.4v-9a2.4 2.4 0 012.4-2.4z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function ContactIcon() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M12 11.36v-.21c0-.68.42-1.04.84-1.33.41-.28.82-.64.82-1.3 0-.92-.74-1.66-1.66-1.66-.92 0-1.66.74-1.66 1.66m1.655 5.23h.01M17 18.43h-4l-4.45 2.96A.997.997 0 017 20.56v-2.13c-3 0-5-2-5-5v-6c0-3 2-5 5-5h10c3 0 5 2 5 5v6c0 3-2 5-5 5z"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function LanguageIcon() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M8 3h1a28.424 28.424 0 000 18H8m7-18a28.424 28.424 0 010 18M3 16v-1a28.424 28.424 0 0018 0v1M3 9a28.424 28.424 0 0118 0m1 3c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function LogoutIcon() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M8.78 3.6H5.074c-.561 0-1.1.221-1.497.615s-.62.928-.62 1.485v12.6c0 .557.223 1.091.62 1.485.397.394.936.615 1.497.615H8.78m.263-8.4h12m0 0l-4.585-4.8m4.585 4.8l-4.585 4.8"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function FlagTR() {
  return (
    <Svg
      width={24}
      height={18}
      viewBox="0 0 24 18"
      fill="none"
    >
      <G clipPath="url(#clip0_33_657)" fillRule="evenodd" clipRule="evenodd">
        <Path d="M0 0h24v18H0V0z" fill="#E30A17" />
        <Path
          d="M15.262 9.281c0 2.483-2.047 4.496-4.575 4.496-2.527 0-4.575-2.013-4.575-4.5 0-2.486 2.048-4.492 4.575-4.492 2.528 0 4.575 2.014 4.575 4.496z"
          fill="#fff"
        />
        <Path
          d="M15.488 9.281c0 1.988-1.636 3.596-3.657 3.596s-3.66-1.612-3.66-3.6c0-1.987 1.639-3.592 3.66-3.592s3.66 1.609 3.66 3.596h-.003z"
          fill="#E30A17"
        />
        <Path
          d="M16.151 7.181l-.037 1.661-1.549.42 1.53.544-.037 1.527.993-1.193 1.508.525-.87-1.279 1.061-1.271-1.631.45-.968-1.388v.004z"
          fill="#fff"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_33_657">
          <Path fill="#fff" d="M0 0H24V18H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export function FlagUK() {
  return (
    <Svg
      width={30}
      height={24}
      viewBox="0 0 30 24"
      fill="none"
    >
      <Path
        stroke="#2916FF"
        strokeWidth={2.5}
        d="M1.75 1.75H28.25V22.25H1.75z"
      />
      <Path d="M3 3h24v18H3V3z" fill="#012169" />
      <Path
        d="M5.813 3l9.15 6.787L24.075 3H27v2.325l-9 6.712 9 6.675V21h-3l-9-6.713L6.037 21H3v-2.25l8.963-6.675L3 5.4V3h2.813z"
        fill="#fff"
      />
      <Path
        d="M18.9 13.537L27 19.5V21l-10.163-7.463H18.9zm-6.9.75l.225 1.313-7.2 5.4H3l9-6.713zM27 3v.112l-9.337 7.05.075-1.65L25.125 3H27zM3 3l8.963 6.6h-2.25L3 4.575V3z"
        fill="#C8102E"
      />
      <Path d="M12.037 3v18h6V3h-6zM3 9v6h24V9H3z" fill="#fff" />
      <Path
        d="M3 10.238v3.6h24v-3.6H3zM13.238 3v18h3.6V3h-3.6z"
        fill="#C8102E"
      />
    </Svg>
  )
}

interface ChevronRightIconProps {
  color?: string; // Optional color prop
}

export function ChevronRightIcon({ color = "#fff" }: ChevronRightIconProps) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M10 7l5 5-5 5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function SearchIcon() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M20 20l-4.197-4.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        stroke="#000"
        strokeOpacity={0.25}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function CrossIcon() {
  return (
    <Svg
      width={70}
      height={70}
      viewBox="0 0 70 70"
      fill="none"
    >
      <Path
        d="M46.667 23.333L23.333 46.667m0-23.334l23.334 23.334M61.25 35c0 14.498-11.752 26.25-26.25 26.25C20.503 61.25 8.75 49.498 8.75 35 8.75 20.503 20.503 8.75 35 8.75c14.498 0 26.25 11.753 26.25 26.25z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function CheckmarkIcon() {
  return (
    <Svg
      width={70}
      height={70}
      viewBox="0 0 70 70"
      fill="none"
    >
      <Path
        d="M49.583 26.25L29.167 46.667l-8.75-8.75M61.25 35c0 14.498-11.752 26.25-26.25 26.25C20.503 61.25 8.75 49.498 8.75 35 8.75 20.503 20.503 8.75 35 8.75c14.498 0 26.25 11.753 26.25 26.25z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function ClockIcon() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M15.559 15.699a1 1 0 00.632-1.898L15.56 15.7zM12.5 13.625h-1a1 1 0 00.684.949l.316-.949zm1-4.704a1 1 0 10-2 0h2zm2.691 4.88l-3.375-1.125-.632 1.898 3.375 1.125.632-1.898zm-2.691-.176V8.921h-2v4.704h2zm7-1.125a8 8 0 01-8 8v2c5.523 0 10-4.477 10-10h-2zm-8 8a8 8 0 01-8-8h-2c0 5.523 4.477 10 10 10v-2zm-8-8a8 8 0 018-8v-2c-5.523 0-10 4.477-10 10h2zm8-8a8 8 0 018 8h2c0-5.523-4.477-10-10-10v2z"
        fill="#fff"
      />
    </Svg>
  )
}

interface EditIconProps {
  color?: string; // Optional color prop
}

export function EditIcon({ color = "#292D32" }: EditIconProps) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 30 30"
      fill="none"
    >
      <Path
        d="M13.75 2.5h-2.5C5 2.5 2.5 5 2.5 11.25v7.5C2.5 25 5 27.5 11.25 27.5h7.5c6.25 0 8.75-2.5 8.75-8.75v-2.5M18.637 5.187a8.93 8.93 0 006.175 6.176M20.05 3.775l-9.85 9.85c-.375.375-.75 1.113-.825 1.65l-.537 3.763c-.2 1.362.762 2.312 2.125 2.125l3.762-.538c.525-.075 1.263-.45 1.65-.825l9.85-9.85c1.7-1.7 2.5-3.675 0-6.175s-4.475-1.7-6.175 0z"
        stroke={color}
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function PlusIcon() {
  return (
    <Svg
      width={50}
      height={50}
      viewBox="0 0 50 50"
      fill="none"
    >
      <Path
        d="M25 14.583v20.834M14.583 25h20.834m8.333 0c0 10.355-8.395 18.75-18.75 18.75S6.25 35.355 6.25 25 14.645 6.25 25 6.25 43.75 14.645 43.75 25z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function UploadIcon() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M4 15.204v3.688c0 .56.21 1.096.586 1.49A1.95 1.95 0 006 21h12c.53 0 1.04-.222 1.414-.617.375-.395.586-.932.586-1.49v-3.689m-8-.261V3m0 0L7.43 7.563M12 3l4.572 4.563"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function DiscordIcon() {
  return (
    <Svg
      width={75}
      height={75}
      viewBox="0 0 75 75"
      fill="none"
    >
      <Rect x={0.5} width={75} height={75} rx={20} fill="#C8102E" />
      <Path
        d="M13 19.302h50M28.625 9.375h18.75M31.75 52.39V32.537m12.5 19.853V32.537m4.688 33.088H27.061c-3.451 0-6.25-2.963-6.25-6.618l-1.426-36.259c-.074-1.88 1.345-3.447 3.122-3.447h30.984c1.777 0 3.196 1.567 3.122 3.447l-1.426 36.26c0 3.654-2.799 6.617-6.25 6.617z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function SaveIcon() {
  return (
    <Svg
      width={75}
      height={75}
      viewBox="0 0 75 75"
      fill="none"
    >
      <Rect width={75} height={75} rx={20} fill="#4CAF50" />
      <Path
        d="M21.68 62.11V46.29a3.516 3.516 0 013.515-3.517h24.61a3.516 3.516 0 013.515 3.516v17.578m0-50.976v7.03a3.516 3.516 0 01-3.515 3.517h-24.61a3.516 3.516 0 01-3.515-3.516V9.375m42.18 12.297L53.328 11.14a6.027 6.027 0 00-4.262-1.765H15.402a6.027 6.027 0 00-6.027 6.027v44.196a6.027 6.027 0 006.027 6.027h44.196a6.027 6.027 0 006.027-6.027V25.934a6.027 6.027 0 00-1.765-4.262z"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export function ChevronDown() {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
    >
      <Path
        d="M17 10l-5 5-5-5"
        stroke="#fff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function GoBackIcon() {
  return (
    <Svg
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="none"

    >
      <Path
        d="M15.639 20.861a1 1 0 001.536-1.28l-1.536 1.28zm-3.375-5.612l-.768-.64a1 1 0 000 1.28l.768-.64zm4.911-4.331a1 1 0 00-1.536-1.28l1.536 1.28zm0 8.663l-4.143-4.972-1.537 1.28 4.144 4.972 1.536-1.28zm-4.143-3.691l4.143-4.972-1.536-1.28-4.143 4.971 1.536 1.28zM15 25.25C9.34 25.25 4.75 20.66 4.75 15h-2c0 6.765 5.485 12.25 12.25 12.25v-2zM4.75 15C4.75 9.34 9.34 4.75 15 4.75v-2C8.235 2.75 2.75 8.235 2.75 15h2zM15 4.75c5.66 0 10.25 4.59 10.25 10.25h2c0-6.765-5.485-12.25-12.25-12.25v2zM25.25 15c0 5.66-4.59 10.25-10.25 10.25v2c6.765 0 12.25-5.485 12.25-12.25h-2z"
        fill="#fff"
      />
    </Svg>
  )
}

export function CorrectIcon() {
  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
    >
      <G clipPath="url(#clip0_47_702)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.637 1.198a1 1 0 01.134 1.408l-8.04 9.73-.003.002a1.922 1.922 0 01-2.999-.055L.211 9.045a1 1 0 111.578-1.228l2.464 3.167 7.976-9.652a1 1 0 011.408-.134z"
          fill="#4CAF50"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_47_702">
          <Path fill="#fff" d="M0 0H14V14H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export function FalseIcon() {
  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
    >
      <Path
        d="M11.083 2.917l-8.166 8.166m0-8.166l8.166 8.166"
        stroke="#E30A17"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}
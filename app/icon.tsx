import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer lens ring */}
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="white"
            strokeWidth="1.2"
            fill="none"
          />
          
          {/* Inner lens ring */}
          <circle
            cx="16"
            cy="16"
            r="11"
            stroke="white"
            strokeWidth="0.8"
            fill="none"
            opacity="0.6"
          />
          
          {/* Shutter blades - 6 segments forming aperture */}
          <g opacity="0.9">
            {/* Blade 1 */}
            <path
              d="M16 8 L18.5 12 L16 13 L13.5 12 Z"
              fill="white"
            />
            {/* Blade 2 */}
            <path
              d="M21.86 11 L20.5 15.5 L17.5 15 L18 12.5 Z"
              fill="white"
            />
            {/* Blade 3 */}
            <path
              d="M23 16 L20 18 L18 16 L19 13.5 Z"
              fill="white"
            />
            {/* Blade 4 */}
            <path
              d="M21.86 21 L18 20 L17.5 17 L20.5 16.5 Z"
              fill="white"
            />
            {/* Blade 5 */}
            <path
              d="M16 24 L13.5 20 L16 19 L18.5 20 Z"
              fill="white"
            />
            {/* Blade 6 */}
            <path
              d="M10.14 21 L13 20 L14.5 17 L11.5 16.5 Z"
              fill="white"
            />
            {/* Blade 7 */}
            <path
              d="M9 16 L12 14 L14 16 L13 18.5 Z"
              fill="white"
            />
            {/* Blade 8 */}
            <path
              d="M10.14 11 L14 12 L14.5 15 L11.5 15.5 Z"
              fill="white"
            />
          </g>
          
          {/* Center aperture circle */}
          <circle
            cx="16"
            cy="16"
            r="3"
            fill="#000000"
            stroke="white"
            strokeWidth="1"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}

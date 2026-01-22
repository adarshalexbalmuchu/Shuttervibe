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
          {/* Outer white circle */}
          <circle cx="16" cy="16" r="8" fill="white" />
          
          {/* Inner black circle (shutter center) */}
          <circle cx="16" cy="16" r="4" fill="#000000" />
          
          {/* 8 shutter blade paths (aperture blades) - matching the uploaded shutter image */}
          <g transform="translate(16, 16)">
            <path d="M 0,-4 L 1.8,-3 L 1.5,-2 L 0,-1.2 Z" fill="#1a1a1a" />
            <path d="M 2.83,-2.83 L 3.6,-1.2 L 2,-1 L 0.85,-0.85 Z" fill="#1a1a1a" />
            <path d="M 4,0 L 3,1.8 L 2,1.5 L 1.2,0 Z" fill="#1a1a1a" />
            <path d="M 2.83,2.83 L 1.2,3.6 L 1,2 L 0.85,0.85 Z" fill="#1a1a1a" />
            <path d="M 0,4 L -1.8,3 L -1.5,2 L 0,1.2 Z" fill="#1a1a1a" />
            <path d="M -2.83,2.83 L -3.6,1.2 L -2,1 L -0.85,0.85 Z" fill="#1a1a1a" />
            <path d="M -4,0 L -3,-1.8 L -2,-1.5 L -1.2,0 Z" fill="#1a1a1a" />
            <path d="M -2.83,-2.83 L -1.2,-3.6 L -1,-2 L -0.85,-0.85 Z" fill="#1a1a1a" />
          </g>
          
          {/* Outer shutter blade highlights */}
          <g transform="translate(16, 16)">
            <path d="M -6,2 L -4,6 L 4,6 L 6,2 Z" fill="white" />
            <path d="M -4.24,-4.24 L -2.83,-6 L 2.83,-6 L 4.24,-4.24 Z" fill="white" />
            <path d="M -2,-6 L 0,-7 L 4,-4 L 2,-2 Z" fill="white" />
            <path d="M 4.24,-4.24 L 6,-2.83 L 6,2.83 L 4.24,4.24 Z" fill="white" />
            <path d="M 6,-2 L 7,0 L 4,4 L 2,2 Z" fill="white" />
            <path d="M 4.24,4.24 L 2.83,6 L -2.83,6 L -4.24,4.24 Z" fill="white" />
            <path d="M 2,6 L 0,7 L -4,4 L -2,2 Z" fill="white" />
            <path d="M -4.24,4.24 L -6,2.83 L -6,-2.83 L -4.24,-4.24 Z" fill="white" />
          </g>
          
          {/* Center aperture circle */}
          <circle cx="16" cy="16" r="1.2" fill="white" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}

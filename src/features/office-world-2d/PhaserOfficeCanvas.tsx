"use client";

type Props = { className?: string };

/**
 * MEX-NEX architectural approval scene.
 * A single open-front isometric office shell; no furniture, agents or loose props.
 */
export function PhaserOfficeCanvas({ className }: Props) {
  return (
    <div className={className ?? "h-full min-h-[520px] w-full overflow-hidden"}>
      <svg
        viewBox="55 -85 1090 780"
        role="img"
        aria-label="Bangunan kantor MEX-NEX bergaya isometrik dengan lantai kayu, dinding, jendela kaca, dan pintu"
        className="h-full w-full select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="studioBg" x2="0" y2="1">
            <stop stopColor="#10192b" />
            <stop offset="1" stopColor="#080d18" />
          </linearGradient>
          <linearGradient id="leftWall" x2="1" y2="0.8">
            <stop stopColor="#dce8e8" />
            <stop offset=".55" stopColor="#a9c2c8" />
            <stop offset="1" stopColor="#7896a2" />
          </linearGradient>
          <linearGradient id="rightWall" x2="0" y2="1">
            <stop stopColor="#b9cbd0" />
            <stop offset="1" stopColor="#718b99" />
          </linearGradient>
          <linearGradient id="glass" x2="1" y2="1">
            <stop stopColor="#d9f6ff" />
            <stop offset=".28" stopColor="#8fd6ef" />
            <stop offset=".72" stopColor="#5b9fc1" />
            <stop offset="1" stopColor="#d7f4f7" />
          </linearGradient>
          <linearGradient id="glassShade" x2="0" y2="1">
            <stop stopColor="#f3ffff" stopOpacity=".8" />
            <stop offset="1" stopColor="#4c91b7" stopOpacity=".12" />
          </linearGradient>
          <linearGradient id="woodEdge" x2="0" y2="1">
            <stop stopColor="#a86e45" />
            <stop offset="1" stopColor="#573a2e" />
          </linearGradient>
          <linearGradient id="doorWood" x2="1" y2="1">
            <stop stopColor="#9a6548" />
            <stop offset="1" stopColor="#593b35" />
          </linearGradient>
          <pattern id="wood" width="120" height="34" patternUnits="userSpaceOnUse" patternTransform="skewY(-26)">
            <rect width="120" height="34" fill="#d8b18a" />
            <path d="M0 2H120 M0 31H120" stroke="#b98761" strokeWidth="1.5" opacity=".7" />
            <path d="M18 0V34 M84 0V34" stroke="#bd906d" strokeWidth="1" opacity=".5" />
            <path d="M4 12h35 m28 9h39" stroke="#f1d3ad" strokeWidth="1" opacity=".65" />
          </pattern>
          <pattern id="wallGrain" width="34" height="34" patternUnits="userSpaceOnUse">
            <path d="M0 33H34" stroke="#fff" strokeOpacity=".12" />
            <circle cx="6" cy="8" r="1" fill="#fff" opacity=".14" />
          </pattern>
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <clipPath id="floorClip">
            <polygon points="600,155 1080,395 600,635 120,395" />
          </clipPath>
          <clipPath id="leftGlassClip">
            <polygon points="178,365 280,314 280,177 178,228" />
          </clipPath>
          <clipPath id="rightGlassClip">
            <polygon points="650,180 748,229 748,92 650,43" />
          </clipPath>
        </defs>

        <rect width="1200" height="760" fill="url(#studioBg)" />
        <circle cx="600" cy="370" r="420" fill="#20334b" opacity=".22" />
        <ellipse cx="600" cy="650" rx="520" ry="70" fill="#02050b" opacity=".7" filter="url(#shadow)" />

        {/* Thick foundation and timber floor */}
        <polygon points="600,155 1080,395 600,670 120,395" fill="url(#woodEdge)" stroke="#302c32" strokeWidth="12" strokeLinejoin="round" />
        <polygon points="600,135 1080,375 600,650 120,375" fill="#8c6147" stroke="#d7b18a" strokeWidth="5" strokeLinejoin="round" />
        <polygon points="600,148 1057,376 600,637 143,376" fill="url(#wood)" stroke="#76523d" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#floorClip)" opacity=".58">
          {Array.from({ length: 18 }, (_, i) => (
            <path key={i} d={`M${90 + i * 60} 120 L${90 + i * 60} 690`} stroke="#8e6449" strokeWidth="2" />
          ))}
          {Array.from({ length: 15 }, (_, i) => (
            <path key={i} d={`M80 ${205 + i * 31} L1120 ${205 + i * 31}`} stroke="#f7d9b5" strokeWidth="1.5" opacity=".48" />
          ))}
        </g>
        <path d="M600 148L1057 376L600 637L143 376Z" fill="none" stroke="#f5d8b4" strokeWidth="3" opacity=".55" />

        {/* Rear walls: left plane and right plane */}
        <polygon points="120,375 600,135 600, -65 120,175" fill="url(#leftWall)" stroke="#334957" strokeWidth="8" strokeLinejoin="round" />
        <polygon points="600,135 1080,375 1080,175 600,-65" fill="url(#rightWall)" stroke="#334957" strokeWidth="8" strokeLinejoin="round" />
        <polygon points="120,375 600,135 600,-65 120,175" fill="url(#wallGrain)" opacity=".65" />
        <polygon points="600,135 1080,375 1080,175 600,-65" fill="url(#wallGrain)" opacity=".5" />

        {/* Left wall panoramic windows */}
        <g stroke="#314a59" strokeWidth="9" strokeLinejoin="round">
          <polygon points="164,353 268,301 268,164 164,216" fill="url(#glass)" />
          <polygon points="286,292 390,240 390,103 286,155" fill="url(#glass)" />
          <polygon points="408,231 512,179 512,42 408,94" fill="url(#glass)" />
        </g>
        <g opacity=".38" fill="#e8fbff">
          <polygon points="172,345 196,333 196,226 172,238" />
          <polygon points="294,284 318,272 318,165 294,177" />
          <polygon points="416,223 440,211 440,104 416,116" />
        </g>
        <g stroke="#f0ffff" strokeWidth="3" opacity=".75">
          <path d="M178 230L178 345 M300 169L300 284 M422 108L422 223" />
          <path d="M165 217L512 43" strokeWidth="2" opacity=".5" />
        </g>
        <g stroke="#304a59" strokeWidth="7">
          <path d="M280 164V301 M402 103V240 M524 42V179" />
          <path d="M158 359L524 176" />
        </g>
        <g stroke="#e6f7f7" strokeWidth="3" opacity=".9">
          <path d="M151 368L521 183" />
          <path d="M274 307L274 160 M396 246L396 99 M518 185L518 38" />
        </g>

        {/* Right wall window band */}
        <g stroke="#304a59" strokeWidth="9" strokeLinejoin="round">
          <polygon points="635,153 735,203 735,66 635,16" fill="url(#glass)" />
          <polygon points="752,212 852,262 852,125 752,75" fill="url(#glass)" />
          <polygon points="869,271 969,321 969,184 869,134" fill="url(#glass)" />
        </g>
        <g fill="#e8fbff" opacity=".3">
          <polygon points="642,145 661,155 661,30 642,21" />
          <polygon points="759,204 778,214 778,89 759,80" />
          <polygon points="876,263 895,273 895,148 876,139" />
        </g>
        <g stroke="#f1ffff" strokeWidth="3" opacity=".7">
          <path d="M641 20L641 151 M758 79L758 210 M875 138L875 269" />
          <path d="M631 12L969 181" strokeWidth="2" />
        </g>
        <g stroke="#304a59" strokeWidth="7">
          <path d="M741 69V206 M858 128V265 M975 187V324" />
          <path d="M628 158L980 334" />
        </g>
        <path d="M622 166L987 348" stroke="#e6f7f7" strokeWidth="3" />

        {/* Solid wall return and framed wooden door */}
        <polygon points="984,327 1062,366 1062,166 984,127" fill="#8ea5ad" stroke="#334957" strokeWidth="7" />
        <polygon points="997,321 1049,347 1049,194 997,168" fill="url(#doorWood)" stroke="#392f31" strokeWidth="5" />
        <polygon points="1005,312 1041,330 1041,202 1005,184" fill="none" stroke="#c8956d" strokeWidth="3" />
        <path d="M1034 270L1034 286" stroke="#f5d49c" strokeWidth="5" strokeLinecap="round" />
        <path d="M997 168L1049 194" stroke="#e0b18a" strokeWidth="3" />

        {/* Wall baseboards, corner trims and architectural seams */}
        <path d="M120 375L600 135L1080 375" fill="none" stroke="#304653" strokeWidth="13" />
        <path d="M128 365L600 129L1072 365" fill="none" stroke="#e5eff0" strokeWidth="3" opacity=".8" />
        <path d="M600 135V-65" stroke="#314956" strokeWidth="9" />
        <path d="M600 135V-65" stroke="#e2eff0" strokeWidth="2" opacity=".7" />

        {/* Open front edge: visible layered floor construction */}
        <path d="M120 375L600 650L1080 375" fill="none" stroke="#3c302d" strokeWidth="10" strokeLinejoin="round" />
        <path d="M120 375L600 650L1080 375" fill="none" stroke="#e4b98d" strokeWidth="3" opacity=".8" />
        <path d="M120 395L600 670L1080 395" fill="none" stroke="#2a2529" strokeWidth="5" opacity=".9" />

        {/* Gentle warm light pools, kept part of the architectural lighting */}
        <polygon points="330,360 600,225 890,370 600,515" fill="#fff0c5" opacity=".08" />
        <path d="M600 150L600 635" stroke="#fff4d9" strokeWidth="1" opacity=".12" />
      </svg>
    </div>
  );
}

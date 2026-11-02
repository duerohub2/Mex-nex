 "use client";

type Props = { className?: string };

/**
 * MEX-NEX expanded indoor HQ architecture preview.
 * Furniture is intentionally added as a separate visual layer inside the shell.
 */
export function PhaserOfficeCanvas({ className }: Props) {
  return (
    <div className={className ?? "h-full min-h-[520px] w-full overflow-hidden"}>
      <svg
        viewBox="55 -85 1090 780"
        role="img"
        aria-label="Kantor MEX-NEX isometrik yang diperluas, dengan area kerja, ruang rapat, meja resepsionis, jendela, dan pintu"
        className="h-full w-full select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="studioBg" x2="0" y2="1"><stop stopColor="#10192b" /><stop offset="1" stopColor="#080d18" /></linearGradient>
          <linearGradient id="leftWall" x2="1" y2="0.8"><stop stopColor="#dce8e8" /><stop offset=".55" stopColor="#a9c2c8" /><stop offset="1" stopColor="#7896a2" /></linearGradient>
          <linearGradient id="rightWall" x2="0" y2="1"><stop stopColor="#b9cbd0" /><stop offset="1" stopColor="#718b99" /></linearGradient>
          <linearGradient id="glass" x2="1" y2="1"><stop stopColor="#d9f6ff" /><stop offset=".28" stopColor="#8fd6ef" /><stop offset=".72" stopColor="#5b9fc1" /><stop offset="1" stopColor="#d7f4f7" /></linearGradient>
          <linearGradient id="woodEdge" x2="0" y2="1"><stop stopColor="#a86e45" /><stop offset="1" stopColor="#573a2e" /></linearGradient>
          <linearGradient id="doorWood" x2="1" y2="1"><stop stopColor="#9a6548" /><stop offset="1" stopColor="#593b35" /></linearGradient>
          <pattern id="wood" width="120" height="34" patternUnits="userSpaceOnUse" patternTransform="skewY(-26)">
            <rect width="120" height="34" fill="#d8b18a" /><path d="M0 2H120 M0 31H120" stroke="#b98761" strokeWidth="1.5" opacity=".7" /><path d="M18 0V34 M84 0V34" stroke="#bd906d" strokeWidth="1" opacity=".5" /><path d="M4 12h35 m28 9h39" stroke="#f1d3ad" strokeWidth="1" opacity=".65" />
          </pattern>
          <pattern id="wallGrain" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M0 33H34" stroke="#fff" strokeOpacity=".12" /><circle cx="6" cy="8" r="1" fill="#fff" opacity=".14" /></pattern>
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feGaussianBlur stdDeviation="16" /></filter>
          <clipPath id="floorClip"><polygon points="600,155 1080,395 600,635 120,395" /></clipPath>
        </defs>
        <rect width="1200" height="760" fill="url(#studioBg)" />
        <circle cx="600" cy="370" r="420" fill="#20334b" opacity=".22" />
        <ellipse cx="600" cy="650" rx="520" ry="70" fill="#02050b" opacity=".7" filter="url(#shadow)" />

        {/* Enlarged raised timber floor */}
        <polygon points="600,155 1080,395 600,670 120,395" fill="url(#woodEdge)" stroke="#302c32" strokeWidth="12" strokeLinejoin="round" />
        <polygon points="600,135 1080,375 600,650 120,375" fill="#8c6147" stroke="#d7b18a" strokeWidth="5" strokeLinejoin="round" />
        <polygon points="600,148 1057,376 600,637 143,376" fill="url(#wood)" stroke="#76523d" strokeWidth="3" strokeLinejoin="round" />
        <g clipPath="url(#floorClip)" opacity=".58">
          {Array.from({ length: 18 }, (_, i) => <path key={i} d={`M${90 + i * 60} 120 L${90 + i * 60} 690`} stroke="#8e6449" strokeWidth="2" />)}
          {Array.from({ length: 15 }, (_, i) => <path key={i} d={`M80 ${205 + i * 31} L1120 ${205 + i * 31}`} stroke="#f7d9b5" strokeWidth="1.5" opacity=".48" />)}
        </g>
        <path d="M600 148L1057 376L600 637L143 376Z" fill="none" stroke="#f5d8b4" strokeWidth="3" opacity=".55" />

        {/* Back and side walls, open front */}
        <polygon points="120,375 600,135 600,-65 120,175" fill="url(#leftWall)" stroke="#334957" strokeWidth="8" strokeLinejoin="round" />
        <polygon points="600,135 1080,375 1080,175 600,-65" fill="url(#rightWall)" stroke="#334957" strokeWidth="8" strokeLinejoin="round" />
        <polygon points="120,375 600,135 600,-65 120,175" fill="url(#wallGrain)" opacity=".65" />
        <polygon points="600,135 1080,375 1080,175 600,-65" fill="url(#wallGrain)" opacity=".5" />

        {/* Panoramic windows on the left */}
        <g stroke="#314a59" strokeWidth="9" strokeLinejoin="round">
          <polygon points="164,353 268,301 268,164 164,216" fill="url(#glass)" />
          <polygon points="286,292 390,240 390,103 286,155" fill="url(#glass)" />
          <polygon points="408,231 512,179 512,42 408,94" fill="url(#glass)" />
        </g>
        <g opacity=".38" fill="#e8fbff"><polygon points="172,345 196,333 196,226 172,238" /><polygon points="294,284 318,272 318,165 294,177" /><polygon points="416,223 440,211 440,104 416,116" /></g>
        <g stroke="#f0ffff" strokeWidth="3" opacity=".75"><path d="M178 230L178 345 M300 169L300 284 M422 108L422 223" /><path d="M165 217L512 43" strokeWidth="2" opacity=".5" /></g>
        <g stroke="#304a59" strokeWidth="7"><path d="M280 164V301 M402 103V240 M524 42V179" /><path d="M158 359L524 176" /></g>
        <g stroke="#e6f7f7" strokeWidth="3" opacity=".9"><path d="M151 368L521 183" /><path d="M274 307L274 160 M396 246L396 99 M518 185L518 38" /></g>

        {/* Window band on right */}
        <g stroke="#304a59" strokeWidth="9" strokeLinejoin="round">
          <polygon points="635,153 735,203 735,66 635,16" fill="url(#glass)" /><polygon points="752,212 852,262 852,125 752,75" fill="url(#glass)" /><polygon points="869,271 969,321 969,184 869,134" fill="url(#glass)" />
        </g>
        <g fill="#e8fbff" opacity=".3"><polygon points="642,145 661,155 661,30 642,21" /><polygon points="759,204 778,214 778,89 759,80" /><polygon points="876,263 895,273 895,148 876,139" /></g>
        <g stroke="#f1ffff" strokeWidth="3" opacity=".7"><path d="M641 20L641 151 M758 79L758 210 M875 138L875 269" /><path d="M631 12L969 181" strokeWidth="2" /></g>
        <g stroke="#304a59" strokeWidth="7"><path d="M741 69V206 M858 128V265 M975 187V324" /><path d="M628 158L980 334" /></g>
        <path d="M622 166L987 348" stroke="#e6f7f7" strokeWidth="3" />

        {/* Door at the rear-right corner */}
        <polygon points="984,327 1062,366 1062,166 984,127" fill="#8ea5ad" stroke="#334957" strokeWidth="7" />
        <polygon points="997,321 1049,347 1049,194 997,168" fill="url(#doorWood)" stroke="#392f31" strokeWidth="5" />
        <polygon points="1005,312 1041,330 1041,202 1005,184" fill="none" stroke="#c8956d" strokeWidth="3" />
        <path d="M1034 270L1034 286" stroke="#f5d49c" strokeWidth="5" strokeLinecap="round" />

        {/* Architectural floor zones */}
        <g clipPath="url(#floorClip)">
          <polygon points="355,295 600,418 845,295 600,172" fill="#e6f6fa" opacity=".08" />
          <polygon points="220,390 380,470 540,390 380,310" fill="#d7f3ff" opacity=".10" stroke="#d8f4ff" strokeOpacity=".25" />
          <polygon points="660,390 820,470 980,390 820,310" fill="#c8e8ff" opacity=".09" stroke="#d8f4ff" strokeOpacity=".25" />
          <polygon points="430,500 600,585 770,500 600,415" fill="#f3d4a7" opacity=".10" stroke="#f8ddb5" strokeOpacity=".28" />
        </g>

        {/* Workstations: desk surfaces, pedestal legs, monitor, keyboard and chairs */}
        <g strokeLinejoin="round">
          <g transform="translate(365 385)">
            <polygon points="0,0 82,41 0,82 -82,41" fill="#6b4637" opacity=".8" transform="translate(0 16)" />
            <polygon points="0,-12 82,29 0,70 -82,29" fill="#d7b38a" stroke="#76513b" strokeWidth="4" />
            <path d="M-62 29V68 M62 29V68 M0 60V94" stroke="#624536" strokeWidth="8" />
            <polygon points="-20,-12 12,4 12,35 -20,19" fill="#233246" stroke="#172333" strokeWidth="4" />
            <polygon points="-16,-8 8,4 8,27 -16,15" fill="#6dc9ed" />
            <polygon points="22,22 52,37 28,49 -2,34" fill="#33465a" />
            <ellipse cx="0" cy="105" rx="38" ry="18" fill="#344456" stroke="#202d3d" strokeWidth="4" />
            <path d="M-28 100V70Q0 55 28 70V100" fill="#4d6478" stroke="#293949" strokeWidth="5" />
          </g>
          <g transform="translate(820 385)">
            <polygon points="0,0 82,41 0,82 -82,41" fill="#6b4637" opacity=".8" transform="translate(0 16)" />
            <polygon points="0,-12 82,29 0,70 -82,29" fill="#d7b38a" stroke="#76513b" strokeWidth="4" />
            <path d="M-62 29V68 M62 29V68 M0 60V94" stroke="#624536" strokeWidth="8" />
            <polygon points="-20,-12 12,4 12,35 -20,19" fill="#233246" stroke="#172333" strokeWidth="4" />
            <polygon points="-16,-8 8,4 8,27 -16,15" fill="#6dc9ed" />
            <polygon points="22,22 52,37 28,49 -2,34" fill="#33465a" />
            <ellipse cx="0" cy="105" rx="38" ry="18" fill="#344456" stroke="#202d3d" strokeWidth="4" />
            <path d="M-28 100V70Q0 55 28 70V100" fill="#4d6478" stroke="#293949" strokeWidth="5" />
          </g>
        </g>

        {/* Central meeting table with seats */}
        <g transform="translate(600 440)">
          <polygon points="0,-70 125,-8 0,54 -125,-8" fill="#604638" opacity=".9" transform="translate(0 20)" />
          <polygon points="0,-82 125,-20 0,42 -125,-20" fill="#bd8b60" stroke="#674832" strokeWidth="5" />
          <path d="M-90 -20V38 M90 -20V38 M0 30V76" stroke="#644733" strokeWidth="10" />
          <polygon points="-28,-44 28,-16 -4,0 -60,-28" fill="#e7e9e6" stroke="#9ca9ae" strokeWidth="3" />
          <polygon points="30,-6 64,11 30,28 -4,11" fill="#33465a" />
          <polygon points="34,-2 58,10 34,22" fill="#6dc9ed" />
          {[-1,1].map((side) => <g key={side} transform={`translate(${side * 160} 0)`}><ellipse cx="0" cy="0" rx="31" ry="17" fill="#344456" stroke="#202d3d" strokeWidth="4" /><path d="M-22 -4V-38Q0 -52 22 -38V-4" fill="#4d6478" stroke="#293949" strokeWidth="5" /></g>)}
          <g transform="translate(0 102)"><ellipse rx="31" ry="17" fill="#344456" stroke="#202d3d" strokeWidth="4" /><path d="M-22 -4V-38Q0 -52 22 -38V-4" fill="#4d6478" stroke="#293949" strokeWidth="5" /></g>
        </g>

        {/* Reception counter in the front-center */}
        <g transform="translate(600 555)">
          <polygon points="-105,-28 0,25 105,-28 0,-81" fill="#5e4438" opacity=".8" transform="translate(0 20)" />
          <polygon points="-105,-38 0,15 105,-38 0,-91" fill="#d5b18a" stroke="#76513b" strokeWidth="5" />
          <polygon points="-105,-38 0,15 0,74 -105,21" fill="#8b5e43" stroke="#5d3d30" strokeWidth="4" />
          <polygon points="0,15 105,-38 105,21 0,74" fill="#674635" stroke="#5d3d30" strokeWidth="4" />
          <polygon points="-62,-40 0,-9 62,-40 0,-71" fill="#27384c" stroke="#172333" strokeWidth="3" />
          <text x="0" y="-34" textAnchor="middle" fontSize="16" fontWeight="800" fill="#b8efff" transform="rotate(0)">MEX-NEX</text>
        </g>

        {/* Plants and compact lounge corners */}
        <g>
          <g transform="translate(250 490)"><ellipse cx="0" cy="12" rx="25" ry="13" fill="#503a30" /><path d="M-20 0L-15 30H15L20 0Z" fill="#b66f4e" stroke="#704633" strokeWidth="3" /><path d="M0 0C-38 -35 -28 -62 -8 -40C-18 -78 18 -78 8 -40C40 -60 36 -28 8 -20C35 -10 20 10 0 0" fill="#5b9b69" stroke="#346b4b" strokeWidth="3" /></g>
          <g transform="translate(950 490)"><ellipse cx="0" cy="12" rx="25" ry="13" fill="#503a30" /><path d="M-20 0L-15 30H15L20 0Z" fill="#b66f4e" stroke="#704633" strokeWidth="3" /><path d="M0 0C-38 -35 -28 -62 -8 -40C-18 -78 18 -78 8 -40C40 -60 36 -28 8 -20C35 -10 20 10 0 0" fill="#5b9b69" stroke="#346b4b" strokeWidth="3" /></g>
        </g>

        {/* Trim, open front and ambient lighting */}
        <path d="M120 375L600 135L1080 375" fill="none" stroke="#304653" strokeWidth="13" />
        <path d="M128 365L600 129L1072 365" fill="none" stroke="#e5eff0" strokeWidth="3" opacity=".8" />
        <path d="M600 135V-65" stroke="#314956" strokeWidth="9" />
        <path d="M120 375L600 650L1080 375" fill="none" stroke="#3c302d" strokeWidth="10" strokeLinejoin="round" />
        <path d="M120 375L600 650L1080 375" fill="none" stroke="#e4b98d" strokeWidth="3" opacity=".8" />
        <polygon points="330,360 600,225 890,370 600,515" fill="#fff0c5" opacity=".08" />
        <path d="M600 150L600 635" stroke="#fff4d9" strokeWidth="1" opacity=".12" />
      </svg>
    </div>
  );
}

interface RentaIconProps {
  active?: boolean;
  size?: number;
}

export const RentaIcon = ({ active = false, size = 24 }: RentaIconProps) => {
  const color = active ? '#F5BF18' : '#6B7280';

  return (
    <svg
      width={size}
      height={size}
      viewBox="10 0 50 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <line x1="43.9" y1="27.9" x2="44.2" y2="28.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
        <g>
          <line x1="42.3" y1="49.4" x2="42.1" y2="45.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
          <g>
            <line x1="37.9" y1="53.5" x2="35.3" y2="50.4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="37.4" y1="29.5" x2="38.1" y2="53.3" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="44.2" y1="28.5" x2="39.8" y2="28.7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="39.8" y1="31.6" x2="39.8" y2="28.7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="41" y1="32.6" x2="39.8" y2="31.6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="41" y1="35.8" x2="41" y2="32.6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="40.1" y1="37.3" x2="41" y2="35.8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="42.3" y1="40" x2="40.1" y2="37.3" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="40.6" y1="44" x2="42.3" y2="40" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="40.6" y1="44" x2="42.1" y2="45.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="37.9" y1="53.6" x2="42.3" y2="49.4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="37.9" y1="53.6" x2="35.2" y2="50.4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="35.2" y1="50.4" x2="34.2" y2="29.7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="34.2" y1="29.7" x2="30.4" y2="29.8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
          </g>
        </g>

        <g>
          <line x1="30.4" y1="29.8" x2="31.6" y2="28.2" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
          <g>
            <line x1="43.9" y1="27.9" x2="43" y2="26" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <line x1="32.7" y1="26.6" x2="31.6" y2="28.2" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" />
            <path d="M32.7,26.6c-1.1-0.5-2.2-1.2-3.1-2.1c-4.7-4.4-5.1-12.1-0.9-17s11.5-5.3,16.2-0.9s5.1,12.1,0.9,17 c-0.8,1-1.8,1.8-2.8,2.4" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" fill="none" />
            <path d="M34.8,11.7c1-1.2,2.8-1.3,3.9-0.2c1.1,1.1,1.2,2.9,0.2,4.1c-1,1.2-2.8,1.3-3.9,0.2S33.8,12.9,34.8,11.7z" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" fill="none" />
          </g>
        </g>

        <g>
          <path d="M29,23.8c-3.7,1-7.8,0-10.6-3c-2.9-3-3.8-7.3-2.8-11.2" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" fill="none" />
          <path d="M15.5,9.6C16,7.7,17,5.9,18.4,4.4c1.4-1.5,3.1-2.5,5-3" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" fill="none" />
          <path d="M23.4,1.4c3.7-1,7.8,0,10.6,3c2.5,2.7,3.5,6.3,3.1,9.7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeMiterlimit="10" fill="none" />
        </g>
      </g>
    </svg>
  );
};

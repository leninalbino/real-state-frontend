interface PriceIconProps {
  active?: boolean;
  size?: number;
}

export const PriceIcon = ({ active = false, size = 24 }: PriceIconProps) => {
  const color = active ? '#F5BF18' : '#6B7280';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 63.9 54.6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path d="M21.7,33.6c0.1,0,0.1,0,0.2,0c0.7,0,1.4-0.2,1.9,0.1c0.7,0.4,0.3,1.2,0.5,1.8c0.3,1.1,0.9,2,1.8,2.8 c2.9,2.2,6.1,2.6,9.6,1.6c2-0.6,3.3-1.9,3.5-4.1c0.3-2.5-0.7-4.4-2.8-5.7c-1.7-1-3.6-1.5-5.5-2c-2.5-0.7-4.9-1.6-7-3.1 c-5.8-4.2-4.7-11.6,0.6-14.9c4.4-2.8,11.8-2.6,15.9,1.2c2,1.8,3.2,4,3.4,6.8c0,0.6-0.1,1-0.8,0.9c-1.1,0-2.1,0-3.2,0 c-0.5,0-0.8-0.2-0.8-0.7c0-3.1-2.8-6.2-7-6.2c-1.2,0-2.5,0-3.6,0.5c-1.9,0.8-3,2.2-3.3,4.2c-0.3,2.2,0.5,3.9,2.3,5 c1.9,1.2,4.1,1.9,6.3,2.5c2.4,0.7,4.7,1.6,6.7,3.2c3.8,3,4.7,8.7,1.9,12.4c-1.6,2.2-3.9,3.5-6.5,4c-5,1.1-9.7,0.3-13.8-3 c-2-1.7-3-3.8-3.1-6.4c0-0.6,0.2-0.9,0.8-0.9C20.5,33.7,21.1,33.7,21.7,33.6C21.7,33.7,21.7,33.6,21.7,33.6z" fill={color} />
        <line x1="31.9" y1="4.6" x2="31.9" y2="47.3" stroke={color} strokeWidth="2.0109" strokeLinecap="round" strokeMiterlimit="10" />
        <circle cx="31.9" cy="27.3" r="25.6" stroke={color} strokeWidth="2.0109" strokeLinecap="round" strokeMiterlimit="10" fill="none" />
      </g>
    </svg>
  );
};

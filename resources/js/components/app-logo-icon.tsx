import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 28.66 8.77"
            xmlns="http://www.w3.org/2000/svg"
        >
            <text
                transform="translate(0 6.75)"
                fill="currentColor"
                style={{
                    fontSize: '8.06px',
                    fontFamily: 'Inter, sans-serif',
                }}
            >
                <tspan className="tracking-normal">D</tspan>
                <tspan x="5.4" y="0">
                    eg
                </tspan>
                <tspan x="13.95" y="0" style={{ letterSpacing: '-0.01em' }}>
                    v
                </tspan>
                <tspan x="17.75" y="0">
                    o
                </tspan>
                <tspan x="22.17" y="0" className="tracking-normal">
                    r
                </tspan>
                <tspan x="24.77" y="0">
                    a
                </tspan>
            </text>
        </svg>
    );
}

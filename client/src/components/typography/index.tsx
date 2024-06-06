import React from 'react';

type TypographyProps = {
    children: string;
    size?: string;
}
const Typography: React.FC<TypographyProps> = ({
    children,
    size = 'text-xl'
}) => {
    return (
        <p className={size}>{ children }</p>
    );
};

export default Typography;
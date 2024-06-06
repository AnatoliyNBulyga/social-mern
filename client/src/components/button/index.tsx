import React from 'react';
import { Button as NextButton } from '@nextui-org/react';

type ButtonProps = {
    children: React.ReactNode;
    icon?: JSX.Element;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    fullWidth?: boolean;
    color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
    isLoading?: boolean;
    variant?: "light" | "solid" | "bordered" | "flat" | "faded" | "shadow" | "ghost" | undefined;
}
const Button: React.FC<ButtonProps> = ({
    children,
    icon,
    className,
    type,
    fullWidth,
    color,
    isLoading= false,
    variant = 'solid'
}) => {
    return (
        <NextButton
            startContent={icon}
            size="lg"
            color={color}
            variant={variant}
            className={className}
            type={type}
            fullWidth={fullWidth}
            isLoading={isLoading}
        >
            {children}
        </NextButton>
    );
};

export default Button;
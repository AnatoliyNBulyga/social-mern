import React from 'react';
import Button from "../button";
import {Link} from "react-router-dom";

type NavButtonProps = {
    children: React.ReactNode;
    icon: JSX.Element;
    href: string;
}
const NavButton: React.FC<NavButtonProps> = ({
    children,
    icon,
    href
}) => {
    return (
        <Button className="flex justify-start text-xl" icon={icon} variant="light">
            <Link to={href}>
                {children}
            </Link>
        </Button>
    );
};

export default NavButton;
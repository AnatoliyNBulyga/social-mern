import React from 'react';
import { User as NextUiUser } from "@nextui-org/react";
import {BASE_URL} from "../../contstants";

type UserProps = {
    name: string;
    avatarUrl: string;
    description?: string;
    className?: string;
}

const User: React.FC<UserProps> = ({
    name = '',
    avatarUrl = '',
    description = '',
    className = ''
}) => {
    return (
        <NextUiUser
            name={name}
            className={className}
            description={description}
            avatarProps={{
                src: `${BASE_URL}${avatarUrl}`
            }}
        />
    );
};

export default User;
import React from 'react';

type ProfileInfoProps = {
    title: string;
    info?: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
    title,
    info
}) => {

    if(!info) {
        return null
    }

    return (
        <p className="font-semibold">
            <span className="text-gray-500 mr-2">{title}</span>
            {info}
        </p>
    );
};

export default ProfileInfo;
import React from 'react';
import {IconType} from "react-icons";

type MetaInfoProps = {
    count: number;
    Icon: IconType;
}
const MetaInfo: React.FC<MetaInfoProps> = ({
    count,
    Icon
}) => {
    return (
        <div className="flex items-center gap-2 cursor-pointer">
            {
                count > 0 && (
                    <p className="font-semibold text-default-400 text-l">{ count }</p>
                )
            }
            <p className="text-default-400 text-xl ease-in duration-100">
                <Icon />
            </p>
        </div>
    );
};

export default MetaInfo;
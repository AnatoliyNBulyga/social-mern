import React from 'react';
import {useSelector} from "react-redux";
import {selectCurrent} from "../../features/user/userSlice";
import {Link} from "react-router-dom";
import {Card, CardBody} from "@nextui-org/react";
import User from "../../components/user";

const Following = () => {
    const currentUser = useSelector(selectCurrent);

    if (!currentUser) {
        return null;
    }

    return currentUser.following.length > 0 ? (
        <div className="gap-5 flex flex-col">
            {
                currentUser.following.map(user => (
                    <Link to={`/users/${user.follower}`}>
                        <Card>
                            <CardBody className="block">
                                <User
                                    name={user.following.name ?? ''}
                                    avatarUrl={user.following.avatarUrl ?? ''}
                                    description={user.following.email ?? ''}
                                />
                            </CardBody>
                        </Card>
                    </Link>
                ))
            }
        </div>
    ) : (
        <h1>You have no followings</h1>
    )
};

export default Following;
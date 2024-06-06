import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {Button, Card, Image, useDisclosure} from "@nextui-org/react";
import {useDispatch, useSelector} from "react-redux";
import {resetUser, selectCurrent} from "../../features/user/userSlice";
import {useGetUserByIdQuery, useLazyCurrentQuery, useLazyGetUserByIdQuery} from "../../app/services/usersApi";
import {useFollowUserMutation, useUnfollowUserMutation} from "../../app/services/followApi";
import GoBack from "../../components/go-back";
import {BASE_URL} from "../../contstants";
import {MdOutlinePersonAddAlt1, MdOutlinePersonAddDisabled} from "react-icons/md";
import {CiEdit} from "react-icons/ci";
import ProfileInfo from "../../components/profile-info";
import {formatToClientDate} from "../../utils/format-to-client-date";
import CountInfo from "../../components/count-info";
import EditProfile from "../../components/edit-profile";

const UserProfile = () => {
    const { id } = useParams<{ id: string }>()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const currentUser = useSelector(selectCurrent);
    const { data } = useGetUserByIdQuery(id ?? '');
    const [followUser] = useFollowUserMutation();
    const [unfollowUser] = useUnfollowUserMutation();
    const [triggerGetUserByIdQuery] = useLazyGetUserByIdQuery();
    const [triggerCurrentQuery] = useLazyCurrentQuery();

    const dispatch = useDispatch();
    useEffect(() => () => {
        dispatch(resetUser())
    }, []);

    const handleFollow = async () => {
        try {
            if (id) {
                data?.isFollowing ? await unfollowUser(id).unwrap() : await followUser({ followingId: id }).unwrap();
                await triggerGetUserByIdQuery(id);
                await triggerCurrentQuery();
            }
        } catch (error) {

        }
    }

    const handleClose = async () => {
        try {
            if (id) {
                await triggerGetUserByIdQuery(id);
                await triggerCurrentQuery();
                onClose();
            }
        } catch (error) {
            console.error(error)
        }
    }

    if(!data) {
        return null
    }

    return (
        <>
            <GoBack />
            <div className="flex items-stretch gap-4">
                <Card className="flex flex-col items-center text-center space-y-4 p-5 flex-2">
                    <Image
                        src={`${BASE_URL}${data.avatarUrl}`}
                        alt={data.name}
                        width={200}
                        height={200}
                        className="border-4 border-white"
                    />
                    <div className="flex flex-col text-2xl font-bold gap-4 item-center">
                        {data.name}
                        {
                            currentUser?.id !== id ? (
                                <Button
                                    color={data.isFollowing ? 'default' : 'primary'}
                                    variant="flat"
                                    className="gap-2"
                                    endContent={ data.isFollowing ? <MdOutlinePersonAddDisabled /> : <MdOutlinePersonAddAlt1 /> }
                                    onClick={handleFollow}
                                >
                                    { data.isFollowing ? "Unfollow" : "Follow"}
                                </Button>
                            ) : (
                                <Button endContent={<CiEdit />} onClick={onOpen}>
                                    Edit
                                </Button>
                            )
                        }
                    </div>
                </Card>
                <Card className="flex flex-col space-y-4 p-5 flex-1">
                    <ProfileInfo title="Email" info={data.email} />
                    <ProfileInfo title="Location" info={data.location} />
                    <ProfileInfo title="Date of birth" info={formatToClientDate(data.dateOfBirth)} />
                    <ProfileInfo title="Bio" info={data.bio} />

                    <div className="flex gap-2">
                        <CountInfo count={data.followers.length} title="Followers" />
                        <CountInfo count={data.following.length} title="Followings" />
                    </div>
                </Card>
            </div>
            <EditProfile isOpen={isOpen} onClose={handleClose} user={data} />
        </>
    );
};

export default UserProfile;
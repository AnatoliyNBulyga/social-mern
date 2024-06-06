import React, {useState} from 'react';
import {
    Card as NextUiCard,
    CardHeader,
    CardBody,
    CardFooter, Spinner,
} from "@nextui-org/react"
import {useLikePostMutation, useUnlikePostMutation} from "../../app/services/likesApi";
import {
    useDeletePostMutation,
    useLazyGetAllPostsQuery,
    useLazyGetPostByIdQuery,
} from "../../app/services/postsApi"
import {useDeleteCommentMutation} from "../../app/services/commentsApi";
import {Link, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrent} from "../../features/user/userSlice";
import auth from "../../pages/auth";
import User from "../user";
import {formatToClientDate} from "../../utils/format-to-client-date";
import {RiDeleteBinLine} from "react-icons/ri";
import Typography from "../typography";
import MetaInfo from "../meta-info";
import {FcDislike} from "react-icons/fc";
import {MdOutlineFavoriteBorder} from "react-icons/md";
import {FaRegComment} from "react-icons/fa";
import ErrorMessage from "../error-message";
import {hasErrorField} from "../../utils/has-error-field";

type CardProps = {
    avatarUrl: string;
    name: string;
    authorId: string;
    content: string;
    commentId?: string;
    likesCount?: number;
    commentsCount?: number;
    createdAt?: Date;
    id?: string;
    cardFor: 'comment' | 'post' | 'current-post'
    likedByUser?: boolean;
}
const Card = ({
    avatarUrl = '',
    name = '',
    authorId = '',
    content = '',
    commentId = '',
    likesCount = 0,
    commentsCount = 0,
    createdAt,
    id = '',
    cardFor = "post",
    likedByUser = false
}: CardProps) => {
    const [likePost] = useLikePostMutation();
    const [unlikePost] = useUnlikePostMutation();
    const [triggerGetAllPosts] = useLazyGetAllPostsQuery();
    const [triggerGetPostById] = useLazyGetPostByIdQuery();
    const [deletePost, deletePostStatus] = useDeletePostMutation();
    const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation();
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrent);

    const refetchPosts = async () => {
        switch (cardFor) {
            case 'post':
                await triggerGetAllPosts().unwrap();
                break;
            case 'current-post':
                await triggerGetPostById(id).unwrap();
                break;
            case 'comment':
                await triggerGetPostById(id).unwrap();
                break;
            default:
                throw new Error('Invalid argument cardFor')
        }
    }

    const handleLikeClick = async () => {
        try {
            likedByUser
            ? await unlikePost(id).unwrap()
                : await likePost({ postId: id }).unwrap()

            await refetchPosts();

        } catch (error) {
            if (hasErrorField(error)) {
                setError(error.data.error);
            } else {
                setError(error as string);
            }
        }
    }

    const handleDelete = async () => {
        try {
            switch (cardFor) {
                case "post":
                    await deletePost(id).unwrap();
                    await refetchPosts();
                    break;
                case "current-post":
                    await deletePost(id).unwrap();
                    navigate('/');
                    break;
                case "comment":
                    await deleteComment(commentId).unwrap();
                    await refetchPosts();
                    break;
                default:
                    throw new Error('Invalid argument cardFor')
            }
        } catch (error) {
            if (hasErrorField(error)) {
                setError(error.data.error);
            } else {
                setError(error as string);
            }

        }
    }
    console.log('likeByUser ', likedByUser)
    return (
        <NextUiCard className="mb-5">
            <CardHeader className="justify-between items-center bg-transparent">
                <Link to={`/users/${authorId}`}>
                    <User
                        name={name}
                        className="text-small font-semibold leading-none text-default-600"
                        avatarUrl={avatarUrl}
                        description={createdAt && formatToClientDate(createdAt)}
                    />
                </Link>
                {
                    authorId === currentUser?.id && (
                        <div className="cursor-pointer" onClick={handleDelete}>
                            {
                                deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
                                    <Spinner />
                                ) : (
                                    <RiDeleteBinLine />
                                )
                            }
                        </div>
                    )
                }
            </CardHeader>
            <CardBody className="px-3 py-2 mb-5">
                <Typography>{ content }</Typography>
            </CardBody>
            {
                cardFor !== 'comment' && (
                    <CardFooter className="gap-3">
                        <div className="flex gap-5 items-center">
                            <div onClick={handleLikeClick}>
                                <MetaInfo
                                    count={likesCount}
                                    Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
                                />
                            </div>
                            <Link to={`/posts/${id}`}>
                                <MetaInfo count={commentsCount} Icon={FaRegComment}/>
                            </Link>
                        </div>
                        <ErrorMessage error={error} />
                    </CardFooter>
                )
            }
        </NextUiCard>
    );
};

export default Card;
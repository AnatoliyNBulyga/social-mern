import React, {useContext, useState} from 'react';
import {User} from "../../app/types";
import {ThemeContext} from "../theme-provider";
import {useUpdateUserMutation} from "../../app/services/usersApi";
import {useParams} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {Modal, ModalContent, ModalHeader, ModalBody, Textarea, ModalFooter, Button} from "@nextui-org/react";
import Input from "../input";
import {MdOutlineEmail} from "react-icons/md";
import ErrorMessage from "../error-message";
import {hasErrorField} from "../../utils/has-error-field";

type EditProfileProps = {
    isOpen: boolean;
    onClose: () => void;
    user?: User;
}
const EditProfile: React.FC<EditProfileProps> = ({
    isOpen,
    onClose,
    user
}) => {
    const { theme } = useContext(ThemeContext);
    const [updateUser, { isLoading }] = useUpdateUserMutation();
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { id } = useParams<{ id: string }>();

    const {handleSubmit, control} = useForm<User>({
        mode: 'onChange',
        reValidateMode: 'onBlur',
        defaultValues: {
            email: user?.email,
            name: user?.name,
            dateOfBirth: user?.dateOfBirth,
            bio: user?.bio,
            location: user?.location
        }
    })

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            setSelectedFile(e.target.files[0])
        }
    }

    const onSubmit = handleSubmit(async (data: User) => {
       if (id) {
           try {
                const formData = new FormData();
                data.name && formData.append('name', data.name);
                data.email && data.email !== user?.email && formData.append('email', data.email);
                data.dateOfBirth && formData.append(
                    'dateOfBirth',
                    new Date(data.dateOfBirth).toISOString()
                )
               data.bio && formData.append('bio', data.bio);
                data.location && formData.append('location', data.location);
                selectedFile && formData.append('avatar', selectedFile);

                await updateUser({ userData: formData, id }).unwrap();

                onClose()

           } catch (error) {
               if (hasErrorField(error)) {
                   setError(error.data.error)
               }
           }
       }
    })

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className={`${theme} text-foreground py-4`}
        >
            <ModalContent>
                {
                    (onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Update profile
                            </ModalHeader>
                            <ModalBody>
                                <form
                                    className="flex flex-col gap-4"
                                    onSubmit={onSubmit}
                                >
                                    <Input
                                        control={control}
                                        name="email"
                                        label="Email"
                                        type="email"
                                        endContent={<MdOutlineEmail />}
                                    />
                                    <Input
                                        control={control}
                                        name="name"
                                        label="Name"
                                        type="text"
                                    />
                                    <input
                                        type="file"
                                        name="avatarUrl"
                                        placeholder="Upload file"
                                        onChange={handleFileChange}
                                    />
                                    <Input
                                        control={control}
                                        name="dateOfBirth"
                                        label="Date of birth"
                                        type="date"
                                        placeholder="Date of Birth"
                                    />
                                    <Controller
                                        name="bio"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                {...field}
                                                rows={4}
                                                placeholder="Your bio"
                                            />
                                        )}
                                    />

                                    <Input
                                        control={control}
                                        name="location"
                                        label="Location"
                                        type="text"
                                    />

                                    <ErrorMessage error={error} />
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            fullWidth
                                            color="primary"
                                            type="submit"
                                            isLoading={isLoading}
                                        >
                                            Update
                                        </Button>
                                    </div>
                                </form>
                            </ModalBody>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    );
};

export default EditProfile;
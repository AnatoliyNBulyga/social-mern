import React, {useState} from 'react';
import Input from "../../components/input";
import {Link} from "@nextui-org/react";
import Button from "../../components/button";
import {useForm} from "react-hook-form";
import {useRegisterMutation} from "../../app/services/usersApi";
import {hasErrorField} from "../../utils/has-error-field";
import ErrorMessage from "../../components/error-message";

type RegisterData = {
    email: string;
    name: string;
    password: string;
}

type RegisterProps = {
    setSelected: (value: string) => void
}

const Register = ({ setSelected }: RegisterProps) => {
    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<RegisterData>({
        mode: 'onChange',
        reValidateMode: 'onBlur',
        defaultValues: {
            email: '',
            name: '',
            password: ''
        }
    });
    const [ register, { isLoading } ] = useRegisterMutation();
    const [error, setError] = useState("")
    const onSubmit = async (data: RegisterData) => {
        try {
            await register(data).unwrap();
            setSelected('sign-in')
        } catch (error) {
            if(hasErrorField(error)) {
                setError(error.data.error)
            }
        }
    }
    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
                control={control}
                name="name"
                type="text"
                label="Name"
                required="Required field"
            />
            <Input
                control={control}
                name="email"
                label="Email"
                type="email"
                required="Required field"
            />
            <Input
                control={control}
                name="password"
                label="Password"
                type="password"
                required="Required field"
            />

            <ErrorMessage error={error} />

            <p className="text-center text-small">
                Already have an account?{' '}
                <Link
                    size="sm"
                    className="cursor-pointer"
                    onPress={() => setSelected("sign-in")}
                >
                    Sign In
                </Link>
            </p>

            <div className="flex gap-2 justify-end">
                <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
                    Sign Up
                </Button>
            </div>
        </form>
    );
};

export default Register;
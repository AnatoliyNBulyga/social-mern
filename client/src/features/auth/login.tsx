import React, {useState} from 'react';
import {useForm} from "react-hook-form";
import Input from "../../components/input";
import {Link} from "@nextui-org/react";
import Button from "../../components/button";
import {useLazyCurrentQuery, useLoginMutation} from "../../app/services/usersApi";
import {useNavigate} from "react-router-dom";
import { hasErrorField } from "../../utils/has-error-field"
import ErrorMessage from "../../components/error-message";

type LoginData = {
    email: string;
    password: string;
}

type LoginProps = {
    setSelected: (value: string) => void
}
const Login: React.FC<LoginProps> = ({
    setSelected
}) => {
    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<LoginData>({
        mode: 'onChange',
        reValidateMode: 'onBlur',
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [triggerCurrentQuery] = useLazyCurrentQuery();
    const onSubmit = async (data: LoginData) => {
        try {
            await login(data).unwrap()
            await triggerCurrentQuery().unwrap()
            navigate("/")
        } catch (error) {
            if (hasErrorField(error)) {
                setError(error.data.error)
            }
        }
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
                control={control}
                name="email"
                label="Email"
                type="email"
                required="Required"
            />
            <Input
                control={control}
                name="password"
                label="Password"
                type="password"
                required="Required"
            />

            <ErrorMessage error={error} />

            <p className="text-center text-small">
                Don't have an account?{' '}
                <Link
                    size="sm"
                    className="cursor-pointer"
                    onPress={() => setSelected("sign-up")}
                >
                    Sign Up
                </Link>
            </p>

            <div className="flex gap-2 justify-end">
                <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
                    Sign In
                </Button>
            </div>
        </form>
    );
};

export default Login;
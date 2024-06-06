import React, {useState} from 'react';
import {Card, CardBody, Tab, Tabs} from "@nextui-org/react";
import Login from "../../features/auth/login";
import Register from "../../features/auth/register";

const Auth = () => {
    const [selected, setSelected] = useState('sign-in')
    return (
        <div className='flex items-center justify-center h-screen'>
            <div className="flex flex-col">
                <Card className="max-w-full w-[340px] h-[450px]">
                    <CardBody className="overflow-hidden">
                        <Tabs
                            fullWidth
                            size='md'
                            selectedKey={selected}
                            onSelectionChange={(key) => setSelected(key as string)}
                        >
                            <Tab key="sign-in" title="Sign In">
                                <Login setSelected={setSelected} />
                            </Tab>
                            <Tab key="sign-up" title="Sign Up">
                                <Register setSelected={setSelected} />
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Auth;
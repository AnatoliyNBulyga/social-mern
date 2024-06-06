import React from 'react';

type ContainerProps = {
    children: React.ReactElement[] | React.ReactElement
}

const Container = ({ children }: ContainerProps) => {
    return (
        <div className="flex max-w-screen-xl mx-auto mt-10">
            {children}
        </div>
    );
};

export default Container;
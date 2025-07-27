import React from "react";
import Button from "../components/Button";
import HeadBarView from "../components/HeadBarView";
import Input from "../components/Input";
import SideBarView from "../components/SideBarView";
import type {ValidationResult} from "shared-modules";
import {AuthApi, validateForgotPasswordInput} from "shared-modules";

const ForgotPassword = () => {
    const [email, setEmail] = React.useState("");
    const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
    const baseURL = "http://localhost:3000/api";

    console.log(errorMessages);

    const validateUser = (email: string) => {

        const result: ValidationResult = validateForgotPasswordInput(email)

        if (!result.isValid) {
            setErrorMessages(result.errors)
            console.error(result.errors)
            return
        }
        forgotPassword(email)
    }

    const forgotPassword = async (email: string) => {
        const authApi = new AuthApi(baseURL);
        try {
            await authApi.forgotPassword({email})
        } catch (error) {
            console.error("Reset Password Failed: ", error)
        }
    }
    return (<div className="w-full h-dvh lg:flex lg:flex-row">
        {/* Heading only visible to mobile screen */}
        <HeadBarView/>

        {/* SideBar only visible to desktop */}
        <SideBarView/>

        {/* Authentication Details visible to both mobile and desktop */}
        <div className="h-3/4 lg:h-full lg:w-2/3 flex flex-col justify-center items-center">
            <div className="lg:w-full max-w-lg px-4">
                <p className="text-2xl mb-5 lg:text-4xl text-center">
                    Reset Password
                </p>
                <p className="text-sm text-center mb-5">A password reset link will be sent to your email
                    address.</p>
                <div className="grid gap-4 mb-5 lg:gap-6">
                    <Input
                        type="Email"
                        placeholder="Email"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            setEmail(e.target.value);
                        }}
                    />
                </div>
                <Button title="Next" onClick={() => {
                    validateUser(email)
                }}/>
            </div>
        </div>
    </div>);
};

export default ForgotPassword;

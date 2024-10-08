import InputComponent from "../component/Input.component.jsx";
import CheckboxComponent from "../component/Checkbox.component.jsx";
import ButtonComponent from "../component/Button.component.jsx";
import LinkTextComponent from "../component/LinkText.component.jsx";
import HorizontalRuler from "../component/HorizontalRuler.component.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useFirebase } from "../context/Firebase.context.jsx";
import useErrorHandlerComponent from "../hooks/LoginErrorHandler.hook.jsx";
import { ProfileImageUploader } from "./ProfileImage.component.jsx";
import { DifferentSignInMethodComponent } from "./DifferentSignInMethod.component.jsx";
import { sendEmailVerification } from "firebase/auth";

const SignUpWithEmailComponent = () => {
    const {
        signUpUserWithEmailAndPasswordWithImage,
        signUpUserWithEmailAndPasswordWithOutImage,
        isLoggedIn,
        firebaseAuth,
        loading,
    } = useFirebase();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn && !loading) navigate("/");
    }, [isLoggedIn, loading, navigate]);

    const [profileImage, setProfileImage] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const { generateErrorMessage } = useErrorHandlerComponent();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSizeMB = 1;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            toast.error("Maximum file size is 1MB");
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            toast.error("Allowed file types are .jpg, .jpeg, .png, .gif");
            return;
        }

        setProfileImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmedPassword) {
            return toast.error("Passwords do not match. Please try again.");
        }
        if (password.length < 8) {
            return toast.error("Password must be at least 8 characters long.");
        }

        const signUpPromise = async () => {
            if (profileImage !== null) {
                await signUpUserWithEmailAndPasswordWithImage(
                    email,
                    password,
                    name,
                    profileImage,
                );
            } else {
                await signUpUserWithEmailAndPasswordWithOutImage(
                    email,
                    password,
                    name,
                );
            }
            sendEmailVerification(firebaseAuth.currentUser)
                .then(() => {
                    console.log("Verification email sent successfully.");
                    toast.success(
                        "Verification email sent successfully. Please check your inbox.",
                    );
                })
                .catch((error) => {
                    console.log(error);
                    toast.error(
                        "An error occurred while sending the verification email. Please try again later.",
                    );
                });
        };

        console.log(firebaseAuth);

        toast.promise(signUpPromise(), {
            loading: "Processing sign-up, please wait...",
            success: "Sign-up successful! Welcome aboard.",
            error: (error) => {
                console.log(error);
                return generateErrorMessage(error.code);
            },
        });
    };

    return (
        <>
            <div className="grid content-center gap-4 bg-gray-100/50 animate-in fade-in">
                <form
                    onSubmit={handleSubmit}
                    className="m-auto max-h-fit w-fit min-w-full rounded-xl bg-white p-8 text-body shadow sm:min-w-[30rem]"
                >
                    <h1 className="text-2xl font-semibold">
                        Create a new Account
                    </h1>
                    <p className="mb-2 text-gray-500">
                        Add your details to get started
                    </p>
                    <ProfileImageUploader
                        profileImage={profileImage}
                        handleFileChange={handleFileChange}
                    />
                    <InputComponent
                        required
                        autoFocus
                        name="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                    />
                    <InputComponent
                        required
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                    <InputComponent
                        required
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
                    <InputComponent
                        required
                        name="confirmedPassword"
                        type="password"
                        value={confirmedPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                        placeholder="Confirm Password"
                    />
                    <CheckboxComponent
                        required
                        checkBoxLabel={
                            <>
                                I agree with{" "}
                                <LinkTextComponent to="/" text="Terms" /> and{" "}
                                <LinkTextComponent to="/" text="Privacy" />
                            </>
                        }
                    />
                    <ButtonComponent type="submit" text="Sign up" />
                    <HorizontalRuler />
                    <div className="flex flex-wrap justify-center gap-2 px-8 text-center">
                        <p>Already have an account?</p>
                        <LinkTextComponent to="/login/email" text="Log in" />
                    </div>
                </form>
                <DifferentSignInMethodComponent />
            </div>
        </>
    );
};

export default SignUpWithEmailComponent;

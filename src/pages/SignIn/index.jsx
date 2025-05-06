import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 


const SignInPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form validation logic
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Submit form data
        console.log('Form submitted:', formData);
        // Here you would typically call an API to register the user
    };

    const handleGoogleSignUp = () => {
        console.log('Sign up with Google');
        // Implement Google OAuth logic here
    };

    const navigate = useNavigate(); // <-- инициализация хука

    return (
        <div className="min-h-screen w-full bg-[#ebdccb] flex items-center justify-center p-4">
            <div className="w-full max-w-[1440px] max-h-[1024px] flex items-center justify-center rounded-[20px] shadow-lg overflow-visible">
                {/* Left Panel with Abstract Design */}
                <div className="relative w-[640px] h-[864px] flex rounded-l-[20px] overflow-hidden bg-[#f9f9f9]"
                    style={{ boxShadow: "-1px 4px 12px 4px rgba(0, 0, 0, 0.3)" }}>
                    <img src="/images/img_mask_group_welcome.svg" alt="Abstract background" className="absolute inset-0 w-full h-full" />
                    <div className="absolute w-[480px] h-[166px] left-[80px] top-[618px]">
                        <h1 className="absolute text-[80px] font-normal font-['Americana_BT'] text-[#2a2a2a] leading-[93px] left-[104px] top-0">Welcome</h1>
                        <h2 className="absolute text-[80px] font-normal font-['Americana_BT'] text-[#2a2a2a] leading-[93px] left-0 top-[92px]">to Journal!</h2>
                    </div>
                </div>

                {/* Right Panel with Sign Up Form */}
                <div className="relative w-[640px] h-[864px] p-10 flex flex-col items-center rounded-r-[20px] bg-[#f9f9f9]"
                    style={{ boxShadow: "-6px 0px 20px rgba(0, 0, 0, 0.25), 4px 4px 12px 4px rgba(0, 0, 0, 0.3), inset 4px 0px 4px rgba(0, 0, 0, 0.25)", }}>

                    <div className="absolute flex flex-col items-center top-[160px] gap-y-[160px]" >
                        <div className="w-full max-w-[320px] mx-auto flex flex-col gap-y-[40px]">
                            <h2 className="text-[32px] font-normal font-['Americana_BT'] text-black mb-10 text-center">Sign In</h2>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-y-[40px]">
                                <div className="flex flex-col gap-y-[40px]">
                                    <div className="border-b border-[#2a2a2a] pb-1">
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="User name (email)"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="w-full bg-transparent focus:outline-none placeholder:text-[#2a2a2a] placeholder:font-[200] placeholder:font-montserrat focus:placeholder-transparent"
                                            required
                                        />
                                    </div>

                                    <div className="border-b border-[#2a2a2a] pb-1">
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-transparent focus:outline-none placeholder:text-[#2a2a2a] placeholder:font-[200] placeholder:font-montserrat focus:placeholder-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    onClick={() => navigate('/homepage')} // <-- переход по нажатию
                                    className="w-full h-[56px] border-3 border-[#c3dee1] rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-[#c3dee1] active:scale-95"
                                >
                                    <span className="text-[20px] font-normal font-montserrat text-[#2a2a2a]">Sign In</span>
                                </button>
                            </form>

                            <div className="flex flex-col gap-y-[20px]">
                                <div className="flex items-center justify-center gap-x-[6px]">
                                    <div className="h-[3px] w-[145px] bg-[#c3dee1]"></div>
                                    <span className="mx-3 text-[20px] font-[300] font-montserrat text-[#2a2a2a]">or</span>
                                    <div className="h-[3px] w-[146px] bg-[#c3dee1]"></div>
                                </div>

                                <div className="flex justify-center">
                                    <button
                                        onClick={handleGoogleSignUp}
                                        className="flex items-center justify-center"
                                    >
                                        <img src="/images/img_group_1.svg" alt="Google sign in" className="w-[39px] h-[39px] cursor-pointer active:scale-95" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center flex-col gap-y-[40px]">
                            <div className="flex text-center">
                                <Link to="/forgotpassword" className="text-[20px] text-[#92c9cf] font-[600] hover:underline">Forgot Password?</Link>
                            </div>

                            <div className="flex text-center">
                                <p className="text-[20px] font-[300] font-montserrat text-[#2a2a2a]">
                                    Don't have an account? <Link to="/signup" className="text-[#92c9cf] font-[600] hover:underline">Sign up</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignInPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState(""); // <-- стан для помилок
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const navigate = useNavigate(); // <-- инициализация хука

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Вимикає перезавантаження сторінки
    setError(""); // очищення старої помилки
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          login: formData.username,
          password: formData.password,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // Токен з серверу
      const token = response.data.token;

      // Зберігаєм токен
      localStorage.setItem("token", token);

      // Перехід післе успішного входу
      navigate("/homepage");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      setError("Unfortunately, you entered an incorrect login or password. Try again."); // <-- зберігаємо помилку
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Sign up with Google");
    // Implement Google OAuth logic here
  };

  return (
    <div className="min-h-screen w-full bg-[#ebdccb] flex items-center justify-center p-4">
      <div className="w-full max-w-[1440px] max-h-[1024px] flex items-center justify-center rounded-[20px] overflow-visible">
        {/* Left Panel with Abstract Design */}
        <div
          className="relative w-[640px] h-[864px] flex rounded-l-[20px] overflow-hidden bg-[#f9f9f9]"
          style={{ boxShadow: "-1px 4px 12px 4px rgba(0, 0, 0, 0.3)" }}
        >
          <img
            src="/images/img_mask_group_welcome.svg"
            alt="Abstract background"
            className="absolute inset-0 w-full h-full"
          />
          <div className="absolute w-[480px] h-[166px] left-[80px] top-[618px]">
            <h1 className="absolute text-[80px] font-normal font-['Americana_BT'] text-[#2a2a2a] leading-[93px] left-[104px] top-0">
              Welcome
            </h1>
            <h2 className="absolute text-[80px] font-normal font-['Americana_BT'] text-[#2a2a2a] leading-[93px] left-0 top-[92px]">
              to Journal!
            </h2>
          </div>
        </div>

        {/* Right Panel with Sign Up Form */}
        <div
          className="relative w-[640px] h-[864px] p-[80px] flex flex-col items-center rounded-r-[20px] bg-[#f9f9f9]"
          style={{
            boxShadow:
              "-6px 0px 20px rgba(0, 0, 0, 0.25), 4px 4px 12px 4px rgba(0, 0, 0, 0.3), inset 4px 0px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <div className="flex flex-col items-center mt-[80px]">
            <div className="w-full max-w-[320px] mx-auto flex flex-col gap-y-[40px]">
              <h2 className="text-[32px] font-normal font-['Americana_BT'] text-black mb-10 text-center">
                Sign In
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-y-[40px]">
                <div className="flex flex-col gap-y-[40px]">
                  <div className="border-b border-[#2a2a2a] pb-1 text-[#2a2a2a] font-[300] font-montserrat">
                    <input
                      type="text"
                      name="username"
                      placeholder="User name (email)"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full pl-[4px] bg-transparent focus:outline-none placeholder:text-[#2a2a2a] placeholder:font-[200] placeholder:font-montserrat placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-30"
                      required
                    />
                  </div>

                  <div className="relative border-b border-[#2a2a2a] pb-1 text-[#2a2a2a] font-[300] font-montserrat">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-[4px] bg-transparent focus:outline-none placeholder:text-[#2a2a2a] placeholder:font-[200] placeholder:font-montserrat placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-30"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-[4px] top-[8px] transform -translate-y-1/2"
                    >
                      <img
                        src={showPassword ? "/images/img_eye_open.svg" : "/images/img_eye_close.svg"}
                        alt="Toggle visibility"
                        className="border-[#93C9CF] cursor-pointer"
                      />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
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
                  <button onClick={handleGoogleSignUp} className="flex items-center justify-center">
                    <img
                      src="/images/img_group_1.svg"
                      alt="Google sign in"
                      className="w-[39px] h-[39px] cursor-pointer active:scale-95"
                    />
                  </button>
                </div>

                {error && <div className="text-[#F15050] font-montserrat text-sm text-center">{error}</div>}
              </div>
            </div>
          </div>

          <div className="absolute bottom-[72px] flex items-center flex-col gap-y-[20px]">
            <div className="flex text-center">
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-[20px] text-[#92c9cf] font-[600] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <div className="flex text-center">
              <p className="text-[20px] font-[300] font-montserrat text-[#2a2a2a]">
                Don't have an account?{" "}
                <Link to="/signup" className="text-[#92c9cf] font-[600] hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      {showForgotPasswordModal && (
        <div className="absolute w-full h-full flex justify-center items-center z-[200]">
          <div className="absolute inset-0 bg-[#2a2a2a] opacity-73 z-[190]" />
          <div className="relative flex flex-col bg-[#F9F9F9] rounded-[10px] w-[350px] shadow-xl z-[200] gap-y-[20px] py-[40px]">
            <h2 className="text-[32px] font-['Americana_BT'] text-center">
              Change password
            </h2>

            <input
              type="email"
              placeholder="Enter your user email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="mx-[40px] w-[calc(100%-80px)] border-b border-[#2a2a2a] text-[#2a2a2a] font-[300] font-montserrat bg-transparent focus:outline-none placeholder:text-[#2a2a2a] placeholder:font-[200] placeholder:font-montserrat placeholder:transition-opacity placeholder:duration-300 focus:placeholder:opacity-30"
              required
            />

            {forgotError && (
              <p className="text-center text-[#F15050] mt-2 max-w-[250px] mx-auto break-words">{forgotError}</p>
            )}
            {forgotSuccess && (
              <p className="text-center text-[#56CD5A] mt-2 max-w-[250px] mx-auto break-words">{forgotSuccess}</p>
            )}

            <div className="flex justify-center gap-x-[28px] mt-4 ">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  setForgotEmail('');      // скидаємо введений email
                  setForgotError('');      // скидаємо помилку
                  setForgotSuccess('');    // скидаємо повідомлення про успіх
                }
                }
                className="border-3 border-[#C3DEE1] px-[20px] py-[4px] rounded-[10px] hover:bg-[#c3dee1] cursor-pointer text-[20px] text-[#2a2a2a] font-[400] font-montserrat"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setForgotError('');
                  setForgotSuccess('');
                  try {
                    const response = await axios.post(
                      `${import.meta.env.VITE_API_URL}/api/forgot-password`,
                      { email: forgotEmail },
                      {
                        headers: {
                          Accept: 'application/json',
                          'Content-Type': 'application/json',
                        },
                      }
                    );
                    setForgotSuccess('Check the message on the specified email');
                    setForgotEmail('');
                  } catch (error) {
                    if (
                      error.response &&
                      error.response.data &&
                      error.response.data.message
                    ) {
                      setForgotError(error.response.data.message);
                    } else {
                      setForgotError('Unfortunately, this user does not exist. Try again.');
                    }
                  }
                }}
                className="border-3 border-[#C3DEE1] px-[20px] py-[4px] rounded-[10px] hover:bg-[#c3dee1] cursor-pointer text-[20px] text-[#2a2a2a] font-[400] font-montserrat"
              >
                Send email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInPage;

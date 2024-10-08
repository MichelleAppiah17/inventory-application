import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import googleLogo from "../assets/googleLogo.png";
import * as Switch from "@radix-ui/react-switch";

const Login = () => {
  const { login, loginWithGoogle } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isBuyer, setIsBuyer] = useState(true); // true for buyer, false for seller
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;

    login(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // alert("Login successful!!");
        if (isBuyer) {
          navigate("/", { replace: true });
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (
          errorCode === "auth/wrong-password" ||
          errorCode === "auth/user-not-found"
        ) {
          setError("Incorrect Email or Password");
        } else {
          setError(errorMessage);
        }
      });
  };

  const handleRegister = () => {
    loginWithGoogle()
      .then((result) => {
        const user = result.user;
        // alert("Login successful!");
        if (isBuyer) {
          navigate("/", { replace: true });
        } else {
          navigate("/admin/dashboard", { replace: true });
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  useEffect(() => {
    if (from === "/admin/dashboard") {
      setIsBuyer(false);
    }
  }, [from]);

  return (
    <div className='min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12'>
      <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
        <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
          <div className='max-w-md mx-auto'>
            <div>
              <h1 className='text-2xl font-semibold'>Log In Form</h1>
            </div>
            <div className='divide-y divide-gray-200'>
              <form
                onSubmit={handleLogin}
                className='py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7'>
                <div className='relative'>
                  <input
                    id='email'
                    name='email'
                    type='text'
                    className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600'
                    placeholder='Email address'
                  />
                </div>
                <div className='relative'>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    className='peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600'
                    placeholder='Password'
                  />
                </div>
                {error && (
                  <p className='text-red-600 text-base'>{error}</p>
                )}
                <div className='flex items-center space-x-2'>
                  <h2>Continue as a</h2>
                  <Switch.Root
                    className={`w-[42px] h-[25px] bg-gray-200 rounded-full relative shadow-sm focus:outline-none cursor-pointer transition-colors ${
                      isBuyer ? "bg-blue-500" : "bg-gray-300"
                    }`}
                    id='buyerSellerSwitch'
                    checked={!isBuyer}
                    onCheckedChange={(checked) =>
                      setIsBuyer(!checked)
                    }
                    style={{
                      WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                    }}>
                    <Switch.Thumb
                      className={`block w-[21px] h-[21px] bg-white rounded-full shadow transition-transform ${
                        isBuyer
                          ? "translate-x-0.5"
                          : "translate-x-[19px]"
                      }`}
                    />
                  </Switch.Root>

                  <p>{isBuyer ? "Buyer" : "Seller"}</p>
                </div>
                <p>
                  If you don't have an account, please{" "}
                  <Link
                    to='/sign-up'
                    className='text-blue-600 underline'>
                    Sign up
                  </Link>{" "}
                  here.
                </p>

                <div className='relative'>
                  <button className='bg-blue-500 text-white rounded-md px-2 py-1'>
                    Log In
                  </button>
                </div>
              </form>
            </div>
            <hr />
            <div className='flex w-full items-center flex-col mt-5 gap-3'>
              <button onClick={handleRegister} className='block'>
                <img
                  src={googleLogo}
                  alt='Google Logo'
                  className='w-12 h-12 inline-block'
                />
                Log in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

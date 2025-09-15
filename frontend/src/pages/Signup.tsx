// import bg from "../assets/Gemini_Generated_Image_3xshst3xshst3xsh.png";
import { useState } from "react";
import { useAuthStore } from "../Store/useauthStore";
import { useNavigate } from "react-router-dom";
import { signUp } from "../apiCalls/authcall";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  const handleSubmit = async () => {
    if (!username || !password) {
      console.log("Username and Password are required");
      return;
    }
    if (password.length < 6) {
      console.log("Password must be at least 6 characters");
      return;
    }
    try {
      const response = await signUp(username, password);

      console.log("Sign In Successful", response);

      useAuthStore.setState({
        username: response,
      });

      navigate("/");
      // Clear the form
      setUsername("");
      setPassword("");
    } catch (error) {
      console.error("Error during sign in", error);
      alert("Sign In Failed. Please try again.");
    }
  };

  return (
    <div
      className="relative min-h-dvh w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
    //   style={{ backgroundImage: `url(${bg})` }}
    >
      {/* glass card above the overlay */}
      <div className="relative z-10 flex flex-col items-center gap-4 justify-center w-80 h-80 rounded-xl bg-white/20 backdrop-blur-md ring-1 ring-white/30 shadow-xl">
        <div
          className="flex flex-col  gap-4 items-center justify-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-gray-300 p-2 rounded-md"
          />
          <button
            className="border border-gray-300 p-2 rounded-md w-1/3 mt-5"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;

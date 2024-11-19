import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import app from "../../firebaseConfig.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence,
  User
} from "firebase/auth";

interface ExtendedUserData extends User {
  apiKey: string
  photoURL: string
}

const NavBar = () => {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState<User | {}>({});
  const { pathname } = useLocation();
  const nav = useNavigate();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        nav("/login");
      } else if (user && pathname === "/login") {
        nav("/");
      }
    });

    const windowClosedAutoLogout = async () => {
      try {
        await setPersistence(auth, browserSessionPersistence);
      } catch (error) {
        console.error(error);
      }
    };

    window.addEventListener("beforeunload", windowClosedAutoLogout);

    return () => {
      unsubscribe();
      window.removeEventListener("beforeload", windowClosedAutoLogout);
    };
  }, [pathname]);

  useEffect(() => {
    const sessionSavedUserInfo = sessionStorage.getItem("userInfo");
    if (sessionSavedUserInfo && Object.keys(userData).length === 0) {
      setUserData(JSON.parse(sessionSavedUserInfo));
    }
  }, [userData]);

  const handleAuth = async () => {
    try {
      const userData = await signInWithPopup(auth, provider);
      const { apiKey, ...apiKeyRemovedUserData } = userData.user as ExtendedUserData
      setUserData(apiKeyRemovedUserData);
      sessionStorage.setItem("userInfo", JSON.stringify(apiKeyRemovedUserData));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignout = async () => {
    try {
      await signOut(auth);
      setUserData({});
      sessionStorage.removeItem("userInfo");
    } catch (error) {
      console.error(error);
    }
  };

  const listener = () => {
    if (window.scrollY > 50) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  return (
    <div className="mb-16">
      <nav
        className={`fixed top-0 left-0 right-0 flex justify-between items-center px-9 pb-1 tracking-[16px] z-[100] ${
          show ? "bg-slate-800" : "bg-white"
        }`}
      >
        <a className="p-0 w-14 mt-1">
          <img
            className="w-full cursor-pointer"
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
            alt="poke-logo"
            onClick={() => nav("/")}
          />
        </a>
        {pathname === "/login" ? (
          <a
            onClick={handleAuth}
            className="bg-black bg-opacity-60 px-4 py-2 uppercase tracking-[1.15px] text-[#f9f9f9] border border-[#f9f9f9] rounded-[4px] hover:bg-[#f9f9f9] hover:text-black hover:border-transparent cursor-pointer"
          >
            LOGIN
          </a>
        ) : (
          <div className="relative h-12 w-12 flex cursor-pointer items-center justify-center group">
            <img
              className="rounded-[50%] w-full h-full"
              src={(userData as ExtendedUserData)?.photoURL}
              alt="user_profile_image"
            />
            <div
              className="absolute top-12 right-0 bg-slate-800 border border-slate-900 rounded shadow-md shadow-slate-950 p-[10px] text-sm tracking-[3px] w-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-zinc-200"
              onClick={handleSignout}
            >
              SIGNOUT
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavBar;

import { useLoaderData } from "react-router";
import { logout } from "../controllers/userController";
import { useNavigate } from "react-router";
import { getUser } from "../controllers/userController";

export async function loader() {
    const user = await getUser();
    return { user }
}

export default function Navbar() {
    const data = useLoaderData() || {};
    const user = data.user;
    
    const currentUsername = user?.username ?? "Guest";
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    }

    return (
        <nav className="flex justify-between items-center px-6 h-16 bg-slate-800 text-white shadow-md border-b border-slate-700">
            <h1 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                Last Race
            </h1>

            <div className="flex items-center gap-5">
                <span className="text-sm text-slate-300">
                    Logged in as: <strong className="font-semibold text-white">{currentUsername}</strong>
                </span>

                <button
                    type="submit"
                    onClick={
                        handleLogout

                    }
                    className="px-4 py-1.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium text-sm rounded-md transition-colors duration-150 shadow-sm"
                >
                    Log Out
                </button>
            </div>
        </nav>
    );
}
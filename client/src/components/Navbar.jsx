import { useLoaderData, useNavigate, NavLink } from "react-router";
import { logout } from "../controllers/userController";

export default function Navbar() {
    const data = useLoaderData() || {};
    const user = data.user;

    const currentUsername = user?.username ?? "Guest";
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="flex justify-between items-center px-6 h-16 bg-slate-800 text-white shadow-md border-b border-slate-700">
            <div className="flex items-center gap-8">
                <h1 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                    Last Race
                </h1>

                <div className="flex items-center gap-4">
                    <NavLink
                        to="/app"
                        className={({ isActive }) =>
                            `text-sm font-medium transition-colors ${
                                isActive
                                    ? "text-cyan-400"
                                    : "text-slate-300 hover:text-white"
                            }`
                        }
                    >
                        Game
                    </NavLink>

                    <NavLink
                        to="/history"
                        className={({ isActive }) =>
                            `text-sm font-medium transition-colors ${
                                isActive
                                    ? "text-cyan-400"
                                    : "text-slate-300 hover:text-white"
                            }`
                        }
                    >
                        My Results
                    </NavLink>

                    <NavLink
                        to="/ranking"
                        className={({ isActive }) =>
                            `text-sm font-medium transition-colors ${
                                isActive
                                    ? "text-cyan-400"
                                    : "text-slate-300 hover:text-white"
                            }`
                        }
                    >
                        Ranking
                    </NavLink>
                </div>
            </div>

            <div className="flex items-center gap-5">
                <span className="text-sm text-slate-300">
                    Logged in as:{" "}
                    <strong className="font-semibold text-white">
                        {currentUsername}
                    </strong>
                </span>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-1.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium text-sm rounded-md transition-colors duration-150 shadow-sm"
                >
                    Log Out
                </button>
            </div>
        </nav>
    );
}
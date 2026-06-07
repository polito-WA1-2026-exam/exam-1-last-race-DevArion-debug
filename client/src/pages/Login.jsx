import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { login } from '../controllers/userController';

export default function LoginPage() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    const handleLogin = async (data) => {
        try {
            setLoginError("");
            await login(data.email, data.password);
            navigate('/app');
        } catch (err) {
            setLoginError(err.message || "Login failed.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1428] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e2a4a_1px,transparent_1px),linear-gradient(to_bottom,#1e2a4a_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-6xl grid grid-cols-[1.2fr_0.8fr] gap-8 items-center">
                <section className="text-white space-y-7">
                    <div>
                        <p className="text-sm uppercase tracking-widest text-cyan-300 font-bold">
                            Instructions for visitors
                        </p>

                        <h1 className="text-6xl font-black tracking-tight mt-3">
                            LAST RACE
                        </h1>

                        <p className="text-slate-300 text-lg mt-5 max-w-2xl leading-relaxed">
                            Reach the assigned destination with as many coins as possible. Each game starts with 20 coins, a random start station, and a random destination at least three segments away.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#111827] border border-[#1e2a4a] rounded-xl p-5 space-y-2">
                            <p className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                                How the race works
                            </p>

                            <p className="text-sm text-slate-300">
                                First study the full network map. During planning, the connection lines disappear and you have 90 seconds to rebuild a valid route from the segment list.
                            </p>

                            <p className="text-sm text-slate-300">
                                Segments must connect in order. You may revisit stations, but each segment can be used only once.
                            </p>
                        </div>

                        <div className="bg-[#111827] border border-[#1e2a4a] rounded-xl p-5 space-y-2">
                            <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                                Scoring
                            </p>

                            <p className="text-sm text-slate-300">
                                A valid route is executed one step at a time. Each segment receives a random event that can add or remove coins.
                            </p>

                            <p className="text-sm text-slate-300">
                                Invalid, incomplete, or late routes skip execution and score 0 coins.
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#101a2f] border border-cyan-500/30 rounded-xl p-5">
                        <p className="text-xs uppercase tracking-wider text-cyan-300 font-bold">
                            Anonymous access
                        </p>

                        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                            Visitors can read these instructions only. The map, gameplay, personal history, and general ranking are available after logging in with an account.
                        </p>
                    </div>
                </section>

                <div className="bg-[#111827] border border-[#1e2a4a] rounded-3xl shadow-2xl p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-white">
                            Login
                        </h2>

                        <p className="text-sm text-slate-400 mt-2">
                            Anonymous visitors can read the instructions only. Log in to see the map, play games, and view rankings.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                EMAIL
                            </label>
                            <input
                                type="text"
                                {...register("email", { required: "Email is required" })}
                                placeholder="Enter your email"
                                className="w-full bg-[#1e2a4a] border border-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white rounded-xl px-5 py-3 outline-none transition-all"
                            />
                            {errors.email && (
                                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                {...register("password", { required: "Password is required" })}
                                placeholder="••••••••"
                                className="w-full bg-[#1e2a4a] border border-gray-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white rounded-xl px-5 py-3 outline-none transition-all"
                            />
                            {errors.password && (
                                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        {loginError && (
                            <p className="text-sm text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-lg px-3 py-2">
                                {loginError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-semibold py-4 rounded-2xl transition-all text-lg tracking-wider"
                        >
                            {isSubmitting ? "LOGGING IN..." : "LOGIN"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
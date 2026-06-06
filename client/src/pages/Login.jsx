import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { login } from '../controllers/userController';

export default function LoginPage({ onLogin }) {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm();

    const handleLogin = async (data) => {
        await login(data.email, data.password);
        navigate('/app');
    };

    return (
        <div className="min-h-screen bg-[#0a1428] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e2a4a_1px,transparent_1px),linear-gradient(to_bottom,#1e2a4a_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 pointer-events-none"></div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                        <span className="text-4xl">🚇</span>
                    </div>
                    <h1 className="text-5xl font-bold text-white tracking-tighter">LAST RACE</h1>
                </div>

                <div className="bg-[#111827] border border-[#1e2a4a] rounded-3xl shadow-2xl p-8">
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
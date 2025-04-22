import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import { AppDispatch } from '../store';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function Login() {
    const dispatch = useDispatch<AppDispatch>();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const navigate = useNavigate();
    const onSubmit = async (data: { email: string; password: string }) => {
        try {
            await dispatch(login(data)).unwrap();
            navigate('/orders');
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <div
            className="w-full min-h-screen flex items-center justify-center bg-cover bg-center !p-4 md:p-0"
            style={{ backgroundImage: "url('/auth-background2.jpg')", backgroundSize: 'revert-layer' }}
        >
            <div className="w-full sm:max-w-md lg:max-w-lg bg-gradient-to-t from-gray-800 via-gray-600/60 to-gray-800 rounded-3xl shadow-xl p-6 sm:p-8 animate-fade-in bg-opacity-60">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome Back</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            {...register('email')}
                            className={`mt-1 block placeholder-white w-full px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 bg-transparent text-white transition-all duration-300 ${
                                errors.email ? 'border-red-500 animate-shake' : 'border-gray-500'
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-400 text-sm mt-1 animate-fade-in">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            {...register('password')}
                            className={`mt-1 block w-full placeholder-white px-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 bg-transparent text-white transition-all duration-300 ${
                                errors.password ? 'border-red-500 animate-shake' : 'border-gray-500'
                            }`}
                        />
                        {errors.password && (
                            <p className="text-red-400 text-sm mt-1 animate-fade-in">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white py-2 rounded-xl transition duration-300 shadow-md animate-pulse hover:animate-none hover:bg-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

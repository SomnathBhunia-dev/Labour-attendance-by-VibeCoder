import { useState } from 'react';
import { useStateValue } from '@/context/context';
import { createContractorProfile } from '@/database/index';
import { Timestamp } from 'firebase/firestore';

export default function ProfileSetupModal() {
    const { user, dispatch } = useStateValue();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const userData = {
                name: name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                photoURL: user.photoURL,
                role: 'Contractor',
                createdAt: Timestamp.now(),
            };

            await createContractorProfile(user.uid, userData);

            // Update local state to remove isNewUser flag and add new data
            dispatch({
                type: "SET_AUTH",
                payload: { ...user, ...userData, isNewUser: false }
            });

        } catch (error) {
            console.error("Error creating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-[100]">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome!</h2>
                <p className="text-gray-600 mb-6">Please enter your name to complete your profile.</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Profile...' : 'Get Started'}
                    </button>
                </form>
            </div>
        </div>
    );
}

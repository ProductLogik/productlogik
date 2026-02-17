import { useAuthContext } from '../context/AuthContext';

// Re-export specific parts or the whole context hook
// Keeping it simple as per usage in PricingPage: const { user } = useAuth();
export const useAuth = () => {
    return useAuthContext();
};

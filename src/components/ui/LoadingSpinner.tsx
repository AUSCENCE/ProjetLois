export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    {/* Outer spinning ring */}
                    <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                    {/* Inner spinning ring with gradient */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-brand-500 rounded-full animate-spin"></div>
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Chargement...
                </p>
            </div>
        </div>
    );
}

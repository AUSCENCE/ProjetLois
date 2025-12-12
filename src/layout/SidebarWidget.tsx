import { useAuth } from "../context/AuthContext";
import { UserCircleIcon } from "../icons";

export default function SidebarWidget() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div
      className={`
        mx-auto mb-10 w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]`}
    >
      <div className="mb-3 flex justify-center">
        <div className="text-gray-400 dark:text-gray-500">
          <UserCircleIcon className="w-16 h-16" />
        </div>
      </div>
      <h3 className="mb-1 font-semibold text-gray-900 dark:text-white">
        {user.name}
      </h3>
      <p className="mb-2 text-gray-500 text-theme-sm dark:text-gray-400">
        {user.email}
      </p>
      {user.role && (
        <span className="inline-block px-3 py-1 text-xs font-medium text-brand-600 bg-brand-50 rounded-full dark:bg-brand-500/10 dark:text-brand-400">
          {user.role}
        </span>
      )}
    </div>
  );
}

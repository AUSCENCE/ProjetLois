import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";
import User from "../../../Types/User";

interface UserTableProps {
    users: User[];
    onRoleChange: (userId: number, newRole: string) => void;
    onDelete: (userId: number) => void;
}

export default function UserTable({ users, onRoleChange, onDelete }: UserTableProps) {
    const roles = [
        { value: "admin", label: "Administrateur", color: "error" as const },
        { value: "user", label: "Utilisateur", color: "primary" as const },
        { value: "editor", label: "Éditeur", color: "warning" as const },
        { value: "depute", label: "Député", color: "success" as const },
    ];

    const getRoleBadge = (roleValue: string) => {
        const role = roles.find((r) => r.value === roleValue) || roles[1];
        return (
            <Badge color={role.color} size="sm">
                {role.label}
            </Badge>
        );
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                Nom
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                Email
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                Rôle Actuel
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-center text-theme-sm dark:text-gray-400">
                                Modifier le Rôle
                            </TableCell>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                                        {user.name}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start text-theme-sm">
                                        {getRoleBadge(user.role || "user")}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <select
                                                value={user.role || "user"}
                                                onChange={(e) => user.id && onRoleChange(user.id, e.target.value)}
                                                className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-transparent dark:border-gray-700 dark:text-white/80 focus:outline-none focus:ring-1 focus:ring-brand-500"
                                            >
                                                {roles.map((role) => (
                                                    <option key={role.value} value={role.value}>
                                                        {role.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => user.id && onDelete(user.id)}
                                                className="p-1.5 text-gray-500 hover:text-error-500 transition-colors"
                                                title="Supprimer l'utilisateur"
                                            >
                                                <svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9l4 4m0-4l-4 4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="px-5 py-3 text-center text-gray-500">
                                    Aucun utilisateur trouvé
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import UserTable from "../../components/tables/BasicTables/UserTable";
import { fetchUsers, updateUserRole, deleteUser } from "../../Api/user";
import User from "../../Types/User";
import ComponentCard from "../../components/common/ComponentCard";
import AddUserModal from "./AddUserModal";
import UserCredentialsModal from "./UserCredentialsModal";
import { useModal } from "../../hooks/useModal";

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state
    const { isOpen: isAddOpen, openModal: openAdd, closeModal: closeAdd } = useModal();
    const { isOpen: isCredOpen, openModal: openCred, closeModal: closeCred } = useModal();
    const [newUserInfo, setNewUserInfo] = useState<{ email: string, password?: string }>({ email: "" });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await fetchUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des utilisateurs:", err);
            setError("Impossible de charger la liste des utilisateurs.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddSuccess = (user: User, password?: string) => {
        setNewUserInfo({ email: user.email, password });
        setUsers((prev) => [user, ...prev]);
        openCred();
    };

    const handleRoleChange = async (userId: number, newRole: string) => {
        try {
            await updateUserRole(userId, newRole);
            // Optionnel: Mettre à jour l'état local ou recharger la liste
            setUsers((prevUsers) =>
                prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
            );
        } catch (err) {
            console.error("Erreur lors de la mise à jour du rôle:", err);
            alert("Une erreur est survenue lors de la mise à jour du rôle.");
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            return;
        }
        try {
            await deleteUser(userId);
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
        } catch (err) {
            console.error("Erreur lors de la suppression de l'utilisateur:", err);
            alert("Une erreur est survenue lors de la suppression de l'utilisateur.");
        }
    };

    return (
        <>
            <PageMeta
                title="Gestion des Utilisateurs | ProjetLois"
                description="Liste des utilisateurs et gestion des rôles."
            />
            <PageBreadcrumb pageTitle="Utilisateurs" />

            <div className="space-y-6">
                <ComponentCard
                    title="Liste des Utilisateurs"
                    actions={openAdd}
                    nameAction="Nouveau Membre"
                >
                    {loading ? (
                        <div className="flex items-center justify-center p-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                        </div>
                    ) : error ? (
                        <div className="p-4 text-center text-error-500 bg-error-50 rounded-lg dark:bg-error-500/10">
                            {error}
                        </div>
                    ) : (
                        <UserTable
                            users={users}
                            onRoleChange={handleRoleChange}
                            onDelete={handleDeleteUser}
                        />
                    )}
                </ComponentCard>
            </div>

            <AddUserModal
                isOpen={isAddOpen}
                onClose={closeAdd}
                onSuccess={handleAddSuccess}
            />

            <UserCredentialsModal
                isOpen={isCredOpen}
                onClose={closeCred}
                userEmail={newUserInfo.email}
                password={newUserInfo.password}
            />
        </>
    );
}

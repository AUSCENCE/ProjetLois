import { useState, FormEvent } from "react";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import { createUser } from "../../Api/user";
import User from "../../Types/User";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: User, password?: string) => void;
}

export default function AddUserModal({ isOpen, onClose, onSuccess }: AddUserModalProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("user");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const roles = [
        { value: "admin", label: "Administrateur" },
        { value: "user", label: "Utilisateur" },
        { value: "editor", label: "Éditeur" },
        { value: "depute", label: "Député" },
    ];
    const generatePasswordLocal = () => {
        // créer un mot de passe de 6 caractères numériques
        let pass = "";
        for (let i = 0; i < 6; i++) {
            pass += Math.floor(Math.random() * 10);
        }
        return pass;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const generatedPass = generatePasswordLocal();

        try {
            // Utiliser generatedPass directement car setPassword est asynchrone
            const data = await createUser({ name, email, password: generatedPass, role });
            // Si le backend ne renvoie pas le mot de passe, on utilise celui qu'on a généré
            onSuccess(data.user, data.password || generatedPass);

            setName("");
            setEmail("");
            setRole("user");
            onClose();
        } catch (err: any) {
            console.error("Erreur creation utilisateur:", err);

            // Gestion plus fine des erreurs de validation (422)
            if (err.response?.status === 422 && err.response.data?.errors) {
                const validationErrors = err.response.data.errors;
                const firstError = Object.values(validationErrors)[0];
                setError(Array.isArray(firstError) ? firstError[0] : "Données invalides.");
            } else {
                setError(err.response?.data?.message || "Une erreur est survenue lors de la création de l'utilisateur.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
            <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                <div className="mb-6">
                    <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                        Ajouter un Nouveau Membre
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Remplissez les informations ci-dessous pour créer un nouveau compte utilisateur.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {error && (
                        <div className="p-3 text-sm text-error-500 bg-error-50 rounded-lg dark:bg-error-500/10">
                            {error}
                        </div>
                    )}

                    <div>
                        <Label htmlFor="name">Nom Complet</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Ex: Jean Dupont"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Adresse Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="jean.dupont@exemple.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="role">Rôle</Label>
                        <Select
                            options={roles}
                            value={role}
                            onChange={(value) => setRole(value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 mt-4 lg:justify-end">
                        <Button size="sm" variant="outline" onClick={onClose} disabled={loading}>
                            Annuler
                        </Button>
                        <Button size="sm" type="submit" disabled={loading}>
                            {loading ? "Création..." : "Créer le Membre"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

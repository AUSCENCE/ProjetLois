import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { useState } from "react";
import { useNavigate } from "react-router";
import Form from "../../components/form/Form";
import { ajoutOrganisme } from "../../Api/organisme";

export default function CreateOrganisme() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (!name.trim()) {
            setError("Le nom de l'organisme est requis");
            return;
        }

        setIsLoading(true);
        try {
            await ajoutOrganisme({ name });
            setSuccess("Organisme créé avec succès !");
            setTimeout(() => {
                navigate('/organisme');
            }, 1500);
        } catch (error: any) {
            console.error("Failed to add organisme", error);
            setError(error?.response?.data?.message || "Erreur lors de la création de l'organisme");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageMeta
                title="Projet de Lois | Créer un Organisme"
                description="Créer un Organisme"
            />
            <PageBreadcrumb pageTitle="Créer un Organisme" />
            <ComponentCard title="Enregistrement d'un organisme">
                <Form onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                            {success}
                        </div>
                    )}
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="name">Nom de l'organisme</Label>
                            <Input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex : Présidence"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
                        <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={() => navigate('/organisme')}
                            disabled={isLoading}
                        >
                            Retour
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            variant="primary"
                            disabled={isLoading}
                        >
                            {isLoading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                </Form>
            </ComponentCard>
        </div>
    );
}

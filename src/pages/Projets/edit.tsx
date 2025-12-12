import { getOrganismes } from "../../Api/organisme";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import DatePicker from "../../components/form/date-picker";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Select from "../../components/form/Select";
import Button from "../../components/ui/button/Button";

import { useEffect, useMemo, useState } from "react";
import OrganismeType from "../../Types/Organisme";
import ProjetType from "../../Types/Projet";
import { getProject, updateProject } from "../../Api/project";
import { useNavigate, useParams } from "react-router";
import Form from "../../components/form/Form";
import FileInput from "../../components/form/input/FileInput";

export default function EditProjet() {
    const [organismes, setOrganismes] = useState<OrganismeType[]>([]);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [projet, setProjet] = useState<ProjetType>({
        title: '',
        organisme_id: 0,
        filePath: undefined,
        cloturevoter: undefined,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch organismes
                const orgData = await getOrganismes();
                if (Array.isArray(orgData.data)) {
                    setOrganismes(orgData.data);
                }

                // Fetch project data
                if (id) {
                    const projectData = await getProject(Number(id));
                    setProjet({
                        title: projectData.title || '',
                        organisme_id: projectData.organisme_id || 0,
                        filePath: projectData.filePath,
                        cloturevoter: projectData.cloturevoter ? new Date(projectData.cloturevoter) : undefined,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
                setError("Erreur lors du chargement des données");
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, [id]);

    const options = useMemo(() => {
        if (!Array.isArray(organismes)) return [];
        return organismes.map((org) => ({
            value: String(org.id),
            label: org.name,
        }));
    }, [organismes]);

    const handleSelectChange = (value: string) => {
        const selectedOrg = organismes.find(org => String(org.id) === value);
        if (selectedOrg && selectedOrg.id) {
            setProjet({ ...projet, organisme_id: selectedOrg.id });
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setProjet({ ...projet, filePath: file });
        }
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validation
        if (!projet.title.trim()) {
            setError("Le titre est requis");
            return;
        }
        if (!projet.organisme_id || projet.organisme_id === 0) {
            setError("Veuillez sélectionner un organisme");
            return;
        }
        if (!projet.cloturevoter) {
            setError("Veuillez sélectionner une date de clôture");
            return;
        }

        if (!id) {
            setError("ID du projet manquant");
            return;
        }

        setIsLoading(true);
        try {
            await updateProject(Number(id), projet);
            setSuccess("Projet modifié avec succès !");
            setTimeout(() => {
                navigate('/projets');
            }, 1500);
        } catch (error: any) {
            console.error("Failed to update project", error);
            setError(error?.response?.data?.message || "Erreur lors de la modification du projet");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
            </div>
        );
    }

    return (
        <div>
            <PageMeta
                title="Projet de lois | Modifier Project"
                description="Modifier Project"
            />
            <PageBreadcrumb pageTitle="Modifier le Projet" />
            <ComponentCard title="Modification de projet de lois.">
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
                    <div className=" space-y-6 ">
                        <div>
                            <Label htmlFor="inputTwo">Titre du Projet de Lois</Label>
                            <Input
                                type="text"
                                id="inputTwo"
                                value={projet.title}
                                onChange={(e) => setProjet({ ...projet, title: e.target.value })}
                                placeholder="Lois portant sur l'interdition de corrompre les jeunes"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 space-y-6 space-x-6">
                        <div>
                            <Label>Organisme porteur du Projet de Lois</Label>
                            <Select
                                options={options}
                                value={projet.organisme_id ? String(projet.organisme_id) : ""}
                                placeholder="Selectionnez votre organisme de provenance"
                                onChange={handleSelectChange}
                                className="dark:bg-dark-900"
                            />
                        </div>
                        <div>
                            <DatePicker
                                id="date-picker"
                                label="Date de clôture des votes du Projet de Lois"
                                placeholder="Select a date"
                                defaultDate={projet.cloturevoter}
                                onChange={(dates) => {
                                    if (dates.length > 0) {
                                        setProjet({ ...projet, cloturevoter: dates[0] });
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <Label>Upload file (optionnel - laissez vide pour conserver le fichier actuel)</Label>
                        <FileInput onChange={handleFileChange} className="custom-class" />
                    </div>
                    <div className="flex justify-between mt-2">
                        <Button
                            size="sm"
                            variant="outline"
                            type="button"
                            onClick={() => navigate('/projets')}
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
                            {isLoading ? "Modification..." : "Modifier"}
                        </Button>
                    </div>
                </Form>
            </ComponentCard>
        </div>
    )
}

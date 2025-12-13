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
import { ajoutProject } from "../../Api/project";
import { useNavigate } from "react-router";
import Form from "../../components/form/Form";
import FileInput from "../../components/form/input/FileInput";

export default function CreatedProjet() {
    const [organismes, setOrganismes] = useState<OrganismeType[]>([]);
    const navigate = useNavigate();
    const [projet, setProjet] = useState<ProjetType>({
        title: '',
        organisme_id: 0,
        filePath: undefined,
        cloturevoter: undefined,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);



    useEffect(() => {
        const fetchOrganismes = async () => {
            try {
                const data = await getOrganismes();
                if (Array.isArray(data.data)) {
                    setOrganismes(data.data);
                } else {
                    console.error("Fetched data is not an array:", data.data);
                    setOrganismes([]);
                }
            } catch (error) {
                console.error("Failed to fetch organismes", error);
                setOrganismes([]);
            }
        };
        fetchOrganismes();
    }, []);

    const options = useMemo(() => {
        if (!Array.isArray(organismes)) return [];
        return organismes.map((org) => ({
            value: String(org.id),
            label: org.name,
        }));
    }, [organismes]);

    const handleSelectChange = (value: string) => {
        const selectedOrg = organismes.find(org => String(org.id) === value);
        if (selectedOrg) {
            setProjet({ ...projet, organisme_id: selectedOrg.id || 0 });
        }
    };

    /*  const handleFileDrop = (acceptedFiles: File[]) => {
         if (acceptedFiles.length > 0) {
             setProjet({ ...projet, filePath: acceptedFiles[0] });
         }
     };
  */
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
        if (!projet.filePath) {
            setError("Veuillez télécharger un fichier");
            return;
        }
        if (!projet.cloturevoter) {
            setError("Veuillez sélectionner une date de clôture");
            return;
        }

        setIsLoading(true);
        try {
            const save = await ajoutProject(projet);
            console.log(save);
            setSuccess("Projet créé avec succès !");
            setTimeout(() => {
                navigate('/projets');
            }, 1500);
        } catch (error: any) {
            console.error("Failed to add project", error);
            setError(error?.response?.data?.message || "Erreur lors de la création du projet");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <PageMeta
                title="Projet de lois | Save Project"
                description="Save Project"
            />
            <PageBreadcrumb pageTitle="Projet" />
            <ComponentCard title="Enrégistrement de projet de lois.">
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
                        <Label>Upload file</Label>
                        <FileInput onChange={handleFileChange} className="custom-class" />
                    </div>
                    {/*  <div>
                        <Label className="pb-3">Importer le fichier de Projet de Lois</Label>
                        <DropzoneComponent
                            value={projet.filePath}
                            onChange={handleFileDrop}
                        />
                    </div> */}
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
                            {isLoading ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                </Form>

            </ComponentCard>
        </div>
    )
}
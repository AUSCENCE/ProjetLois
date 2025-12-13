import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ProjetType from "../../Types/Projet";
import { useEffect, useState } from "react";
import { getProjectsToVote, deleteProject } from "../../Api/project";
import BasicTableProjet from "../../components/tables/BasicTables/BasicTableProjet";
import { useNavigate } from "react-router";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useModal } from "../../hooks/useModal";

export default function ProjetsAVoter() {
    const [projets, setProjets] = useState<ProjetType[]>([]);
    const [selectedProject, setSelectedProject] = useState<ProjetType | null>(null);
    const { isOpen, openModal, closeModal } = useModal();
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const fetchProjet = async () => {
        try {
            const result = await getProjectsToVote();
            console.log(result.data)
            setProjets(result.data || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des projets à voter:", error);
        }
    }

    const handleView = (projet: ProjetType) => {
        navigate(`/projets/${projet.id}`);
    };

    const handleEdit = (projet: ProjetType) => {
        navigate(`/projets/edit/${projet.id}`);
    };

    const handleDeleteClick = (projet: ProjetType) => {
        setSelectedProject(projet);
        openModal();
    };

    const handleConfirmDelete = async () => {
        if (!selectedProject?.id) return;

        setIsDeleting(true);
        try {
            await deleteProject(selectedProject.id);
            await fetchProjet(); // Reload the list
            closeModal();
            setSelectedProject(null);
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            header: "Title",
            accessorKey: "title" as keyof ProjetType,
        },
        {
            header: "Document",
            accessorKey: "filePath" as keyof ProjetType,
        },
        {
            header: "Date Clôture vote",
            accessorKey: "cloturevoter" as keyof ProjetType,
        },
        {
            header: "Organisme",
            accessorKey: "organisme" as keyof ProjetType,
        },
    ];

    useEffect(() => {
        fetchProjet()
    }, [])

    return (
        <>
            <PageMeta
                title="Projet lois | Projets à Voter"
                description="Liste des projets de loi à voter"
            />
            <PageBreadcrumb pageTitle="Projets à Voter" />
            <div className="space-y-6">
                <ComponentCard
                    title="Liste des projets à voter"
                    actions={() => navigate('/projets')}
                    nameAction="Tous les projets"
                >
                    <BasicTableProjet
                        columns={columns}
                        data={projets}
                        defaultOnEdit={handleView}
                        defaultOnModify={handleEdit}
                        defaultOnDelete={handleDeleteClick}
                    />
                </ComponentCard>
            </div>

            <ConfirmDialog
                isOpen={isOpen}
                onClose={closeModal}
                onConfirm={handleConfirmDelete}
                title="Supprimer le projet"
                message={`Êtes-vous sûr de vouloir supprimer le projet "${selectedProject?.title}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                isLoading={isDeleting}
            />
        </>
    );
}

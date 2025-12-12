import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import OrganismeType from "../../Types/Organisme";
import { useEffect, useState } from "react";
import { getOrganismes, deleteOrganisme } from "../../Api/organisme";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { useNavigate } from "react-router";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useModal } from "../../hooks/useModal";

export default function Organismes() {
    const [organismes, setOrganismes] = useState<OrganismeType[]>([]);
    const [selectedOrganisme, setSelectedOrganisme] = useState<OrganismeType | null>(null);
    const { isOpen, openModal, closeModal } = useModal();
    const [isDeleting, setIsDeleting] = useState(false);
    const navigate = useNavigate();

    const fetchOrganismes = async () => {
        try {
            const result = await getOrganismes();
            console.log(result.data);
            setOrganismes(result.data || []);
        } catch (error) {
            console.error("Erreur lors de la récupération des organismes:", error);
        }
    };

    const handleEdit = (organisme: OrganismeType) => {
        navigate(`/organisme/edit/${organisme.id}`);
    };

    const handleDeleteClick = (organisme: OrganismeType) => {
        setSelectedOrganisme(organisme);
        openModal();
    };

    const handleConfirmDelete = async () => {
        if (!selectedOrganisme?.id) return;

        setIsDeleting(true);
        try {
            await deleteOrganisme(selectedOrganisme.id);
            await fetchOrganismes();
            closeModal();
            setSelectedOrganisme(null);
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const columns = [
        {
            header: "Nom",
            accessorKey: "name" as keyof OrganismeType,
        }
    ];

    useEffect(() => {
        fetchOrganismes();
    }, []);

    return (
        <>
            <PageMeta
                title="Projet de Lois - Organisme"
                description="Organisme"
            />
            <PageBreadcrumb pageTitle="Organismes" />
            <div className="space-y-6">
                <ComponentCard
                    title="Liste des Organismes"
                    actions={() => navigate('/organisme/create')}
                    nameAction="Créer un organisme"
                >
                    <BasicTableOne
                        data={organismes}
                        columns={columns}
                        defaultOnModify={handleEdit}
                        defaultOnDelete={handleDeleteClick}
                    />
                </ComponentCard>
            </div>

            <ConfirmDialog
                isOpen={isOpen}
                onClose={closeModal}
                onConfirm={handleConfirmDelete}
                title="Supprimer l'organisme"
                message={`Êtes-vous sûr de vouloir supprimer l'organisme "${selectedOrganisme?.name}" ? Cette action est irréversible.`}
                confirmText="Supprimer"
                cancelText="Annuler"
                isLoading={isDeleting}
            />
        </>
    );
}

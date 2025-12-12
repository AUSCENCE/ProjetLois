import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TextArea from "../../components/form/input/TextArea";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { getProject, voteProject } from "../../Api/project";
import ProjetType from "../../Types/Projet";

export default function ShowProjet() {
    const { isOpen, openModal, closeModal } = useModal();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [projet, setProjet] = useState<ProjetType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [commentaire, setCommentaire] = useState("");
    const [isVoting, setIsVoting] = useState(false);
    const [voteType, setVoteType] = useState<'VALIDER' | 'REJETER' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchProjet = async () => {
            if (!id) return;

            try {
                const data = await getProject(Number(id));
                setProjet(data);
            } catch (error) {
                console.error("Erreur lors du chargement du projet:", error);
                setError("Impossible de charger le projet");
            } finally {
                setIsLoading(false);
            }
        };
        fetchProjet();
    }, [id]);

    const handleVoteClick = (type: 'VALIDER' | 'REJETER') => {
        setVoteType(type);
        openModal();
    };

    const handleSubmitVote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id || !voteType) return;

        setIsVoting(true);
        setError(null);

        try {
            await voteProject(Number(id), voteType, commentaire);
            setSuccess(`Vote "${voteType}" enregistré avec succès !`);
            setCommentaire("");
            closeModal();

            // Reload project data
            const data = await getProject(Number(id));
            setProjet(data);
        } catch (error: any) {
            console.error("Erreur lors du vote:", error);
            setError(error?.response?.data?.message || "Erreur lors de l'enregistrement du vote");
        } finally {
            setIsVoting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
            </div>
        );
    }

    if (!projet) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600">Projet non trouvé</div>
            </div>
        );
    }

    const pdfUrl = projet.filePath
        ? (projet.filePath.startsWith('http')
            ? projet.filePath
            : `http://localhost:8000/storage/${projet.filePath}`)
        : null;

    return (
        <>
            <PageMeta
                title={`Projet lois | ${projet.title}`}
                description="Visualisation et vote du projet"
            />
            <PageBreadcrumb pageTitle={projet.title} />

            {success && (
                <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                    {success}
                </div>
            )}

            <div className="space-y-6">
                <ComponentCard
                    title="Aperçu du document"
                    actions={() => handleVoteClick('VALIDER')}
                    nameAction="Voter"
                >
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-[800px] rounded-lg border border-gray-200 dark:border-gray-700"
                            title="Document PDF"
                        />
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            Aucun document disponible
                        </div>
                    )}
                </ComponentCard>
            </div>

            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-8 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Vote du Projet de lois
                        </h4>
                    </div>
                    <form className="flex flex-col" onSubmit={handleSubmitVote}>
                        {error && (
                            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                {error}
                            </div>
                        )}
                        <div className="custom-scrollbar px-2 pb-3">
                            <div className="">
                                <div className="col-span-2">
                                    <Label>Commentaire (optionnel)</Label>
                                    <TextArea
                                        value={commentaire}
                                        onChange={(e) => setCommentaire(e.target.value)}
                                        placeholder="Ajoutez un commentaire sur votre vote..."
                                        disabled={isVoting}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-between">
                            <Button
                                size="sm"
                                type="button"
                                className="bg-red-600 text-white font-bold hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-300"
                                onClick={() => {
                                    setVoteType('REJETER');
                                    handleSubmitVote(new Event('submit') as any);
                                }}
                                disabled={isVoting}
                            >
                                {isVoting && voteType === 'REJETER' ? "Enregistrement..." : "REJETER"}
                            </Button>
                            <Button
                                size="sm"
                                type="submit"
                                className="bg-green-600 text-white font-bold hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-300"
                                onClick={() => setVoteType('VALIDER')}
                                disabled={isVoting}
                            >
                                {isVoting && voteType === 'VALIDER' ? "Enregistrement..." : "VALIDER"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}
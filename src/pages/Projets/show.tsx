import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import TextArea from "../../components/form/input/TextArea";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getProject, voteProject } from "../../Api/project";
import ProjetType from "../../Types/Projet";
import { useAuth } from "../../context/AuthContext";

export default function ShowProjet() {
    const { user } = useAuth();
    const { isOpen, openModal, closeModal } = useModal();
    const { id } = useParams<{ id: string }>();

    const [projet, setProjet] = useState<ProjetType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [commentaire, setCommentaire] = useState("");
    const [isVoting, setIsVoting] = useState(false);
    const [voteType, setVoteType] = useState<'VALIDER' | 'REJETER' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        console.log("Current user in ShowProjet:", user);

    }, [user]);

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
            const response = await voteProject(Number(id), voteType, commentaire);
            console.log(response);
            setSuccess(response.data.message);
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
            : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000') + `/storage/${projet.filePath}`)
        : null;

    return (
        <>
            <PageMeta
                title={`Projet lois | ${projet.title}`}
                description="Visualisation et vote du projet"
            />
            <PageBreadcrumb pageTitle={projet.title} />

            <div className="mb-4 flex items-center gap-3">
                {projet.etat ? (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Projet Promulgué
                    </span>
                ) : (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        Non Promulgué
                    </span>
                )}
                {projet.avoter && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        À Voter
                    </span>
                )}
            </div>

            {/* 
                Debug Role info - can be removed once verified 
                <div className="mb-4 p-2 bg-gray-100 rounded text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Rôle actuel : <span className="font-bold">{user?.datas?.role}</span> |
                    Peut voter : <span className="font-bold">{(user?.datas?.role === "depute" || user?.datas?.role?.toLowerCase() === "député") ? "OUI" : "NON"}</span>
                </div>
            */}

            {success && (
                <div className="mb-4 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                    {success}
                </div>
            )}

            <div className="space-y-6">
                <ComponentCard
                    title="Aperçu du document"
                    actions={(projet.avoter && (user?.role == "depute" || user?.role == "député")) ? () => handleVoteClick('VALIDER') : undefined}
                    nameAction={(projet.avoter && (user?.role == "depute" || user?.role == "député")) ? "Voter" : undefined}
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
                                        onChange={(val) => setCommentaire(val)}
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
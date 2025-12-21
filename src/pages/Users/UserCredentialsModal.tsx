import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";

interface UserCredentialsModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail: string;
    password?: string;
}

export default function UserCredentialsModal({ isOpen, onClose, userEmail, password }: UserCredentialsModalProps) {
    const shareText = `Voici vos accès pour ProjetLois :\nEmail: ${userEmail}\nMot de passe: ${password || "généré automatiquement"}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareText);
        alert("Accès copiés dans le presse-papier !");
    };

    const shareWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(url, "_blank");
    };

    const shareFacebook = () => {
        // Facebook sharer doesn't easily support raw text sharing without a URL.
        // We'll share the app URL with the text as a quote if possible.
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}&quote=${encodeURIComponent(shareText)}`;
        window.open(url, "_blank");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[450px] m-4">
            <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-10 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-50 text-success-500 dark:bg-success-500/10">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                </div>

                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    Membre Créé avec Succès !
                </h4>
                <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
                    Voici les identifiants de connexion que vous pouvez partager avec le nouveau membre.
                </p>

                <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-left dark:border-gray-800 dark:bg-white/[0.03]">
                    <div className="mb-3">
                        <span className="text-xs font-medium uppercase text-gray-400">Email</span>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{userEmail}</p>
                    </div>
                    <div>
                        <span className="text-xs font-medium uppercase text-gray-400">Mot de passe temporaire</span>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{password || "********"}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <Button onClick={copyToClipboard} variant="outline" className="w-full justify-center" startIcon={
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                    }>
                        Copier les accès
                    </Button>

                    <div className="flex gap-3">
                        <Button onClick={shareWhatsApp} className="flex-1 justify-center bg-[#25D366] hover:bg-[#20ba5a] text-white border-none" startIcon={
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        }>
                            WhatsApp
                        </Button>
                        <Button onClick={shareFacebook} className="flex-1 justify-center bg-[#1877F2] hover:bg-[#166fe5] text-white border-none" startIcon={
                            <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11.6666 11.2503H13.7499L14.5833 7.91699H11.6666V6.25033C11.6666 5.39251 11.6666 4.58366 13.3333 4.58366H14.5833V1.78374C14.3118 1.7477 13.2858 1.66699 12.2023 1.66699C9.94025 1.66699 8.33325 3.04771 8.33325 5.58342V7.91699H5.83325V11.2503H8.33325V18.3337H11.6666V11.2503Z" />
                            </svg>
                        }>
                            Facebook
                        </Button>
                    </div>

                    <Button onClick={onClose} variant="outline" className="mt-4 border-none text-gray-400 hover:text-gray-600">
                        Fermer
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";

export default function ShowProjet() {

    return (
        <>
            <PageMeta
                title="Projet lois | Projets"
                description="Projets"
            />
            <PageBreadcrumb pageTitle="Projets" />
            <div className="space-y-6">
                <ComponentCard title="Aperçu du document">
                    <iframe
                        src="./KANHONOU_Auscence___Bachelor___Licence (3).pdf"
                        className="w-full h-[800px] rounded-lg border border-gray-200 dark:border-gray-700"
                        title="Document PDF"
                    />
                </ComponentCard>
            </div>
        </>
    );
}
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import ProjetType from "../../Types/Projet";
import { useEffect, useState } from "react";
import { getProjects } from "../../Api/project";

export default function Projets() {
    const [projets, setProjets] = useState<ProjetType[]>([]);

    const fetchProjet = async () => {

        const result = await getProjects();
        console.log(result.data)
        setProjets(result.data || []);

    }

    const columns = [
        {
            header: "Title",
            accessorKey: "title" as keyof ProjetType,
        },
        {
            header: "Etat",
            accessorKey: "etat" as keyof ProjetType,
        },
        {
            header: "A Voter",
            accessorKey: "avoter" as keyof ProjetType,
        },
        {
            header: "Date Clôture vote",
            accessorKey: "cloturevoter" as keyof ProjetType,
        },
        {
            header: "Organisme",
            accessorKey: "organisme.name" as keyof ProjetType,
        },
    ];
    useEffect(() => {

        fetchProjet()

    }, [])
    return (
        <>
            <PageMeta
                title="Projet lois | Projets"
                description="Projets"
            />
            <PageBreadcrumb pageTitle="Projets" />
            <div className="space-y-6">
                <ComponentCard title="Liste des projets">
                    <BasicTableOne columns={columns} data={projets} />
                </ComponentCard>
            </div>
        </>
    );
}

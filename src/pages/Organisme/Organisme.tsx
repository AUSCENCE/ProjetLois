import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { useEffect, useState } from "react";
import { ajoutOrganisme, getOrganismes } from "../../Api/organisme";
import OrganismeType from "../../Types/Organisme";

export default function Organisme() {
    const [organisme, setOrganisme] = useState<OrganismeType | null>(null)
    const { isOpen, openModal, closeModal } = useModal();
    const [name, setName] = useState("");
    const [organismes, setOrganismes] = useState<OrganismeType[]>([]);

    const fetchOrganismes = async () => {
        const result = await getOrganismes();
        console.log(result.data)
        setOrganismes(result.data || []);
    };


    const handleSave = async (e) => {
        e.preventDefault();
        const newOrganisme = {
            name: name
        };
        setOrganisme(newOrganisme);
        await ajoutOrganisme(newOrganisme);

        // Handle save logic here
        console.log("Saving changes...");
        closeModal();
        setName("");
        fetchOrganismes();
    };
    const handleEdit = (row: null) => {
        console.log("Modif" + row)
    }

    const handleUpdate = (row: null) => {
        console.log("update" + row)

    }
    const handleDelete = (row: null) => {
        console.log("delete" + row)

    }

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
            <PageBreadcrumb pageTitle="Organisme" />
            <div className="space-y-6">
                <ComponentCard title="Organisme" actions={openModal}>
                    <BasicTableOne
                        data={organismes}
                        columns={columns}
                        defaultOnEdit={handleEdit}
                        defaultOnDelete={handleDelete}
                        defaultOnModify={handleUpdate}
                    />
                </ComponentCard>
            </div>


            <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
                <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-8 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Organisme
                        </h4>
                    </div>
                    <form className="flex flex-col" onSubmit={handleSave}>
                        <div className="custom-scrollbar  px-2 pb-3">

                            <div className="">
                                <div className="col-span-2">
                                    <Label>Nom de l'organisme</Label>
                                    <Input type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Ex : Présidence"
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-between">
                            <Button size="sm" variant="outline" onClick={closeModal}>
                                Fermer
                            </Button>
                            <Button size="sm" type="submit">
                                Enregistrer
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
}

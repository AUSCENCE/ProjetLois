import Organisme from "./Organisme";
import User from "./User";

interface Projet {
    id?: number;
    title: string;
    organisme_id: number,
    filePath?: File,
    etat?: boolean,
    avoter?: boolean,
    cloturevoter?: Date,
    organisme?: Organisme,
    createBy?: User,
    votants?: User[]
}

export default Projet;
interface ICompte {
    idCompte: string;
    codeClient: string;
    intitule: string;
    soldeComptable: number;
    soldeDisponible: number;
    soldeValeur: number;
    soldeReel: number;
    dateSolde: Date;
    ferme: boolean;
    bloque: boolean;
    numeroCarte: string;
    dateValiditeCarte: Date;
    depassement: boolean;
    montantInterets: number;
    soldeExtrait: number;
    dateExtrait: Date;
    cleIban: string;
    swift: string;
    idAdresse: number;
    preferenceRang: number;
    preferenceLibelle: string;
    preferenceAffiche: string;
    soldeDeviseNationale: number;
    overdraftLimitStatus: string;
}
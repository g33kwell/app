interface IArcotV6Form {
    codeBanque: string;
    login: string;
    loginV3: string;
    mdp: string;
    codeLangue: string;
    enrollmentType: string;
    otpInput: boolean;
    pam: string;
    listeQuestionSelected: any[];
    questionSelected: string[];
    enonceQuestionSelected: string[];
    reponseSelected: string[];
    nbQuestions: number;
    oldPassword: string;
    password: string;
    password1: string;
    radLieu: string;
    pwdMaxLength: number;
    pwdMinLength: number;
    pwdMinAlpha: number;
    pwdMinNum: number;
    arcotId: string;
    challenge: string;
    organizationName: string;
    signedChallenge: string;
    sessionId: string;
    phoneNumber: string;
    titleKey: string;
    messageKey0: string;
    messageKey1: string;
    messageKey2: string;
    userQuestionsList: any[];
    qnaDto: any;
    arcotIdStatus: any;
    personnalProfileChangeRedirect: boolean;
    clientArcotIdPresent: string;
    persoProfilOKRedirect: boolean;
    qnaLocked: boolean;
    smsOtp: string;
    clientType: string;
    numberOfMinutesToWait: number;
    maximumNumberOfSentSmsReached: boolean;
    downloadArcotIdRedirectAction: string;
    qnaFeatureEnabled: boolean;
    nbReponses: number;
}
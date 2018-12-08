export class Candidate {
    constructor(
        public id: string,
        public firstName: string,
        public nickname: string,
        public genderSelf: string,
        public genderFind: string,
        public isASmokerSelf: boolean,
        public isASmokerFind: boolean,
        public descriptionSelf: string,
        public descriptionFind: string,
        public interestsSelf: string,
        public interestsFind: string,
        public songGenreSelf: string,
        public songGenreFind: string,
        public lovePetsSelf: boolean,
        public lovePetsFind: boolean,
        public hobbiesSelf: string,
        public intentions: string,
    ) {}
}

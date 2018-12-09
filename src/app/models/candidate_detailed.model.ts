export class CandidateDetailed {
    constructor(
        public id: string,
        public firstName: string,
        public nickname: string,
        public genderSelf: string,
        public genderFind: string,
        public isASmokerSelf: string,
        public isASmokerFind: string,
        public descriptionSelf: string,
        public descriptionFind: string,
        public interestsSelf: string,
        public interestsFind: string,
        public songGenreSelf: string,
        public songGenreFind: string,
        public lovePetsSelf: string,
        public lovePetsFind: string,
        public hobbiesSelf: string,
        public intentions: string,
    ) {}
}

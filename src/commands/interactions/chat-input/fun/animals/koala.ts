import { BaseSRACommand } from "."
import { SomeRandomApiEndpoints } from "../../../../../utils/constants"

export default class KoalaAnimalCommand extends BaseSRACommand {
    constructor() {
        super(SomeRandomApiEndpoints.ANIMAL_KOALA, "de un koala 🐨")
    }
}
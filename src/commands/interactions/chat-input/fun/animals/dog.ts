import { BaseSRACommand } from "."
import { SomeRandomApiEndpoints } from "../../../../../utils/constants"

export default class DogAnimalCommand extends BaseSRACommand {
    public constructor() {
        super(SomeRandomApiEndpoints.ANIMAL_DOG, "de un perrito 🐶")
    }
}
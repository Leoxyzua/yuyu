import { BaseSRACommand } from "."
import { SomeRandomApiEndpoints } from "../../../../../utils/constants"

export default class BirdAnimalCommand extends BaseSRACommand {
    public constructor() {
        super(SomeRandomApiEndpoints.ANIMAL_BIRD, "de una ave 🐦")
    }
}
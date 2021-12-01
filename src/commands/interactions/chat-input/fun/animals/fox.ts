import { BaseSRACommand } from "."
import { SomeRandomApiEndpoints } from "../../../../../utils/constants"

export default class FoxAnimalCommand extends BaseSRACommand {
    constructor() {
        super(SomeRandomApiEndpoints.ANIMAL_FOX, "de un zorro 🦊")
    }
}
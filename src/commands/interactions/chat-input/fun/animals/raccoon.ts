import { BaseSRACommand } from "."
import { SomeRandomApiEndpoints } from "../../../../../utils/constants"

export default class RaccoonAnimalCommand extends BaseSRACommand {
    constructor() {
        super(SomeRandomApiEndpoints.ANIMAL_RACCOON, "de un mapache 🦝")
    }
}
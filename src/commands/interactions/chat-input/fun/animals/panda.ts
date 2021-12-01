import { BaseSRACommand } from "."
import { SomeRandomApiEndpoints } from "../../../../../utils/constants"

export default class PandaAnimalCommand extends BaseSRACommand {
    constructor() {
        super(SomeRandomApiEndpoints.ANIMAL_PANDA, "de un panda 🐼")
    }
}
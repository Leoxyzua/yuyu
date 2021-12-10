import { BaseSRACommand } from "."
import { SomeRandomApiEndpoints } from "../../../../../utils/constants"

export default class RedPandaAnimalCommand extends BaseSRACommand {
    public constructor() {
        super(SomeRandomApiEndpoints.ANIMAL_RED_PANDA, "de un panda rojo 🐼🟥")
    }
}
import { BaseSRACommand } from "."
import { SomeRandomApiEndpoints } from "../../../../../utils/constants"

export default class CatAnimalCommand extends BaseSRACommand {
    public constructor() {
        super(SomeRandomApiEndpoints.ANIMAL_CAT, "de un lindo gato 🐈")
    }
}
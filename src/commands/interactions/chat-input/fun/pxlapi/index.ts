import { PxlClient } from "../../../../../utils/pxlapi"
import { Client } from "detritus-client-rest"

export const client = new PxlClient(process.env.PXLAPI_TOKEN!, new Client())
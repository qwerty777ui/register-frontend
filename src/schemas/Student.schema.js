import { string } from "zod";
import {humanSchema} from "@/schemas/Human.schema.js";

export const studentSchema = humanSchema.extend({
    group: string().trim().min(1, {'message': 'Группа не может быть пустой'}),
    faculty: string().trim().min(1, {'message': 'Факультет не может быть пустым'}),
})
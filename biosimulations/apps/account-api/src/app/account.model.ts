import { prop } from "@typegoose/typegoose";
import { IsString, IsBoolean, IsJSON } from "class-validator";
import { ProfileDTO } from '@biosimulations/datamodel/core'
import { DTO } from '@biosimulations/datamodel/utils'

// TODO abstract this to the datamodel library 
export class Account {
    @IsString()
    @prop({ required: true })
    _id: string

    @IsString()
    @prop({ required: true, unique: true, })
    username: string

    // TODO get this to work with validation and openapi
    @IsJSON()
    @prop({ required: false })
    profile?: ProfileDTO

    // The date that the terms were accepted in seconds from epoch
    @IsString()
    @prop({ required: true })
    termsAccepted: number

    @IsBoolean()
    @prop({ required: true })
    admin: boolean
}


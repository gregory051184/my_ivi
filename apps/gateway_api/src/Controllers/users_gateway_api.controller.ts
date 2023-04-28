import {Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {ClientProxy} from "@nestjs/microservices";
import {RegistrationDto} from "../../../auth_reg/src/users/USER_DTO/registrationDto";
import {UserUpdateDto} from "../../../auth_reg/src/users/USER_DTO/userUpdateDto";
import {AddRoleToUserDTO} from "../../../auth_reg/src/users/USER_DTO/addRoleDto";
import {Current_user_or_admin_guard, Roles, RolesGuard, User} from "@lib/global";
import {AddReviewToUserDTO} from "../../../auth_reg/src/users/USER_DTO/addReviewDto";
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags('Пользователи')
@Controller("/users")
export class UsersGatewayApiController {
    constructor(@Inject("USERS") private readonly usersClient: ClientProxy) {
    }

    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({status: 200, type: User})
    @Post()
    async createUser(@Body() dto: RegistrationDto) {
        const role = ['ADMIN']
        return this.usersClient.send({cmd: "user_registration"}, {dto, role});
    };

    @ApiOperation({summary: 'Получить всех пользователей. Необходима роль Администратора'})
    @ApiResponse({status: 200, type: [User]})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get()
    async getAllUsers() {
        return this.usersClient.send({cmd: "get_all_users"}, {});
    };

    @ApiOperation({summary: 'Получить пользователя по id. Необходима роль Администратора' +
            ' или быть этим пользователем.'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(Current_user_or_admin_guard)
    @Get(":id")
    async getUserById(@Param("id") id: string) {
        return this.usersClient.send({cmd: "get_user_by_id"}, {id});

    };

    @ApiOperation({summary: 'Получить пользователя по email. Необходима роль Администратора' +
            ' или быть этим пользователем.'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(Current_user_or_admin_guard)
    @Get("email/:email")
    async getUserByEmail(@Param("email") email: string) {
        return this.usersClient.send({cmd: "get_user_by_email"}, {email});
    };

    @ApiOperation({summary: 'Получить пользователя по номеру телефона(phone). Необходима роль Администратора' +
            ' или быть этим пользователем.'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(Current_user_or_admin_guard)
    @Get("phone/:number")
    async getUserByPhone(@Param("number") number: string) {
        return this.usersClient.send({cmd: "get_user_by_phone"}, {number});
    };

    @ApiOperation({summary: 'Получить всех пользователей фильтруя их по возрасту(age) и стране(country).' +
            ' Необходима роль Администратора'})
    @ApiResponse({status: 200, type: [User]})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get("filter/:value1/:value2")
    async UserCountryAndAgeFilters(@Param("value1") value1: string,
                        @Param("value2") value2?: string,
                        @Req() req?: any) {
        return this.usersClient.send({cmd: "get_users_by_params"}, {value1, value2});
    };

    @ApiOperation({summary: 'Получить всех пользователей фильтруя их по возрасту(age) ИЛИ по стране(country).' +
            ' Необходима роль Администратора'})
    @ApiResponse({status: 200, type: [User]})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get("filter/:value")
    async UserCountryOrAgeFilter(@Param("value1") value: string,
                                   @Req() req?: any) {
        return this.usersClient.send({cmd: "get_users_by_param"}, {value});
    };

    @ApiOperation({summary: 'Получить всех пользователей фильтруя их по роли пользователя(Например, "USER").' +
            ' Необходима роль Администратора'})
    @ApiResponse({status: 200, type: [User]})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Get("role/:role")
    async getUsersByRole(@Param("role") role: string,) {
        return this.usersClient.send({cmd: "get_users_by_role"}, {role});
    };

    @ApiOperation({summary: 'Изменить пользователя по id. Необходима роль Администратора' +
            ' или быть этим пользователем.'})
    @ApiResponse({status: 200})
    @UseGuards(Current_user_or_admin_guard)
    @Put(":id")
    async updateUser(@Param("id") id: string, @Body() dto: UserUpdateDto) {
        return this.usersClient.send({cmd: "update_user"}, {dto, id});
    };


    @ApiOperation({summary: 'Удалить пользователя по id. Необходима роль Администратора' +
            ' или быть этим пользователем.'})
    @ApiResponse({status: 200})
    @UseGuards(Current_user_or_admin_guard)
    @Delete(":id")
    async deleteUser(@Param("id") id: string) {
        return this.usersClient.send({cmd: "delete_user"}, {id});
    };


    @ApiOperation({summary: 'Добавить роль пользователя по id пользователя и значению роли(value).' +
            ' Необходима роль Администратора.'})
    @ApiResponse({status: 200, type: User})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post("/addrole")
    async addRoleToUser(@Body() dto: AddRoleToUserDTO) {
        try {
            return this.usersClient.send({cmd: "add_role_to_user"}, {dto});
        } catch (err) {
            return {message: `Такой роли нет или она уже есть у данного пользователя`}
        }
    }

    @ApiOperation({summary: 'Удалить роль пользователя по id пользователя и значению роли(value).' +
            ' Необходима роль Администратора.'})
    @ApiResponse({status: 200, type: User})
    @Roles('ADMIN')
    @UseGuards(RolesGuard)
    @Post("/deleterole")
    async deleteRoleFromUser(@Body() dto: AddRoleToUserDTO) {
        try {
            return this.usersClient.send({cmd: "delete_role_from_user"}, {dto});
        } catch (err) {
            return {message: `Такой роли нет или её нет у данного пользователя`}
        }
    }

    @ApiOperation({summary: 'Добавить обзор пользователя на фильм по id пользователя и названию обзора (value).' +
            ' Необходима роль Администратора.'})
    @ApiResponse({status: 200, type: User})
    @Post("/addreview")
    async addReviewToUser(@Body() dto: AddReviewToUserDTO) {
        try {
            return this.usersClient.send({cmd: "add_review_to_user"}, {dto});
        } catch (err) {
            return {message: `Такой обзор уже есть у данного пользователя`}
        }
    }

    @ApiOperation({summary: 'Удалить обзор пользователя на фильм по id пользователя и названию обзора (value).' +
            ' Необходима роль Администратора.'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(Current_user_or_admin_guard)
    @Post("/deletereview")
    async deleteReviewFromUser(@Body() dto: AddReviewToUserDTO) {
        try {
            return this.usersClient.send({cmd: "delete_review_from_user"}, {dto});
        } catch (err) {
            return {message: `Такого обзора нет у данного пользователя`}
        }
    }
}

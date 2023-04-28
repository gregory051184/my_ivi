import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {RegistrationDto} from "./USER_DTO/registrationDto";
import {User} from "@lib/global";
import {UserUpdateDto} from "./USER_DTO/userUpdateDto";
import * as bcrypt from "bcryptjs";
import {where} from "sequelize";


@Injectable()
export class UserService {
    constructor(@InjectModel(User) private readonly userRepository: typeof User) {
    }

    async user_registration(dto: RegistrationDto, role: [string]) {
        const hash_password = await bcrypt.hash(dto.password, 5);
        const user = await this.userRepository.create({...dto, password: hash_password, roles: role});
        return user;

    };

    async getAllUsers() {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users;
    };

    async getUserById(user_id: string) {
        const user = await this.userRepository.findByPk(+user_id, {include: {all: true}});
        return user;
    };

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({where: {email: email}, include: {all: true}});
        return user;
    };

    async getUserByPhone(phone: string) {
        const user = await this.userRepository.findOne({where: {phone: phone}, include: {all: true}});
        return user;
    };

    async getUsersByRole(role: string) {
        const users = await this.userRepository.findAll({include: {all: true}});
        return users.filter(user => user.roles.includes(role));
    }

    async UserCountryAndAgeFilters(param1: string, param2: string) {
        const users: User[] = await this.userRepository.findAll({include: {all: true}});
        const first_param = await this.identifyRequestString(param1, users);
        const second_param = await this.identifyRequestString(param2, first_param);
        return second_param;
    }

    async UserCountryOrAgeFilter(param1: string) {
        const users: User[] = await this.userRepository.findAll();
        return  await this.identifyRequestString(param1, users);

    }

    private async identifyRequestString(reqString: string, users) {
        if (reqString.length < 3 && reqString.match(/\d+/g)) {
            return users.filter(user => user.age === +reqString)
        }else {
            return users.filter(user => user.country === reqString)
        }
    }

    async updateUser(dto: UserUpdateDto, id) {
        const hash_password = await bcrypt.hash(dto.password, 5);
        const user = await this.userRepository.update({...dto, password: hash_password}, {where: {id: +id}});
        return user;
    };

    async deleteUser(id: string) {
        const user = await this.userRepository.destroy({where: {id: +id}});
        return user;
    };

    async addRoleToUser(user_id: string, role?: string) {
        const user = await this.getUserById(user_id);
        if (role && !user.roles.includes(role)) {
            user.roles.push(role)
            const updated_user = await this.userRepository.update({...user, roles: user.roles},
                {where: {id: +user.id}});
            return updated_user;
        } else {
            return user
        }
    }
    async deleteRoleFromUser(user_id: string, role: string) {
        const user = await this.getUserById(user_id);
        if (role && user.roles.includes(role)) {
            const role_index = user.roles.findIndex(item => item === role)
            if(role_index !== (+user.roles.length - 1)) {
                [user.roles[role_index], user.roles[+user.roles.length - 1]] =
                    [user.roles[+user.roles.length - 1], user.roles[role_index]];
                user.roles.splice(role_index, role_index);
                user.roles.pop();
                await this.userRepository.update({...user, roles:user.roles}, {where: {id: +user.id}});
                return user;
            }else {
                user.roles.pop();
                return user
            }
        }else {
            return user;
        }
    }


    async addReviewToUser(user_id: string, review: string) {
        const user = await this.getUserById(user_id);
        if (review && !user.reviews.includes(review)) {
            user.reviews.push(review)
            const updated_user = await this.userRepository.update({...user, reviews: user.reviews},
                {where: {id: +user.id}});
            return updated_user;
        } else {
            return user
        }
    }

    async deleteReviewFromUser(user_id: string, review: string) {
        const user = await this.getUserById(user_id);
        if (review && user.reviews.includes(review)) {
            const review_index = user.reviews.findIndex(item => item === review)
            if(review_index !== (+user.reviews.length - 1)) {
                [user.reviews[review_index], user.reviews[+user.reviews.length - 1]] =
                    [user.reviews[+user.reviews.length - 1], user.reviews[review_index]];
                user.reviews.splice(review_index, review_index);
                user.reviews.pop();
                await this.userRepository.update({...user, reviews:user.reviews}, {where: {id: +user.id}});
                return user;
            }else {
                user.reviews.pop();
                return user
            }
        }else {
            return user;
        }
    }
}


